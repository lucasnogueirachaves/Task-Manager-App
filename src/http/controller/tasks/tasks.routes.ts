import type { FastifyInstance } from "fastify";
import { createTask } from "./create-task-controller.js";

export async function tasksRoutes(app: FastifyInstance) {
    app.post('/', createTask)
}