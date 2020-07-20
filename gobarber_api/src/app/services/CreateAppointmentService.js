import { startOfHour, parseISO, isBefore, format } from 'date-fns'
import pt from 'date-fns/locale/pt'


import User from '../models/User'
import Appointment from '../models/Appointment'
import Notifification from '../schemas/Notification'



class CreateAppointmentService {
    async run({ provider_id, user_id, date }) {
        const isProvider = await User.findOne({ where: { id: provider_id, provider: true } })

        if (!isProvider) {
            throw new Error('You can only create appoitments with providers')
        }

        const hourStart = startOfHour(parseISO(date))

        if (isBefore(hourStart, new Date())) {
            throw new Error('Past date are not permitted')
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
            throw new Error('Appointment date is not available')
        }

        const appoitment = await Appointment.create({
            user_id,
            provider_id,
            date: hourStart
        })

        const user = await User.findByPk(req.userId)
        const formattedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm'h' ", { locale: pt })

        await Notifification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate} `,
            user: provider_id
        })
        return appoitment
    }
}

export default new CreateAppointmentService()