import type { FastifyRequest, FastifyReply } from "fastify"
import { makeReadAppointmentIdUseCase } from "@/use-cases/factories/appointments/make-read-appointment-id-use-case.js"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import z from "zod"

export async function readAppointmentId(request: FastifyRequest, reply: FastifyReply) {
    try {
        const readAppointmentIdParamsSchema = z.object({
            publicId: z.string().uuid()
        })

        const { publicId } = readAppointmentIdParamsSchema.parse(request.params)

        const readAppointmentIdUseCase = makeReadAppointmentIdUseCase()

        const appointment  = await readAppointmentIdUseCase.execute({publicId})

        return reply.status(200).send(appointment)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}
