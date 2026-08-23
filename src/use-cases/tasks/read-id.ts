import type { TasksRepository } from "@/repositories/tasks-repository.js"
import type { Task } from "@/generated/prisma/client.js"
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js"

type ReadTaskIdUseCaseRequest = {
    publicId: string
}

type ReadTasksUseCaseResponse = {
    task: Task
}

export class ReadTaskIdUseCase {
    constructor(
        private tasksRepository: TasksRepository) {}

    async execute({
        publicId
    }: ReadTaskIdUseCaseRequest): Promise<ReadTasksUseCaseResponse> {

        const task = await this.tasksRepository.readId(publicId)

        if (!task) {
            throw new ResourceNotFoundError()
        }

        return {task}
    }
}