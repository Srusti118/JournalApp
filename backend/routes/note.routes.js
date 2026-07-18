const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note.controller");
const { protectWithCsrf } = require("../middleware/auth.middleware");

// All routes require auth + CSRF protection
router.use(protectWithCsrf);

// GET /api/notes - Get all notes
router.get("/", noteController.getAllNotes);

// POST /api/notes - Create a new note
router.post("/", noteController.createNote);

// DELETE /api/notes/:id - Delete a note
router.delete("/:id", noteController.deleteNote);

module.exports = router;
