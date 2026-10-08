import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeAddSubjectAbsenceUseCase } from "@/use-cases/factories/subjects/make-add-subject-absence-use-case.js"

export async function addSubjectAbsence(request: FastifyRequest, reply: FastifyReply) {
    try {
        const addSubjectAbsenceParamsSchema = z.object({
            publicId: z.string().uuid()
        })
        
        const { publicId } = addSubjectAbsenceParamsSchema.parse(request.params)

        const addSubjectAbsenceUseCase = makeAddSubjectAbsenceUseCase()

        const { subject } = await addSubjectAbsenceUseCase.execute({
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
