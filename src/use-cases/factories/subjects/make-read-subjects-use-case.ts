import { PrismaSubjectRepository } from "@/repositories/prisma/subjects-prisma-repository.js";
import { ReadSubjectsUseCase } from "@/use-cases/subjects/read.js";

export function makeReadSubjectsUseCase() {
    const subjectsRepository = new PrismaSubjectRepository()
    const useCase = new ReadSubjectsUseCase(subjectsRepository)

    return useCase
}
