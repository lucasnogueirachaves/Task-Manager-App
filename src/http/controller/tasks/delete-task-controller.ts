import type { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeDeleteTaskUseCase } from "@/use-cases/factories/tasks/make-delete-task-use-case.js"

export async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
    try {
        const updateParamsSchema = z.object({
            publicId: z.string().uuid()
        })
                
        const { publicId } = updateParamsSchema.parse(request.params)

        const deleteTaskUseCase = makeDeleteTaskUseCase()

        await deleteTaskUseCase.execute({publicId})

        return reply.status(200).send("Tarefa apagada com sucesso!")

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}