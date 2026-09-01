import type { FastifyInstance } from "fastify"
import { createAppointment } from "./create-appointment-controller.js"
import { readAppointments } from "./read-appointments-controller.js"
import { readAppointmentId } from "./read-appointment-controller.js"
import { updateAppointment } from "./update-appointment-controller.js"
import { deleteAppointment } from "./delete-appointment-controller.js"

export async function appointmentsRoutes(app: FastifyInstance) {
    app.post('/', createAppointment)
    app.get('/', readAppointments)
    app.get('/:publicId', readAppointmentId)
    app.patch('/:publicId', updateAppointment)
    app.delete('/:publicId', deleteAppointment)
}