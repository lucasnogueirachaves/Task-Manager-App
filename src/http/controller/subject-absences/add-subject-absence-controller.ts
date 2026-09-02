import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeaddSubjectUseCase } from "@/use-cases/factories/Subjects/make-add-Subjects-use-case.js"

export async function addSubjectAbsence(request: FastifyRequest, reply: FastifyReply) {
    try {
        const addSubjectAbsenceParamsSchema = z.object({
            publicId: z.string().uuid()
        })
        
        const { publicId } = addSubjectAbsenceParamsSchema.parse(request.params)

        const addSubjectUseCase = makeAddSubjectUseCase()

        const { subject } = await addSubjectUseCase.execute({
            publicId
        })

        return reply.status(200).send(subject)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}
