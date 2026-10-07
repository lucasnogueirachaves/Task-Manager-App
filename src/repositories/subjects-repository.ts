import type { Prisma, SubjectAbsence } from "@/generated/prisma/client.js"

export interface SubjectsRepository {
    create(data: Prisma.SubjectAbsenceCreateInput): Promise<SubjectAbsence>
    readMany(): Promise<SubjectAbsence[]>
    readId(publicId: string): Promise<SubjectAbsence | null>
    update(publicId: string, data: Prisma.SubjectAbsenceUpdateInput): Promise<SubjectAbsence | null>
    delete(publicId: string): Promise<void>
}