const Note = require('../models/note.model')
const { AppError } = require('../middleware/errorHandler')

const getAllNotesForUser = async (userId) => {
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 })
    return notes
}

const createNote = async (userId, title, body) => {
    const note = await Note.create({
        title,
        body,
        user: userId,
    })
    return note
}

const deleteNote = async (noteId, userId) => {
    const note = await Note.findOne({ _id: noteId, user: userId })

    if (!note) {
        throw new AppError('Note not found', 404, 'NOTE_NOT_FOUND')
    }

    await note.deleteOne()
    return true
}

module.exports = {
    getAllNotesForUser,
    createNote,
    deleteNote,
}
