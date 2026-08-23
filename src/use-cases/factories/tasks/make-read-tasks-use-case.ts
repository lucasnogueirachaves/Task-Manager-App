import { PrismaTaskRepository } from "@/repositories/prisma/tasks-prisma-repository.js";
import { ReadTasksUseCase } from "@/use-cases/tasks/read.js";

export function makeReadTasksUseCase() {
    const tasksRepository = new PrismaTaskRepository()
    const readTasksUseCase = new ReadTasksUseCase(tasksRepository)

    return readTasksUseCase
}