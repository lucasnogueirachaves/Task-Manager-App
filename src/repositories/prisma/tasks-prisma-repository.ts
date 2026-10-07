import type { TasksRepository } from "../tasks-repository.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaTaskRepository implements TasksRepository {
    async create(data: Prisma.TaskCreateInput) {
        return await prisma.task.create({data})
    }
    async readMany() {
        return await prisma.task.findMany({})
    }
    async readId(publicId: string) {
        return await prisma.task.findUnique({
            where: {
                publicId
            }
        })
    }
    async update(publicId: string, data: Prisma.TaskUpdateInput) {
        return await prisma.task.update({
            where: {
                publicId
            }, data
        })
    }
    async delete(publicId: string) {
        await prisma.task.delete({
            where: {
                publicId
            }
        })
    }
}