import React from "react";

/**
 * PUBLIC_INTERFACE
 * EmptyState
 * Shown in main panel when there are no notes yet.
 */
export default function EmptyState({ onCreate }) {
  return (
    <div className="empty-wrapper" role="status" aria-live="polite">
      <h2>Welcome to Notes</h2>
      <p>Create your first note to get started.</p>
      <button className="btn btn-primary" onClick={onCreate} aria-label="Create first note">
        + Create Note
      </button>
    </div>
  );
}
