const express = require('express')
const router = express.Router()
const { createEvent, getMyEvents, getEventById, deleteEvent } = require('../controllers/event.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/', protect, createEvent)
router.get('/mine', protect, getMyEvents)
router.get('/:id', protect, getEventById)
router.delete('/:id', protect, deleteEvent)

module.exports = router