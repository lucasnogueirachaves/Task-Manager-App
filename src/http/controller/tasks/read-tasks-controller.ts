import type { FastifyRequest, FastifyReply } from "fastify"
import { makeReadTasksUseCase } from "@/use-cases/factories/tasks/make-read-tasks-use-case.js"

export async function readTasks(_request: FastifyRequest, reply: FastifyReply) {
    try {
        const readTasksUseCase = makeReadTasksUseCase()

        const tasks  = await readTasksUseCase.execute()

        return reply.status(200).send(tasks)

    } catch (error) {
        throw error
    }
}
