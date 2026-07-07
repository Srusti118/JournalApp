const Note = require("../models/note.model");

// Get all notes for logged-in user
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, body } = req.body;
    const note = await Note.create({ title, body, user: req.user._id });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a note (only if owned by user)
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
