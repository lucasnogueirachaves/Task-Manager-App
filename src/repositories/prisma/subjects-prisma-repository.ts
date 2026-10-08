import type { SubjectsRepository } from "../subjects-repository.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaSubjectRepository implements SubjectsRepository {
    async create(data: Prisma.SubjectAbsenceCreateInput) {
        return await prisma.subjectAbsence.create({data})
    }
    async readMany() {
        return await prisma.subjectAbsence.findMany({
            orderBy: {
                subject: 'asc'
            }
        })
    }
    async readId(publicId: string) {
        return await prisma.subjectAbsence.findUnique({
            where: {
                publicId
            }
        })
    }
    async readBySubject(subject: string) {
        return await prisma.subjectAbsence.findUnique({
            where: {
                subject
            }
        })
    }
    async update(publicId: string, data: Prisma.SubjectAbsenceUpdateInput) {
        return await prisma.subjectAbsence.update({
            where: {
                publicId
            }, data
        })
    }
    async incrementAbsences(publicId: string) {
        return await prisma.subjectAbsence.update({
            where: {
                publicId
            },
            data: {
                absences: { increment: 1 }
            }
        })
    }

    async decrementAbsences(publicId: string) {
        const { count } = await prisma.subjectAbsence.updateMany({
            where: {
                publicId,
                absences: { gt: 0 }
            },
            data: {
                absences: { decrement: 1 }
            }
        })

        if (count === 0) {
            return null
        }

        return await prisma.subjectAbsence.findUnique({
            where: {
                publicId
            }
        })
    }
    async delete(publicId: string) {
        await prisma.subjectAbsence.delete({
            where: {
                publicId
            }
        })
    }
}
