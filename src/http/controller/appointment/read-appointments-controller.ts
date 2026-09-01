import type { FastifyRequest, FastifyReply } from "fastify"
import { makeReadAppointmentsUseCase } from "@/use-cases/factories/appointments/make-read-appointments-use-case.js"

export async function readAppointments(_request: FastifyRequest, reply: FastifyReply) {
    try {
        const readAppointmentsUseCase = makeReadAppointmentsUseCase()

        const appointments  = await readAppointmentsUseCase.execute()

        return reply.status(200).send(appointments)

    } catch (error) {
        throw error
    }
}
