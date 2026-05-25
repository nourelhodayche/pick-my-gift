const express = require('express')
const router = express.Router()
const { getInvitation, joinEvent } = require('../controllers/invitation.controller')
const { protect } = require('../middleware/auth.middleware')

router.get('/:token', getInvitation)
router.post('/:token/join', protect, joinEvent)

module.exports = router