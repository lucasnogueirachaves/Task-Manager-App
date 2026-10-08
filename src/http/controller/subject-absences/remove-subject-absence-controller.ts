import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { NoAbsencesToRemoveError } from "@/use-cases/errors/no-absences-to-remove-error.js"
import { makeRemoveSubjectAbsenceUseCase } from "@/use-cases/factories/subjects/make-remove-subject-absence-use-case.js"

export async function removeSubjectAbsence(request: FastifyRequest, reply: FastifyReply) {
    try {
        const removeSubjectAbsenceParamsSchema = z.object({
            publicId: z.string().uuid()
        })
        
        const { publicId } = removeSubjectAbsenceParamsSchema.parse(request.params)

        const removeSubjectAbsenceUseCase = makeRemoveSubjectAbsenceUseCase()

        const { subject } = await removeSubjectAbsenceUseCase.execute({
            publicId
        })

        return reply.status(200).send(subject)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        if (error instanceof NoAbsencesToRemoveError) {
            return reply.status(409).send({
                message: error.message
            })
        }
        throw error
    }
}
