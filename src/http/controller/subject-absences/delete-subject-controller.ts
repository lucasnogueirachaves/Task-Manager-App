import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeDeleteSubjectUseCase } from "@/use-cases/factories/subjects/make-delete-subject-use-case.js"

export async function deleteSubject(request: FastifyRequest, reply: FastifyReply) {
    try {
        const deleteParamsSchema = z.object({
            publicId: z.string().uuid()
        })
                
        const { publicId } = deleteParamsSchema.parse(request.params)

        const deleteSubjectUseCase = makeDeleteSubjectUseCase()

        await deleteSubjectUseCase.execute({publicId})

        return reply.status(200).send({"message": "Matéria apagada com sucesso!"})

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}
