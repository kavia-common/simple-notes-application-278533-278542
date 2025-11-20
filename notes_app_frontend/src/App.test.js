import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";

// Utility to clear localStorage between tests
beforeEach(() => {
  window.localStorage.clear();
});

test("renders app chrome and empty state", () => {
  render(<App />);
  expect(screen.getByText(/Simple Notes/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /\+ New Note/i })).toBeInTheDocument();
  // Empty state shown initially
  expect(screen.getByText(/Create your first note/i)).toBeInTheDocument();
});

test("can create a note from topbar and it appears in sidebar and editor", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /\+ New Note/i }));
  // Newly created note should appear in the list
  const list = screen.getByRole("listbox", { name: /Notes/i });
  expect(within(list).getAllByRole("option").length).toBe(1);
  // Editor should show title input
  expect(screen.getByPlaceholderText(/Note title/i)).toBeInTheDocument();
});

test("typing in editor updates the note title and content", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /\+ New Note/i }));

  const title = screen.getByPlaceholderText(/Note title/i);
  const content = screen.getByPlaceholderText(/Write your note/i);

  fireEvent.change(title, { target: { value: "My Title" } });
  fireEvent.change(content, { target: { value: "My Content" } });

  // values reflect in inputs
  expect(title).toHaveValue("My Title");
  expect(content).toHaveValue("My Content");

  // List item title updates
  const list = screen.getByRole("listbox", { name: /Notes/i });
  expect(within(list).getByText("My Title")).toBeInTheDocument();
});

test("can delete a note", () => {
  // mock confirm to always accept
  const originalConfirm = window.confirm;
  window.confirm = () => true;

  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /\+ New Note/i }));
  // delete via editor
  fireEvent.click(screen.getByRole("button", { name: /Delete current note/i }));

  // after deletion, empty state shows or prompt in sidebar
  expect(screen.getByText(/Create your first note/i)).toBeInTheDocument();

  window.confirm = originalConfirm;
});
