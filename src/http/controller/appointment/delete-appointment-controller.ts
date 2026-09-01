import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeDeleteAppointmentUseCase } from "@/use-cases/factories/appointments/make-delete-appointments-use-case.js"

export async function deleteAppointment(request: FastifyRequest, reply: FastifyReply) {
    try {
        const updateParamsSchema = z.object({
            publicId: z.string().uuid()
        })
                
        const { publicId } = updateParamsSchema.parse(request.params)

        const deleteAppointmentUseCase = makeDeleteAppointmentUseCase()

        await deleteAppointmentUseCase.execute({publicId})

        return reply.status(200).send({"message": "Compromisso apagada com sucesso!"})

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}