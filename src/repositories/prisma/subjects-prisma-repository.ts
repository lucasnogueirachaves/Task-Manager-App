import type { SubjectsRepository } from "../subjects-repository.js";
import type { Prisma } from "@/generated/prisma/client.js";
import { prisma } from "@/lib/prisma.js";
import type { SubjectAbsence } from "@/generated/prisma/client.js";

export class PrismaSubjectRepository implements SubjectsRepository {
    async create(data: Prisma.SubjectAbsenceCreateInput) {
        return await prisma.SubjectAbsence.create({data})
    }
    async readMany() {
        return await prisma.SubjectAbsence.findMany({})
    }
    async readId(publicId: string) {
        return await prisma.SubjectAbsence.findUnique({
            where: {
                publicId
            }
        })
    }
    async update(publicId: string, data: Prisma.SubjectAbsenceUpdateInput) {
        return await prisma.SubjectAbsence.update({
            where: {
                publicId
            }, data
        })
    }
    async delete(publicId: string) {
        await prisma.SubjectAbsence.delete({
            where: {
                publicId
            }
        })
    }
}