import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import pt from 'date-fns/locale/pt'


import Appointment from '../models/Appointment'
import User from '../models/User'
import File from '../models/File'
import Notifification from '../schemas/Notification'

import CancellationMail from '../jobs/CancellationMail'

import Queue from '../../lib/Queue'

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query

    const appoitments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url']
            }
          ]
        }
      ]
    })
    return res.json(appoitments)
  }

  async store(req, res) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }

    const { provider_id, date } = req.body
    const isProvider = await User.findOne({ where: { id: provider_id, provider: true } })

    if (!isProvider) {
      return res.status(401).json({ error: 'You can only create appoitments with providers' })
    }

    const hourStart = startOfHour(parseISO(date))

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permitted' })
    }

    const checkAvailability = await Appointment.findOne({
      where:
      {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    })

    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment date is not available' })
    }

    const appoitment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    })

    const user = await User.findByPk(req.userId)
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm'h' ", { locale: pt })

    await Notifification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate} `,
      user: provider_id
    })

    return res.json(appoitment)
  }

  async delete(req, res) {
    const appoitment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ]
    })

    if (appoitment.user_id !== req.userId) {
      return res.status(401).json({ error: "You don't have permission to cancel this appointment." })
    }

    const dateWithSub = subHours(appoitment.date, 2)

    if (isBefore(dateWithSub, new Date())) {
      res.status(401).json({ error: "You can only cancel appointments 2 hours in advance" })
    }

    appoitment.canceled_at = new Date()
    await appoitment.save()
    Queue.add(CancellationMail.key, { appoitment })
    return res.json(appoitment)

  }
}

export default new AppointmentController()