import { isBefore, subHours } from 'date-fns'
import Appointment from '../models/Appointment'
import User from '../models/User'
import File from '../models/File'

import CancellationMail from '../jobs/CancellationMail'
import Queue from '../../lib/Queue'

import CreateAppointmentService from '../services/CreateAppointmentService'


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
    const { provider_id, date } = req.body

    const appointment = await CreateAppointmentService({
      provider_id,
      user_id: req.userId,
      date
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