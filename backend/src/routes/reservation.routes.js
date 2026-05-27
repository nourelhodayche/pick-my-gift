const express = require('express')
const router = express.Router()
const { reserveGift, cancelReservation, getMyReservations } = require('../controllers/reservation.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/gifts/:giftId', protect, reserveGift)
router.delete('/gifts/:giftId', protect, cancelReservation)
router.get('/mine', protect, getMyReservations)

module.exports = router