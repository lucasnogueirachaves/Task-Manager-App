import fastify from "fastify"
import { ZodError } from "zod"

export const app = fastify()

app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Dados inválidos',
            issues: error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
        })
    }

    // Erros do Prisma: título/matéria duplicado e registro inexistente
    if (error.code === 'P2002') {
        return reply.status(409).send({ message: 'Já existe um registro com esse valor' })
    }

    if (error.code === 'P2025') {
        return reply.status(404).send({ message: 'Recurso não encontrado' })
    }

    // Erros de requisição do próprio Fastify (JSON malformado, corpo vazio...)
    if (error.statusCode !== undefined && error.statusCode >= 400 && error.statusCode < 500) {
        return reply.status(error.statusCode).send({ message: error.message })
    }

    console.error(error)

    return reply.status(500).send({ message: 'Erro interno do servidor' })
})
