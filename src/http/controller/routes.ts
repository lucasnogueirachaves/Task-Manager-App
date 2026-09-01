import type { FastifyInstance } from "fastify";
import { tasksRoutes } from "./tasks/tasks.routes.js";
import { appointmentsRoutes } from "./appointment/appointments.routes.js";

export async function routes(app: FastifyInstance) {
    app.register(tasksRoutes, {prefix: '/tasks'})
    app.register(appointmentsRoutes, {prefix: '/appointments'})
}