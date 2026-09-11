import { useState, useCallback } from "react";
import { useAuthFetch } from "./useAuthFetch";

export function useNotes() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authFetch = useAuthFetch();

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authFetch.get("/notes");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch notes");
      }
      const data = await res.json();
      const payload = data.data || data;
      setEntries(payload.notes || (Array.isArray(payload) ? payload : []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  // Create note
  const addNote = useCallback(
    async (newEntry) => {
      setError(null);

      try {
        const res = await authFetch.post("/notes", newEntry);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to create note");
        }
        const data = await res.json();
        const payload = data.data || data;
        const newDbNote = payload.note || payload;
        setEntries((prev) => [...prev, newDbNote]);
        return newDbNote;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [authFetch]
  );

  // Delete note
  const deleteNote = useCallback(
    async (id) => {
      setError(null);

      try {
        const res = await authFetch.delete(`/notes/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to delete note");
        }
        setEntries((prev) => prev.filter((entry) => entry._id !== id));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [authFetch]
  );

  return {
    entries,
    setEntries,
    loading,
    error,
    fetchNotes,
    addNote,
    deleteNote,
  };
}