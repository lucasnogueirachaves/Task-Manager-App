import type { TasksRepository } from "@/repositories/tasks-repository.js"
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js"

interface DeleteTaskIdUseCaseRequest {
    publicId: string
}

export class DeleteTaskUseCase {
    constructor(private tasksRepository: TasksRepository) {}
    async execute({publicId}: DeleteTaskIdUseCaseRequest): Promise<void> {
        const task = await this.tasksRepository.readId(publicId)

        if(!task) {
            throw new ResourceNotFoundError()
        }

        await this.tasksRepository.delete(task.publicId)
    }
}