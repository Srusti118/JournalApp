const Note = require("../models/note.model");
const { AppError } = require("../middleware/errorHandler");

// Get all notes for user
exports.getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { notes },
    });
  } catch (error) {
    next(error);
  }
};

// Create note
exports.createNote = async (req, res, next) => {
  try {
    const { title, body } = req.body;

    const note = await Note.create({
      title,
      body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { note },
    });
  } catch (error) {
    next(error);
  }
};

// Delete note
exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, user: req.user._id });

    if (!note) {
      return next(new AppError("Note not found", 404, "NOTE_NOT_FOUND"));
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};