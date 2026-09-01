import type { AppointmentsRepository } from "@/repositories/appointments-repository.js"
import type { Appointment } from "@/generated/prisma/client.js"

type ReadAppointmentsUseCaseResponse = {
    appointments: Appointment[]
}

export class ReadAppointmentsUseCase {
    constructor(
        private appointmentsRepository: AppointmentsRepository) {}

    async execute(): Promise<ReadAppointmentsUseCaseResponse> {

        const appointments = await this.appointmentsRepository.readMany()

        return {appointments}
    }
}