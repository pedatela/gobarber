import { isBefore, subHours } from 'date-fns'
import pt from 'date-fns/locale/pt'


import User from '../models/User'
import Appointment from '../models/Appointment'

import CancellationMail from '../jobs/CancellationMail'
import Queue from '../../lib/Queue'


class CancelAppointmentService {
    async run({ provider_id, user_id, date }) {
        const appoitment = await Appointment.findByPk(provider_id, {
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

        if (appoitment.user_id !== user_id) {
            throw new Error("You don't have permission to cancel this appointment.")
        }

        const dateWithSub = subHours(appoitment.date, 2)

        if (isBefore(dateWithSub, new Date())) {
            throw new Error('You can only cancel appointments 2 hours in advance')
        }

        appoitment.canceled_at = new Date()
        await appoitment.save()
        Queue.add(CancellationMail.key, { appoitment })
        return appoitment
    }
}

export default new CancelAppointmentService()