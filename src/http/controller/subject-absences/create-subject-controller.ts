import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeCreateSubjectUseCase } from "@/use-cases/factories/subjects/make-create-subject-use-case.js"

export async function createSubject(request: FastifyRequest, reply: FastifyReply) {
    try {
        const createSubjectBodySchema = z.object({ 
            subjectName: z.string().trim().max(50).min(1)
        })

        const { subjectName } = createSubjectBodySchema.parse(request.body)

        const createSubjectUseCase = makeCreateSubjectUseCase()

        const { subject } = await createSubjectUseCase.execute({
            subjectName
        })

        return reply.status(201).send(subject)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}
