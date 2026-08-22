import type { Prisma, Task } from "@/generated/prisma/client.js"

export interface TasksRepository {
    create(data: Prisma.TaskCreateInput): Promise<Task>
    readMany(): Promise<Task[]>
    readId(publicId: string): Promise<Task | null>
    update(publicId: string, data: Prisma.TaskUpdateInput): Promise<Task | null>
    delete(publicId: string): Promise<void>
}