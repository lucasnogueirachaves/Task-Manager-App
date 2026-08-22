import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError.js"
import { makeCreateTaskUseCase } from "@/use-cases/factories/tasks/make-create-tasks-use-case.js"

export async function createTask(request: FastifyRequest, reply: FastifyReply) {
    try {
        const createTaskBodySchema = z.object({
            title: z.string().trim().min(1),
            description: z.string().trim().min(1).max(500),
            deadline: z.date(),
            priority: z.enum(['HIGH', 'MEDIUM', 'LOW'])
        })

        const { title, description, deadline, priority } = createTaskBodySchema.parse(request.body)

        const createTaskUseCase = makeCreateTaskUseCase()

        const { task } = await createTaskUseCase.execute({
            title,
            description, 
            deadline, 
            priority
        })

        return reply.status(201).send(task)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}
