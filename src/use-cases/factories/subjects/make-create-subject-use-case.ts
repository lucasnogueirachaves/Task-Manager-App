import { PrismaSubjectRepository } from "@/repositories/prisma/subjects-prisma-repository.js";
import { CreateSubjectUseCase } from "@/use-cases/subjects/create.js";

export function makeCreateSubjectUseCase() {
    const subjectsRepository = new PrismaSubjectRepository()
    const useCase = new CreateSubjectUseCase(subjectsRepository)

    return useCase
}
