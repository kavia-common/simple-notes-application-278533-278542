import React, { useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * Editor
 * Renders editor for the selected note (title + content) with delete and autosave feedback.
 */
export default function Editor({ note, onChange, onDelete }) {
  const titleRef = useRef(null);

  // Focus title field when a note is selected
  useEffect(() => {
    if (note && titleRef.current) {
      titleRef.current.focus();
      titleRef.current.select();
    }
  }, [note?.id]);

  if (!note) {
    return (
      <div className="editor-container">
        <div className="empty-state" role="status" aria-live="polite">
          Select a note or create a new one to start editing.
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container" aria-label="Note editor">
      <div className="editor-toolbar">
        <div className="editor-toolbar-left">
          <span className="badge">Last saved: {new Date(note.updatedAt).toLocaleTimeString()}</span>
        </div>
        <div className="editor-toolbar-right">
          <button
            className="btn btn-secondary"
            onClick={() => onDelete(note.id)}
            aria-label="Delete current note"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="editor-form">
        <label htmlFor="note-title" className="sr-only">
          Title
        </label>
        <input
          ref={titleRef}
          id="note-title"
          className="title-input"
          type="text"
          placeholder="Note title"
          value={note.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <label htmlFor="note-content" className="sr-only">
          Content
        </label>
        <textarea
          id="note-content"
          className="content-input"
          placeholder="Write your note..."
          value={note.content}
          onChange={(e) => onChange({ content: e.target.value })}
          rows={16}
        />
      </div>
    </div>
  );
}
