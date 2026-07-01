const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");

// GET /api/notes - Get all notes
router.get("/", noteController.getAllNotes);

// POST /api/notes - Create a new note
router.post("/", noteController.createNote);

// DELETE /api/notes/:id - Delete a note
router.delete("/:id", noteController.deleteNote);

module.exports = router;
