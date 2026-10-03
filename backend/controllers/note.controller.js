import noteService from '../services/note.service.js'

// Get all notes for user
export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getAllNotesForUser(req.user._id)

    res.json({
      success: true,
      data: { notes },
    })
  } catch (error) {
    next(error)
  }
}

// Create note
export const createNote = async (req, res, next) => {
  try {
    const { title, body } = req.body

    const note = await noteService.createNote(req.user._id, title, body)

    res.status(201).json({
      success: true,
      data: { note },
    })
  } catch (error) {
    next(error)
  }
}

// Delete note
export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params

    await noteService.deleteNote(id, req.user._id)

    res.json({
      success: true,
      message: 'Note deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

// Update note
export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, body } = req.body

    const note = await noteService.updateNote(id, req.user._id, title, body)

    res.json({
      success: true,
      data: { note },
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllNotes,
  createNote,
  deleteNote,
  updateNote,
}