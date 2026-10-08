import type { TasksRepository } from "@/repositories/tasks-repository.js";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";
import type { Priority, Status, Task } from "@/generated/prisma/client.js";

interface UpdateTaskUseCaseRequest {
    publicId: string
    title?: string,
    description?: string, 
    deadline?: Date, 
    priority?: Priority,
    status?: Status
}

type UpdateTaskUseCaseResponse = {
    task: Task
}

export class UpdateTaskUseCase {
    constructor(private tasksRepository: TasksRepository) {}

    async execute({ publicId, title, description, deadline, priority, status }: UpdateTaskUseCaseRequest): Promise<UpdateTaskUseCaseResponse> {
        const taskToUpdate = await this.tasksRepository.readId(publicId)

        if (!taskToUpdate) {
            throw new ResourceNotFoundError()
        }

        const updateData = {
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(deadline !== undefined ? { deadline } : {}),
            ...(priority !== undefined ? { priority } : {}),
            ...(status !== undefined ? { status } : {})
        }

        const task = await this.tasksRepository.update(taskToUpdate.publicId, updateData)

        if (!task) {
            throw new ResourceNotFoundError()
        }

        return { task }
    }
}