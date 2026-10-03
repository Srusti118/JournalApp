import { Note } from '../models/note.model.js'
import { AppError } from '../middleware/errorHandler.js'

export const getAllNotesForUser = async (userId) => {
  const notes = await Note.find({ user: userId }).sort({ createdAt: -1 })
  return notes
}

export const createNote = async (userId, title, body) => {
  const note = await Note.create({
    title,
    body,
    user: userId,
  })
  return note
}

export const deleteNote = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, user: userId })

  if (!note) {
    throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND')
  }

  await note.deleteOne()
  return true
}

export const updateNote = async (noteId, userId, title, body) => {
  const note = await Note.findOne({ _id: noteId, user: userId })

  if (!note) {
    throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND')
  }

  note.title = title
  note.body = body
  await note.save()
  return note
}

export default {
  getAllNotesForUser,
  createNote,
  deleteNote,
  updateNote,
}
