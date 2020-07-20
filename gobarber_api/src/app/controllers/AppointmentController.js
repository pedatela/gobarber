import { isBefore, subHours } from 'date-fns'
import Appointment from '../models/Appointment'
import User from '../models/User'
import File from '../models/File'

import CreateAppointmentService from '../services/CreateAppointmentService'
import CancelAppointmentService from '../services/CancelAppointmentService'


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
    const appointment = await CancelAppointmentService.run({
      provider_id: req.params.id,
      user_id: req.userId
    })
    return res.json(appoitment)
  }
}

export default new AppointmentController()