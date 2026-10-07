import type { AppointmentsRepository } from "../appointments-repository.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaAppointmentRepository implements AppointmentsRepository {
    async create(data: Prisma.AppointmentCreateInput) {
        return await prisma.appointment.create({data})
    }
    async readMany() {
        return await prisma.appointment.findMany({})
    }
    async readId(publicId: string) {
        return await prisma.appointment.findUnique({
            where: {
                publicId
            }
        })
    }
    async update(publicId: string, data: Prisma.AppointmentUpdateInput) {
        return await prisma.appointment.update({
            where: {
                publicId
            }, data
        })
    }
    async delete(publicId: string) {
        await prisma.appointment.delete({
            where: {
                publicId
            }
        })
    }
}