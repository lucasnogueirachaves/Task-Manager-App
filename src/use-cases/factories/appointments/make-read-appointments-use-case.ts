import { PrismaAppointmentRepository } from "@/repositories/prisma/appointments-prisma-repository.js";
import { ReadAppointmentsUseCase } from "../../appointments/read.js";

export function makeReadAppointmentsUseCase() {
    const appointmentsRepository = new PrismaAppointmentRepository()
    const readAppointmentsUseCase = new ReadAppointmentsUseCase(appointmentsRepository)

    return readAppointmentsUseCase
}