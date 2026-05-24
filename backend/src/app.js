const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const eventRoutes = require('./routes/event.routes')
const giftRoutes = require('./routes/gift.routes')
const invitationRoutes = require('./routes/invitation.routes')
const reservationRoutes = require('./routes/reservation.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/gifts', giftRoutes)
app.use('/api/invitations', invitationRoutes)
app.use('/api/reservations', reservationRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'GiftList API running' })
})

module.exports = app