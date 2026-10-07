import { useState, useCallback, useEffect } from 'react'
import { useAuthFetch } from './useAuthFetch'
import {
  savePendingNote,
  getPendingNotes,
  deletePendingNote,
  cacheNotes,
  getCachedNotes,
} from '../utils/offlineDb'

export const useNotes = () => {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const authFetch = useAuthFetch()

  // Sync pending offline notes to backend MongoDB
  const syncPendingNotes = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return

    try {
      const pending = await getPendingNotes()
      if (!pending || pending.length === 0) return

      setSyncing(true)

      for (const task of pending) {
        try {
          if (task.action === 'update') {
            // Update existing note on server
            const res = await authFetch.put(`/notes/${task.targetId}`, {
              title: task.title,
              body: task.body,
            })

            if (res.ok) {
              const data = await res.json()
              const payload = data.data || data
              const syncedNote = payload.note || payload
              await deletePendingNote(task.tempId)

              setEntries((prev) =>
                prev.map((item) =>
                  item._id === task.targetId
                    ? { ...syncedNote, isPendingSync: false }
                    : item
                )
              )
            }
          } else if (task.action === 'delete') {
            // Delete existing note on server
            const res = await authFetch.delete(`/notes/${task.targetId}`)
            if (res.ok) {
              await deletePendingNote(task.tempId)
            }
          } else {
            // Default: Create new note
            const res = await authFetch.post('/notes', {
              title: task.title,
              body: task.body,
            })

            if (res.ok) {
              const data = await res.json()
              const payload = data.data || data
              const syncedNote = payload.note || payload

              await deletePendingNote(task.tempId)

              setEntries((prev) =>
                prev.map((item) =>
                  (item.tempId === task.tempId || item._id === task.tempId) ? syncedNote : item
                )
              )
            }
          }
        } catch {}
      }
    } catch {} finally {
      setSyncing(false)
    }
  }, [authFetch])

  // Fetch all notes (falls back to IndexedDB when offline)
  const fetchNotes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await authFetch.get('/notes')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to fetch notes')
      }
      const data = await res.json()
      const payload = data.data || data
      const fetchedNotes = payload.notes || (Array.isArray(payload) ? payload : [])

      // Cache online notes to IndexedDB for future offline reading
      await cacheNotes(fetchedNotes)

      // Include any pending notes that have not synced yet
      const pending = await getPendingNotes()
      setEntries([...pending, ...fetchedNotes])

      // Attempt syncing if online and pending notes exist
      if (pending.length > 0) {
        syncPendingNotes()
      }
    } catch (err) {
      // Offline fallback: load cached notes + pending notes
      try {
        const cached = await getCachedNotes()
        const pending = await getPendingNotes()
        if (cached.length > 0 || pending.length > 0) {
          setEntries([...pending, ...cached])
        } else {
          setError(err.message)
        }
      } catch {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [authFetch, syncPendingNotes])

  // Create note (creates locally in IndexedDB if offline)
  const addNote = useCallback(
    async (newEntry) => {
      setError(null)

      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline) {
        const tempNote = {
          tempId: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          _id: `offline-${Date.now()}`,
          title: newEntry.title,
          body: newEntry.body,
          createdAt: new Date().toISOString(),
          isPendingSync: true,
        }

        // Optimistically update UI immediately
        setEntries((prev) => [tempNote, ...prev])

        // Safely persist to storage
        try {
          await savePendingNote(tempNote)
        } catch {}

        // Register background sync in background
        if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready
            .then((reg) => reg.sync.register('sync-pending-notes'))
            .catch(() => {})
        }

        return tempNote
      }

      // Online path: Attempt network POST
      try {
        const res = await authFetch.post('/notes', newEntry)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || 'Failed to create note')
        }
        const data = await res.json()
        const payload = data.data || data
        const newDbNote = payload.note || payload
        setEntries((prev) => [newDbNote, ...prev])
        return newDbNote
      } catch (err) {
        // Fallback if network drops mid-request
        const tempNote = {
          tempId: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          _id: `offline-${Date.now()}`,
          title: newEntry.title,
          body: newEntry.body,
          createdAt: new Date().toISOString(),
          isPendingSync: true,
        }

        // Optimistically update UI immediately
        setEntries((prev) => [tempNote, ...prev])

        // Safely persist to storage
        try {
          await savePendingNote(tempNote)
        } catch {}

        return tempNote
      }
    },
    [authFetch]
  )

  // Delete note (supports offline deletes)
  const deleteNote = useCallback(
    async (id) => {
      setError(null)

      // Optimistically remove from UI immediately
      setEntries((prev) => prev.filter((entry) => entry._id !== id && entry.tempId !== id))

      // If note was offline-created and hasn't synced yet, delete directly from pending queue
      if (typeof id === 'string' && id.startsWith('offline-')) {
        await deletePendingNote(id)
        return
      }

      // If offline: queue delete task for background sync
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        try {
          await savePendingNote({
            tempId: `delete-${id}`,
            targetId: id,
            action: 'delete',
          })
        } catch {}
        return
      }

      // Online path: Call network DELETE
      try {
        const res = await authFetch.delete(`/notes/${id}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || 'Failed to delete note')
        }
      } catch (err) {
        // Fallback: Queue delete task if request fails
        try {
          await savePendingNote({
            tempId: `delete-${id}`,
            targetId: id,
            action: 'delete',
          })
        } catch {}
      }
    },
    [authFetch]
  )

  // Update note (supports offline edits)
  const updateNote = useCallback(
    async (id, updatedFields) => {
      setError(null)

      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      // Case A: Editing a note that was created offline and has not synced yet
      if (typeof id === 'string' && id.startsWith('offline-')) {
        setEntries((prev) =>
          prev.map((entry) =>
            (entry._id === id || entry.tempId === id)
              ? { ...entry, ...updatedFields, isPendingSync: true }
              : entry
          )
        )

        try {
          const pending = await getPendingNotes()
          const existing = pending.find((p) => p.tempId === id || p._id === id)
          if (existing) {
            await savePendingNote({ ...existing, ...updatedFields })
          }
        } catch {}

        return { _id: id, ...updatedFields, isPendingSync: true }
      }

      // Case B: Offline edit of an existing server note
      if (isOffline) {
        const optimisticNote = {
          _id: id,
          ...updatedFields,
          isPendingSync: true,
        }

        // Optimistically update UI immediately
        setEntries((prev) =>
          prev.map((entry) => (entry._id === id ? { ...entry, ...updatedFields, isPendingSync: true } : entry))
        )

        // Queue update task in IndexedDB / localStorage
        try {
          const updateTask = {
            tempId: `update-${id}`,
            targetId: id,
            action: 'update',
            title: updatedFields.title,
            body: updatedFields.body,
            createdAt: new Date().toISOString(),
          }
          await savePendingNote(updateTask)
        } catch {}

        return optimisticNote
      }

      // Online path: Attempt network PUT
      try {
        const res = await authFetch.put(`/notes/${id}`, updatedFields)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || 'Failed to update note')
        }
        const data = await res.json()
        const payload = data.data || data
        const updatedDbNote = payload.note || payload
        setEntries((prev) =>
          prev.map((entry) => (entry._id === id ? updatedDbNote : entry))
        )
        return updatedDbNote
      } catch (err) {
        // Fallback if network drops mid-request
        const optimisticNote = {
          _id: id,
          ...updatedFields,
          isPendingSync: true,
        }

        setEntries((prev) =>
          prev.map((entry) => (entry._id === id ? { ...entry, ...updatedFields, isPendingSync: true } : entry))
        )

        try {
          const updateTask = {
            tempId: `update-${id}`,
            targetId: id,
            action: 'update',
            title: updatedFields.title,
            body: updatedFields.body,
            createdAt: new Date().toISOString(),
          }
          await savePendingNote(updateTask)
        } catch {}

        return optimisticNote
      }
    },
    [authFetch]
  )

  // Listen to browser online event and Service Worker sync messages
  useEffect(() => {
    const handleOnline = () => {
      syncPendingNotes()
    }

    const handleMessage = (event) => {
      if (event.data && event.data.type === 'SYNC_PENDING_NOTES') {
        syncPendingNotes()
      }
    }

    window.addEventListener('online', handleOnline)
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage)
      }
    }
  }, [syncPendingNotes])

  return {
    entries,
    setEntries,
    loading,
    error,
    syncing,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    syncPendingNotes,
  }
}

export default useNotes