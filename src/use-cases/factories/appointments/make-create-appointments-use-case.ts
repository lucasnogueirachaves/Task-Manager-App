import { PrismaAppointmentRepository } from "@/repositories/prisma/appointments-prisma-repository.js";
import { CreateAppointmentUseCase } from "../../appointments/create.js";

export function makeCreateAppointmentUseCase() {
    const appointmentsRepository = new PrismaAppointmentRepository()
    const createAppointmentUseCase = new CreateAppointmentUseCase(appointmentsRepository)

    return createAppointmentUseCase
}