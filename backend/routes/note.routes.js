const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");
const { protectWithCsrf } = require("../middleware/auth.middleware");
const {
  noteValidation,
  paramValidation,
} = require("../middleware/validation");

// All routes require auth + CSRF protection
router.use(protectWithCsrf);

// GET /api/notes - Get all notes
router.get("/", noteController.getAllNotes);

// POST /api/notes - Create a new note
router.post("/", noteValidation, noteController.createNote);

// DELETE /api/notes/:id - Delete a note
router.delete("/:id", paramValidation, noteController.deleteNote);

module.exports = router;
