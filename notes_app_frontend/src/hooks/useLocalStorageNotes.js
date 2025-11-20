import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useLocalStorageNotes
 * A custom hook that manages a list of notes persisted to localStorage with debounced autosave.
 * - Each note: { id: string, title: string, content: string, updatedAt: number }
 * - Provides CRUD operations and a selected note id.
 * - Debounces writes to localStorage to avoid excessive operations.
 */
export function useLocalStorageNotes(storageKey = "notes.v1", debounceMs = 400) {
  /** Notes state and selected note id */
  const [notes, setNotes] = useState(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [selectedId, setSelectedId] = useState(null);

  // Debounce write to localStorage
  const writeTimer = useRef(null);
  const persist = useCallback(
    (data) => {
      if (writeTimer.current) window.clearTimeout(writeTimer.current);
      writeTimer.current = window.setTimeout(() => {
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(data));
        } catch {
          // Swallow storage errors silently to avoid breaking UX
        }
      }, debounceMs);
    },
    [storageKey, debounceMs]
  );

  useEffect(() => {
    persist(notes);
    // cleanup timer on unmount
    return () => {
      if (writeTimer.current) window.clearTimeout(writeTimer.current);
    };
  }, [notes, persist]);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  const createNote = useCallback(() => {
    const now = Date.now();
    const id = `${now}-${Math.random().toString(36).slice(2, 8)}`;
    const newNote = {
      id,
      title: "Untitled",
      content: "",
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(id);
    return id;
  }, []);

  const updateNote = useCallback((id, patch) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...patch, updatedAt: Date.now() }
          : n
      )
    );
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId((curr) => (curr === id ? null : curr));
  }, []);

  const getSelectedNote = useCallback(() => {
    return notes.find((n) => n.id === selectedId) || null;
  }, [notes, selectedId]);

  return {
    notes: sortedNotes,
    selectedId,
    setSelectedId,
    createNote,
    updateNote,
    deleteNote,
    getSelectedNote,
  };
}
