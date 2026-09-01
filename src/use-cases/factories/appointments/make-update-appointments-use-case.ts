import { PrismaAppointmentRepository } from "@/repositories/prisma/appointments-prisma-repository.js";
import { UpdateAppointmentUseCase } from "../../appointments/update.js";

export function makeUpdateAppointmentUseCase() {
    const appointmentsRepository = new PrismaAppointmentRepository()
    const updateAppointmentUseCase = new UpdateAppointmentUseCase(appointmentsRepository)

    return updateAppointmentUseCase
}