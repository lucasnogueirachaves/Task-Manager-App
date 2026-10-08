import type { SubjectsRepository } from "@/repositories/subjects-repository.js"
import type { SubjectAbsence } from "@/generated/prisma/client.js"

type ReadSubjectsUseCaseResponse = {
    subjects: SubjectAbsence[]
}

export class ReadSubjectsUseCase {
    constructor(
        private subjectsRepository: SubjectsRepository) {}

    async execute(): Promise<ReadSubjectsUseCaseResponse> {

        const subjects = await this.subjectsRepository.readMany()

        return { subjects }
    }
}
