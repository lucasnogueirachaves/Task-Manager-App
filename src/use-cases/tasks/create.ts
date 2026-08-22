import type { TasksRepository } from "@/repositories/tasks-repository.js"
import type { Priority, Task } from "@/generated/prisma/client.js"

interface CreateTaskUseCaseRequest {
    title: string,
    description: string, 
    deadline: Date, 
    priority: Priority
}

type CreateTaskUseCaseResponse = {
    task: Task
}

export class CreateTaskUseCase {
    constructor(
        private tasksRepository: TasksRepository) {}

    async execute({
        title,
        description, 
        deadline, 
        priority
    }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {

        const task = await this.tasksRepository.create({
            title,
            description, 
            deadline, 
            priority
        })

        return { task }
    }
}