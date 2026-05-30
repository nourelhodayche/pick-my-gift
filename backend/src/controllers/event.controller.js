const prisma = require('../lib/prisma')
const { v4: uuidv4 } = require('uuid')

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, eventType, guestCount, coverImage } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: date ? new Date(date) : null,
        location,
        eventType,
        guestCount: guestCount ? parseInt(guestCount) : null,
        coverImage,
        ownerId: req.user.id
      }
    })

     // Auto-generate invitation token
    const invitation = await prisma.invitation.create({
      data: {
        token: uuidv4(),
        eventId: event.id
      }
    })

    res.status(201).json({ ...event, inviteToken: invitation.token })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
 

const getMyEvents = async (req, res) => {
  try {
    const created = await prisma.event.findMany({
      where: { ownerId: req.user.id },
      include: {
        gifts: true,
        invitation: true,
        _count: { select: { attendees: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const attendingRaw = await prisma.eventAttendee.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          include: {
            gifts: true,
            invitation: true,
            owner: { select: { id: true, name: true, email: true } },
            _count: { select: { attendees: true } }
          }
        }
      }
    })

    const attending = attendingRaw.map(a => a.event)

    res.json({ created, attending })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        gifts: {
          include: {
            reservation: {
              include: { user: { select: { id: true, name: true } } }
            }
          }
        },
        invitation: true,
        _count: { select: { attendees: true } }
      }
    })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    if (event.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.event.delete({ where: { id: parseInt(req.params.id) } })

    res.json({ message: 'Event deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { createEvent, getMyEvents, getEventById, deleteEvent }