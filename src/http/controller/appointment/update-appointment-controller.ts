import z from "zod"
import type { FastifyReply, FastifyRequest } from "fastify"
import { makeUpdateAppointmentUseCase } from "@/use-cases/factories/appointments/make-update-appointments-use-case.js"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"

export async function updateAppointment(request: FastifyRequest, reply: FastifyReply) {
    try {
        const updateParamsSchema = z.object({
            publicId: z.string().uuid()
        })
        
        const { publicId } = updateParamsSchema.parse(request.params)

        const updateAppointmentBodySchema = z.object({
            title: z.string().trim().max(100).min(1).optional(),
            description: z.string().trim().max(1000).min(1).optional(),
            date: z.coerce.date().optional(),
            local: z.string().optional(),
            status: z.enum(['COMPLETED', 'NEXT']).optional()
        })

        const {title, description, date, local, status} = updateAppointmentBodySchema.parse(request.body)

        const updateAppointmentUseCase = makeUpdateAppointmentUseCase()

        const updateAppointmentData = {
            publicId,
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(date !== undefined && { date }),
            ...(local !== undefined && { local }),
            ...(status !== undefined && { status })
        }

        const { appointment } = await updateAppointmentUseCase.execute(updateAppointmentData)

        return reply.status(200).send(appointment)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
                return reply.status(404).send({message: error.message})
        }
        throw error
    }
}