import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import EmptyState from "./components/EmptyState";
import { useLocalStorageNotes } from "./hooks/useLocalStorageNotes";

// PUBLIC_INTERFACE
function App() {
  // Theme handling for accessibility and consistency with style guide
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  // Notes state using custom hook with persistence and debounced autosave
  const {
    notes,
    selectedId,
    setSelectedId,
    createNote,
    updateNote,
    deleteNote,
    getSelectedNote,
  } = useLocalStorageNotes();

  // Debounce edit updates inside App to lower frequency to state updates
  const debounceTimer = useRef(null);
  const debouncedUpdate = useCallback(
    (id, patch) => {
      if (!id) return;
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      debounceTimer.current = window.setTimeout(() => {
        updateNote(id, patch);
      }, 250);
    },
    [updateNote]
  );

  // Create first note helper
  const handleCreate = useCallback(() => {
    createNote();
  }, [createNote]);

  const selectedNote = getSelectedNote();

  const onEditorChange = useCallback(
    (patch) => {
      if (!selectedNote) return;
      debouncedUpdate(selectedNote.id, patch);
    },
    [selectedNote, debouncedUpdate]
  );

  const onDeleteSelected = useCallback(
    (id) => {
      if (!id) return;
      // basic confirm; avoid blocking flows
      // eslint-disable-next-line no-restricted-globals
      const ok = window.confirm("Delete this note? This action cannot be undone.");
      if (ok) {
        deleteNote(id);
      }
    },
    [deleteNote]
  );

  const mainPanel = useMemo(() => {
    if (notes.length === 0) {
      return <EmptyState onCreate={handleCreate} />;
    }
    return (
      <Editor
        note={selectedNote}
        onChange={onEditorChange}
        onDelete={onDeleteSelected}
      />
    );
  }, [notes.length, handleCreate, selectedNote, onEditorChange, onDeleteSelected]);

  return (
    <div className="app-root">
      <header className="topbar" role="banner">
        <div className="brand">Simple Notes</div>
        <div className="topbar-actions">
          <button
            className="btn btn-secondary"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <button className="btn btn-primary" onClick={handleCreate} aria-label="Create note">
            + New Note
          </button>
        </div>
      </header>
      <main className="layout" role="main">
        <Sidebar
          notes={notes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onCreate={handleCreate}
          onDelete={onDeleteSelected}
        />
        <section className="content-panel" aria-label="Editor panel">
          {mainPanel}
        </section>
      </main>
      <footer className="footer" role="contentinfo">
        <span>Local-only demo. Your notes persist in your browser.</span>
      </footer>
    </div>
  );
}

export default App;
