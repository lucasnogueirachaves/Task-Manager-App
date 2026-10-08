import { PrismaSubjectRepository } from "@/repositories/prisma/subjects-prisma-repository.js";
import { RemoveSubjectAbsenceUseCase } from "@/use-cases/subjects/remove-absence.js";

export function makeRemoveSubjectAbsenceUseCase() {
    const subjectsRepository = new PrismaSubjectRepository()
    const useCase = new RemoveSubjectAbsenceUseCase(subjectsRepository)

    return useCase
}
