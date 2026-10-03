import express from 'express'
import noteController from '../controllers/note.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import {
  noteValidation,
  paramValidation,
} from '../middleware/validation.js'

const router = express.Router()

// All routes require JWT Bearer authentication
router.use(protect)

router.get('/', noteController.getAllNotes)
router.post('/', noteValidation, noteController.createNote)
router.delete('/:id', paramValidation, noteController.deleteNote)
router.put('/:id', paramValidation, noteValidation, noteController.updateNote)

export { router as noteRouter }
export default router
