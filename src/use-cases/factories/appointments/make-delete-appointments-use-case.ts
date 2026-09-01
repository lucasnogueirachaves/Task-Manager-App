import { PrismaAppointmentRepository } from "@/repositories/prisma/appointments-prisma-repository.js";
import { DeleteAppointmentUseCase } from "../../appointments/delete.js";

export function makeDeleteAppointmentUseCase() {
    const appointmentsRepository = new PrismaAppointmentRepository()
    const deleteAppointmentUseCase = new DeleteAppointmentUseCase(appointmentsRepository)

    return deleteAppointmentUseCase
}