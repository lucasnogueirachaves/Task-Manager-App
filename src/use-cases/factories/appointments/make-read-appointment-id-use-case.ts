import { PrismaAppointmentRepository } from "@/repositories/prisma/appointments-prisma-repository.js";
import { ReadAppointmentIdUseCase } from "../../appointments/read-id.js";

export function makeReadAppointmentIdUseCase() {
    const appointmentsRepository = new PrismaAppointmentRepository()
    const readAppointmentIdUseCase = new ReadAppointmentIdUseCase(appointmentsRepository)

    return readAppointmentIdUseCase
}