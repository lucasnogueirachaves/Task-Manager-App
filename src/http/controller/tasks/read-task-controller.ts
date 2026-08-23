import type { FastifyRequest, FastifyReply } from "fastify"
import { makeReadTaskIdUseCase } from "@/use-cases/factories/tasks/make-read-task-id-use-case.js"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import z from "zod"

export async function readTaskId(request: FastifyRequest, reply: FastifyReply) {
    try {
        const readTaskIdParamsSchema = z.object({
            publicId: z.string().uuid()
        })

        const { publicId } = readTaskIdParamsSchema.parse(request.params)

        const readTaskIdUseCase = makeReadTaskIdUseCase()

        const task  = await readTaskIdUseCase.execute({publicId})

        return reply.status(200).send(task)

    } catch (error) {
        if (error instanceof ResourceNotFoundError) {
            return reply.status(404).send({
                message: error.message
            })
        }
        throw error
    }
}
