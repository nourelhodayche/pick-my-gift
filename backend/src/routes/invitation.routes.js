const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Invitations route works' })
})

module.exports = router