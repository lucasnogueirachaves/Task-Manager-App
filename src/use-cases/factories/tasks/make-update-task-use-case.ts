import { PrismaTaskRepository } from "@/repositories/prisma/tasks-prisma-repository.js";
import { UpdateTaskUseCase } from "@/use-cases/tasks/update.js";

export function makeUpdateTaskUseCase() {
    const tasksRepository = new PrismaTaskRepository()
    const updateTaskUseCase = new UpdateTaskUseCase(tasksRepository)

    return updateTaskUseCase
}