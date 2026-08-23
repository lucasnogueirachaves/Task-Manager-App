import { PrismaTaskRepository } from "@/repositories/prisma/tasks-prisma-repository.js";
import { ReadTaskIdUseCase } from "@/use-cases/tasks/read-id.js";

export function makeReadTaskIdUseCase() {
    const tasksRepository = new PrismaTaskRepository()
    const readTaskIdUseCase = new ReadTaskIdUseCase(tasksRepository)

    return readTaskIdUseCase
}