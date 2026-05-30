const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const eventRoutes = require('./routes/event.routes')
const giftRoutes = require('./routes/gift.routes')
const invitationRoutes = require('./routes/invitation.routes')
const reservationRoutes = require('./routes/reservation.routes')
const passport = require('./config/passport')

const app = express()

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/gifts', giftRoutes)
app.use('/api/invitations', invitationRoutes)
app.use('/api/reservations', reservationRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'GiftList API running' })
})

module.exports = app