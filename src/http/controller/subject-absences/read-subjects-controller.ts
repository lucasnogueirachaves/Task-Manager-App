import type { FastifyRequest, FastifyReply } from "fastify"
import { makeReadSubjectsUseCase } from "@/use-cases/factories/subjects/make-read-subjects-use-case.js"

export async function readSubjects(_request: FastifyRequest, reply: FastifyReply) {
    try {
        const readSubjectsUseCase = makeReadSubjectsUseCase()

        const subjects = await readSubjectsUseCase.execute()

        return reply.status(200).send(subjects)

    } catch (error) {
        throw error
    }
}
