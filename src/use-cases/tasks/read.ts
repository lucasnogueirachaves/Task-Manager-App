import type { TasksRepository } from "@/repositories/tasks-repository.js"
import type { Task } from "@/generated/prisma/client.js"

type ReadTasksUseCaseResponse = {
    tasks: Task[]
}

export class ReadTasksUseCase {
    constructor(
        private tasksRepository: TasksRepository) {}

    async execute(): Promise<ReadTasksUseCaseResponse> {

        const tasks = await this.tasksRepository.readMany()

        return {tasks}
    }
}