import type { AppointmentsRepository } from "@/repositories/appointments-repository.js"
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";
import type { Appointment } from "@/generated/prisma/client.js";

interface UpdateAppointmentUseCaseRequest {
    publicId: string
    title?: string,
    description?: string, 
    date?: Date, 
    local?: string
}

type UpdateAppointmentUseCaseResponse = {
    appointment: Appointment
}

export class UpdateAppointmentUseCase {
    constructor(private appointmentsRepository: AppointmentsRepository) {}

    async execute({ publicId, title, description, date, local }: UpdateAppointmentUseCaseRequest): Promise<UpdateAppointmentUseCaseResponse> {
        const appointmentToUpdate = await this.appointmentsRepository.readId(publicId)

        if (!appointmentToUpdate) {
            throw new ResourceNotFoundError()
        }

        const updateData = {
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(date !== undefined ? { date } : {}),
            ...(local !== undefined ? { local } : {})
        }

        const appointment = await this.appointmentsRepository.update(appointmentToUpdate.publicId, updateData)

        if (!appointment) {
            throw new ResourceNotFoundError()
        }

        return { appointment }
    }
}