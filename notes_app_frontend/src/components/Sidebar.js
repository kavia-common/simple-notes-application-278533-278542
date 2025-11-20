import React, { useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Renders the list of notes with create button and handles selection.
 */
export default function Sidebar({
  notes,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
}) {
  const listRef = useRef(null);

  // Keyboard navigation for the list
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    function handleKeyDown(e) {
      if (!["ArrowUp", "ArrowDown", "Home", "End", "Delete"].includes(e.key)) {
        return;
      }
      const items = Array.from(list.querySelectorAll('[role="option"]'));
      const currentIdx = items.findIndex((el) =>
        el.getAttribute("data-id") === String(selectedId)
      );

      if (e.key === "Delete" && selectedId) {
        e.preventDefault();
        onDelete(selectedId);
        return;
      }

      let nextIdx = currentIdx;
      if (e.key === "ArrowUp") nextIdx = Math.max(0, currentIdx - 1);
      if (e.key === "ArrowDown") nextIdx = Math.min(items.length - 1, currentIdx + 1);
      if (e.key === "Home") nextIdx = 0;
      if (e.key === "End") nextIdx = items.length - 1;

      if (nextIdx !== currentIdx && items[nextIdx]) {
        e.preventDefault();
        const id = items[nextIdx].getAttribute("data-id");
        onSelect(id);
        items[nextIdx].focus();
      }
    }

    list.addEventListener("keydown", handleKeyDown);
    return () => list.removeEventListener("keydown", handleKeyDown);
  }, [onSelect, onDelete, selectedId]);

  return (
    <aside className="sidebar" aria-label="Notes list">
      <div className="sidebar-header">
        <h1 className="app-title">Notes</h1>
        <button
          className="btn btn-primary"
          onClick={onCreate}
          aria-label="Create note"
        >
          + New
        </button>
      </div>

      <div
        className="note-list"
        role="listbox"
        aria-label="Notes"
        aria-activedescendant={selectedId ? `note-${selectedId}` : undefined}
        tabIndex={0}
        ref={listRef}
      >
        {notes.length === 0 ? (
          <div className="empty-list" role="note" aria-live="polite">
            No notes yet. Create your first note.
          </div>
        ) : (
          notes.map((n) => (
            <button
              key={n.id}
              id={`note-${n.id}`}
              data-id={n.id}
              role="option"
              aria-selected={selectedId === n.id}
              className={`note-list-item ${selectedId === n.id ? "active" : ""}`}
              onClick={() => onSelect(n.id)}
              title={n.title || "Untitled"}
            >
              <div className="note-title">{n.title || "Untitled"}</div>
              <div className="note-meta">
                {new Date(n.updatedAt).toLocaleString()}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
