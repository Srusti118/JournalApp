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

      for (const note of pending) {
        try {
          const res = await authFetch.post('/notes', {
            title: note.title,
            body: note.body,
          })

          if (res.ok) {
            const data = await res.json()
            const payload = data.data || data
            const syncedNote = payload.note || payload

            await deletePendingNote(note.tempId)

            setEntries((prev) =>
              prev.map((item) =>
                (item.tempId === note.tempId || item._id === note.tempId) ? syncedNote : item
              )
            )
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

  // Delete note
  const deleteNote = useCallback(
    async (id) => {
      setError(null)

      // If note was offline-created and hasn't synced yet
      if (typeof id === 'string' && id.startsWith('offline-')) {
        await deletePendingNote(id)
        setEntries((prev) => prev.filter((entry) => entry._id !== id && entry.tempId !== id))
        return
      }

      try {
        const res = await authFetch.delete(`/notes/${id}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || 'Failed to delete note')
        }
        setEntries((prev) => prev.filter((entry) => entry._id !== id))
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [authFetch]
  )

  // Update note
  const updateNote = useCallback(
    async (id, updatedFields) => {
      setError(null)

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
        setError(err.message)
        throw err
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