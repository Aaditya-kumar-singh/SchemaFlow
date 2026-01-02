# Canvas Interaction Guide

Welcome to the **SchemaFlow** editor! This guide outlines how to interact with the diagram canvas to design your database schemas effectively.

## 🧭 Navigation

*   **Pan**: Click and drag on an empty area of the canvas to move around.
*   **Zoom**: Use your mouse wheel to zoom in and out. Alternatively, use the `+` and `-` buttons in the bottom-left control bar.
*   **Fit View**: Click the `[ ]` (Fit View) button in the bottom-left to instantly fit all your tables within the screen.
*   **Minimap**: Use the minimap in the bottom-right to quickly jump to different sections of large diagrams.

## 📦 Managing Tables & Collections

*   **Add Node**: Click the **"Add Table"** (or Collection) button in the top toolbar to create a new empty node.
*   **Select**: Click on a header to select a node. The **Properties Panel** will open on the left.
*   **Move**: Drag a node by its header to reposition it.
*   **Delete**: Select a node and press `Backspace` or `Delete`, or click the Trash icon in the Properties Panel.

## ✏️ Editing Properties

When a node is selected, the **Properties Panel** on the left allows you to:

1.  **Rename**: Edit the Table/Collection name at the top.
2.  **Add Fields**: Click the **"+ Add"** button to create new columns/fields.
3.  **Edit Fields**:
    *   Change field name.
    *   Select data type (e.g., `VARCHAR`, `INT`, `ObjectId`).
    *   Toggle flags: **PK** (Primary Key), **FK** (Foreign Key), **?** (Nullable/Optional).
4.  **Reorder**: (Coming soon)
5.  **Remove Field**: Click the Trash icon next to a field to delete it.

## 🔗 Creating Relationships

*   **Connect**: Hover over a field to reveal the **handle** (dot). Click and drag a line from one field's handle to another field's handle.
*   **Mapping**: Connections are field-specific. Connecting `user_id` in `posts` to `id` in `users` creates a precise foreign key relationship.
*   **Edit Relationship**:
    *   **Drag Label**: You can drag the relationship label (e.g., "1:N") to position it for better visibility.
    *   **Properties**: (Phase 2 feature) Double-click an edge or click the "Edit" icon on the label to open the Relationship Modal (configure One-to-One, One-to-Many, constraints like `ON DELETE CASCADE`).
*   **Delete Connection**:
    *   Hover over the relationship label to see the **"X"** button. Click it to delete.
    *   Select the relationship line and press `Backspace` / `Delete`.

## 🛠️ Toolbar Tools

*   **Search**: Use the search bar to filter and find specific nodes or fields in large diagrams.
*   **Code Preview**: Toggle the **`</>`** button to see real-time SQL DDL or Mongoose Schema code generated from your diagram.
*   **Import**: Open the **Schema Inbox** to paste SQL or JSON and generate diagrams automatically.
*   **Theme**: Toggle between Light, Dark, Ocean, and Sunset themes to suit your preference.
*   **Export**: Download your diagram as an SQL script or JSON file.

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
| :--- | :--- |
| **Delete Node/Edge** | `Backspace` or `Delete` |
| **Undo** | `Ctrl + Z` (Mac: `Cmd + Z`) |
| **Redo** | `Ctrl + Y` (Mac: `Cmd + Shift + Z`) |
| **Save** | Auto-save is always on! |
| **Select All** | `Ctrl + A` (Mac: `Cmd + A`) |
