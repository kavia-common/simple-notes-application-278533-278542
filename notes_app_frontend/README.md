# Simple Notes App (Frontend)

A lightweight React notes app where you can create, edit, and delete notes. Notes are stored locally in your browser (localStorage). No backend required.

## Features

- Sidebar with a list of notes (sorted by last updated)
- Editor panel to change title and content
- Create and delete notes
- Debounced autosave to localStorage
- Accessible components (ARIA roles, focus-visible styles, keyboard nav)
- Light and dark theme toggle
- Basic tests with React Testing Library

## Scripts

- `npm start` — start dev server at http://localhost:3000
- `npm test` — run tests
- `npm run build` — production build

## Notes on Data

- All notes are stored under the localStorage key `notes.v1`.
- Clearing browser storage will remove notes.

## Environment

This frontend does not depend on external APIs. Environment variables listed by the workspace (REACT_APP_*) are not used here.

