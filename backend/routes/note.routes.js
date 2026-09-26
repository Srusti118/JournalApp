const express = require('express')
const router = express.Router()
const noteController = require('../controllers/note.controller')
const { protect } = require('../middleware/auth.middleware')
const {
  noteValidation,
  paramValidation,
} = require('../middleware/validation')

// All routes require JWT Bearer authentication
router.use(protect)

router.get('/', noteController.getAllNotes)
router.post('/', noteValidation, noteController.createNote)
router.delete('/:id', paramValidation, noteController.deleteNote)

module.exports = router
