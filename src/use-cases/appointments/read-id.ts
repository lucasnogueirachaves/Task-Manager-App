import type { AppointmentsRepository } from "@/repositories/appointments-repository.js"
import type { Appointment } from "@/generated/prisma/client.js"
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js"

type ReadAppointmentIdUseCaseRequest = {
    publicId: string
}

type ReadAppointmentsUseCaseResponse = {
    appointment: Appointment
}

export class ReadAppointmentIdUseCase {
    constructor(
        private appointmentsRepository: AppointmentsRepository) {}

    async execute({
        publicId
    }: ReadAppointmentIdUseCaseRequest): Promise<ReadAppointmentsUseCaseResponse> {

        const appointment = await this.appointmentsRepository.readId(publicId)

        if (!appointment) {
            throw new ResourceNotFoundError()
        }

        return {appointment}
    }
}