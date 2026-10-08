import z from "zod"
import type { FastifyReply, FastifyRequest } from "fastify"
import { makeUpdateTaskUseCase } from "@/use-cases/factories/tasks/make-update-task-use-case.js"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"

export async function updateTask(request: FastifyRequest, reply: FastifyReply) {
    try {
        const updateParamsSchema = z.object({
            publicId: z.string().uuid()
        })
        
        const { publicId } = updateParamsSchema.parse(request.params)

        const updateTaskBodySchema = z.object({
            title: z.string().trim().min(1).optional(),
            description: z.string().trim().min(1).max(500).optional(),
            deadline: z.coerce.date().optional(),
            priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
            status: z.enum(['COMPLETED', 'NEXT']).optional()
        })

        const { title, description, deadline, priority, status } = updateTaskBodySchema.parse(request.body)

        const updateTaskUseCase = makeUpdateTaskUseCase()

        const { task } = await updateTaskUseCase.execute({
            publicId,
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(deadline !== undefined && { deadline }),
            ...(priority !== undefined && { priority }),
            ...(status !== undefined && { status }),
        })

        return reply.status(200).send(task)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
                return reply.status(404).send({message: error.message})
        }
        throw error
    }
}