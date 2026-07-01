const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Body is required"],
      minLength: [10, "Entry must be at least 10 characters"],
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
