import type { FastifyInstance } from "fastify";
import { createTask } from "./create-task-controller.js";
import { readTasks } from "./read-tasks-controller.js";
import { readTaskId } from "./read-task-controller.js";
import { updateTask } from "./update-task-controller.js";
import { deleteTask } from "./delete-task-controller.js";

export async function tasksRoutes(app: FastifyInstance) {
    app.post('/', createTask)
    app.get('/', readTasks)
    app.get('/:publicId', readTaskId)
    app.patch('/:publicId', updateTask)
    app.delete('/:publicId', deleteTask)
}