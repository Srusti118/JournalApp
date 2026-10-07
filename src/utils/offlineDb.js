const DB_NAME = 'sanctuary-offline-db'
const DB_VERSION = 2
const STORE_PENDING = 'pending_notes'
const STORE_CACHED = 'cached_notes'
const LS_PENDING_KEY = 'sanctuary_ls_pending_notes'
const LS_CACHED_KEY = 'sanctuary_ls_cached_notes'

let dbInstance = null

// Helper for localStorage fallback
const getLs = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const setLs = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

// Open or upgrade IndexedDB connection with connection caching & timeout protection
const openDb = () => {
  if (dbInstance) return Promise.resolve(dbInstance)

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB is not supported on this device'))
    }

    const timer = setTimeout(() => {
      reject(new Error('IndexedDB open request timed out'))
    }, 2000)

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        if (!db.objectStoreNames.contains(STORE_PENDING)) {
          db.createObjectStore(STORE_PENDING, { keyPath: 'tempId' })
        }

        if (!db.objectStoreNames.contains(STORE_CACHED)) {
          db.createObjectStore(STORE_CACHED, { keyPath: '_id' })
        }
      }

      request.onsuccess = () => {
        clearTimeout(timer)
        dbInstance = request.result

        dbInstance.onversionchange = () => {
          dbInstance.close()
          dbInstance = null
        }

        resolve(dbInstance)
      }

      request.onerror = () => {
        clearTimeout(timer)
        reject(request.error || new Error('Failed to open IndexedDB'))
      }

      request.onblocked = () => {
        clearTimeout(timer)
        reject(new Error('IndexedDB database upgrade blocked'))
      }
    } catch (err) {
      clearTimeout(timer)
      reject(err)
    }
  })
}

// 1. Pending Notes Operations
export const savePendingNote = async (note) => {
  // Always update localStorage as immediate fallback
  const currentLs = getLs(LS_PENDING_KEY)
  const filteredLs = currentLs.filter((n) => n.tempId !== note.tempId)
  setLs(LS_PENDING_KEY, [note, ...filteredLs])

  try {
    const db = await openDb()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PENDING, 'readwrite')
      const store = tx.objectStore(STORE_PENDING)
      store.put(note)

      tx.oncomplete = () => resolve(note)
      tx.onerror = () => resolve(note) // fallback to localStorage resolved note
    })
  } catch {
    return note
  }
}

export const getPendingNotes = async () => {
  try {
    const db = await openDb()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PENDING, 'readonly')
      const store = tx.objectStore(STORE_PENDING)
      const request = store.getAll()

      request.onsuccess = () => {
        const idbNotes = request.result || []
        const lsNotes = getLs(LS_PENDING_KEY)
        // Merge notes, deduplicating by tempId
        const map = new Map()
        for (const item of [...idbNotes, ...lsNotes]) {
          if (item && item.tempId) map.set(item.tempId, item)
        }
        resolve(Array.from(map.values()))
      }

      request.onerror = () => resolve(getLs(LS_PENDING_KEY))
    })
  } catch {
    return getLs(LS_PENDING_KEY)
  }
}

export const deletePendingNote = async (tempId) => {
  // Always remove from localStorage
  const currentLs = getLs(LS_PENDING_KEY)
  setLs(LS_PENDING_KEY, currentLs.filter((n) => n.tempId !== tempId && n._id !== tempId))

  try {
    const db = await openDb()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PENDING, 'readwrite')
      const store = tx.objectStore(STORE_PENDING)
      store.delete(tempId)

      tx.oncomplete = () => resolve(true)
      tx.onerror = () => resolve(true)
    })
  } catch {
    return true
  }
}

export const clearPendingNotes = async () => {
  setLs(LS_PENDING_KEY, [])

  try {
    const db = await openDb()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PENDING, 'readwrite')
      const store = tx.objectStore(STORE_PENDING)
      store.clear()

      tx.oncomplete = () => resolve(true)
      tx.onerror = () => resolve(true)
    })
  } catch {
    return true
  }
}

// 2. Cached Notes Operations
export const cacheNotes = async (notes) => {
  if (!Array.isArray(notes)) return
  setLs(LS_CACHED_KEY, notes)

  try {
    const db = await openDb()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CACHED, 'readwrite')
      const store = tx.objectStore(STORE_CACHED)
      store.clear()

      for (const note of notes) {
        if (note && note._id) {
          store.put(note)
        }
      }

      tx.oncomplete = () => resolve(true)
      tx.onerror = () => resolve(true)
    })
  } catch {
    return true
  }
}

export const getCachedNotes = async () => {
  try {
    const db = await openDb()
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CACHED, 'readonly')
      const store = tx.objectStore(STORE_CACHED)
      const request = store.getAll()

      request.onsuccess = () => {
        const idbNotes = request.result || []
        if (idbNotes.length > 0) return resolve(idbNotes)
        resolve(getLs(LS_CACHED_KEY))
      }

      request.onerror = () => resolve(getLs(LS_CACHED_KEY))
    })
  } catch {
    return getLs(LS_CACHED_KEY)
  }
}

export default {
  savePendingNote,
  getPendingNotes,
  deletePendingNote,
  clearPendingNotes,
  cacheNotes,
  getCachedNotes,
}
