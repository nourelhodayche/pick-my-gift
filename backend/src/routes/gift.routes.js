const express = require('express')
const router = express.Router()
const { scrapeProduct, addGift, getEventGifts, deleteGift } = require('../controllers/gift.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/scrape', protect, scrapeProduct)
router.post('/event/:eventId', protect, addGift)
router.get('/event/:eventId', protect, getEventGifts)
router.delete('/:giftId', protect, deleteGift)

module.exports = router