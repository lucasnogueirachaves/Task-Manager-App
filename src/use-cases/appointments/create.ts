import type { AppointmentsRepository } from "@/repositories/appointments-repository.js"
import type { Appointment } from "@/generated/prisma/client.js"

interface CreateAppointmentUseCaseRequest {
    title: string,
    description: string,
    date: Date,
    local?: string
}

type CreateAppointmentUseCaseResponse = {
    appointment: Appointment
}

export class CreateAppointmentUseCase {
    constructor(
        private appointmentsRepository: AppointmentsRepository) {}

    async execute({
        title,
        description, 
        date,
        local
    }: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {

        const appointment = await this.appointmentsRepository.create({
            title,
            description,
            date,
            local: local ?? null,
        })

        return { appointment }
    }
}