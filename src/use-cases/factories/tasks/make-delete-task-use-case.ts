import { PrismaTaskRepository } from "@/repositories/prisma/tasks-prisma-repository.js";
import { DeleteTaskUseCase } from "@/use-cases/tasks/delete.js";

export function makeDeleteTaskUseCase() {
    const tasksRepository = new PrismaTaskRepository()
    const deleteTaskUseCase = new DeleteTaskUseCase(tasksRepository)

    return deleteTaskUseCase
}