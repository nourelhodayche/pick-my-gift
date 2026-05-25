const prisma = require('../lib/prisma')

const getInvitation = async (req, res) => {
  try {
    const { token } = req.params

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        event: {
          include: {
            owner: { select: { id: true, name: true } },
            _count: { select: { gifts: true, attendees: true } }
          }
        }
      }
    })

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' })
    }

    res.json(invitation)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const joinEvent = async (req, res) => {
  try {
    const { token } = req.params

    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { event: true }
    })

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' })
    }

    // Owner ne peut pas rejoindre son propre event
    if (invitation.event.ownerId === req.user.id) {
      return res.status(400).json({ message: 'You are the owner of this event' })
    }

    // Vérifier si déjà attendee
    const existing = await prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: invitation.event.id
        }
      }
    })

    if (existing) {
      return res.status(400).json({ message: 'Already joined this event' })
    }

    await prisma.eventAttendee.create({
      data: {
        userId: req.user.id,
        eventId: invitation.event.id
      }
    })

    res.json({ message: 'Joined event successfully', eventId: invitation.event.id })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getInvitation, joinEvent }