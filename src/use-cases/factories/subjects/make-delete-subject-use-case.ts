import { PrismaSubjectRepository } from "@/repositories/prisma/subjects-prisma-repository.js";
import { DeleteSubjectUseCase } from "@/use-cases/subjects/delete.js";

export function makeDeleteSubjectUseCase() {
    const subjectsRepository = new PrismaSubjectRepository()
    const useCase = new DeleteSubjectUseCase(subjectsRepository)

    return useCase
}
