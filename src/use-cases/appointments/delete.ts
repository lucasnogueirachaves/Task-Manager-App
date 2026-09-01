import type { AppointmentsRepository } from "@/repositories/appointments-repository.js"
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js"

interface DeleteAppointmentIdUseCaseRequest {
    publicId: string
}

export class DeleteAppointmentUseCase {
    constructor(private appointmentsRepository: AppointmentsRepository) {}
    async execute({publicId}: DeleteAppointmentIdUseCaseRequest): Promise<void> {
        const appointment = await this.appointmentsRepository.readId(publicId)

        if(!appointment) {
            throw new ResourceNotFoundError()
        }

        await this.appointmentsRepository.delete(appointment.publicId)
    }
}