const prisma = require('../lib/prisma')

const reserveGift = async (req, res) => {
  try {
    const giftId = parseInt(req.params.giftId)

    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
      include: { event: true }
    })

    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' })
    }

    // Vérifier que le gift est disponible
    if (gift.status !== 'available') {
      return res.status(400).json({ message: 'Gift already reserved' })
    }

    // Owner ne peut pas réserver ses propres cadeaux
    if (gift.event.ownerId === req.user.id) {
      return res.status(400).json({ message: 'You cannot reserve gifts from your own event' })
    }

    // Vérifier que le user est bien attendee de l'event
    const isAttendee = await prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: gift.eventId
        }
      }
    })

    if (!isAttendee) {
      return res.status(403).json({ message: 'You must join the event first' })
    }

    // Créer la réservation + mettre à jour le statut du gift
    const [reservation] = await prisma.$transaction([
      prisma.reservation.create({
        data: {
          userId: req.user.id,
          giftId,
          eventId: gift.eventId
        }
      }),
      prisma.gift.update({
        where: { id: giftId },
        data: { status: 'reserved' }
      })
    ])

    res.status(201).json(reservation)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const cancelReservation = async (req, res) => {
  try {
    const giftId = parseInt(req.params.giftId)

    const reservation = await prisma.reservation.findFirst({
      where: {
        giftId,
        userId: req.user.id
      }
    })

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' })
    }

    await prisma.$transaction([
      prisma.reservation.delete({ where: { id: reservation.id } }),
      prisma.gift.update({
        where: { id: giftId },
        data: { status: 'available' }
      })
    ])

    res.json({ message: 'Reservation cancelled' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getMyReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.user.id },
      include: {
        gift: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                date: true,
                location: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(reservations)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { reserveGift, cancelReservation, getMyReservations }