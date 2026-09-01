import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeCreateAppointmentUseCase } from "@/use-cases/factories/appointments/make-create-appointments-use-case.js"

export async function createAppointment(request: FastifyRequest, reply: FastifyReply) {
    try {
        const createAppointmentBodySchema = z.object({ 
            title: z.string().trim().max(100).min(1),
            description: z.string().trim().max(1000).min(1),
            date: z.coerce.date(),
            local: z.string().optional()
        })

        const { title, description, date, local } = createAppointmentBodySchema.parse(request.body)

        const createAppointmentUseCase = makeCreateAppointmentUseCase()

        const { appointment } = await createAppointmentUseCase.execute({
            title,
            description,
            date,
            ...(local !== undefined ? { local } : {}),
        })

        return reply.status(201).send(appointment)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}
