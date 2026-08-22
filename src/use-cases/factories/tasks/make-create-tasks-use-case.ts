import { PrismaTaskRepository } from "@/repositories/prisma/tasks-prisma-repository.js";
import { CreateTaskUseCase } from "../../tasks/create.js";

export function makeCreateTaskUseCase() {
    const tasksRepository = new PrismaTaskRepository()
    const createTaskUseCase = new CreateTaskUseCase(tasksRepository)

    return createTaskUseCase
}