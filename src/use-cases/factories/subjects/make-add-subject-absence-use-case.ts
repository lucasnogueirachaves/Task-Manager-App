import { PrismaSubjectRepository } from "@/repositories/prisma/subjects-prisma-repository.js";
import { AddSubjectAbsenceUseCase } from "@/use-cases/subjects/add-absence.js";

export function makeAddSubjectAbsenceUseCase() {
    const subjectsRepository = new PrismaSubjectRepository()
    const useCase = new AddSubjectAbsenceUseCase(subjectsRepository)

    return useCase
}
