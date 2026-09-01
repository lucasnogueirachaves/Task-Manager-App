import type { Prisma, Appointment } from "@/generated/prisma/client.js"

export interface AppointmentsRepository {
    create(data: Prisma.AppointmentCreateInput): Promise<Appointment>
    readMany(): Promise<Appointment[]>
    readId(publicId: string): Promise<Appointment | null>
    update(publicId: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment | null>
    delete(publicId: string): Promise<void>
}