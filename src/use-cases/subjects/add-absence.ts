import type { SubjectsRepository } from "@/repositories/subjects-repository.js"
import type { SubjectAbsence } from "@/generated/prisma/client.js"
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js"

interface AddSubjectAbsenceUseCaseRequest {
    publicId: string
}

type AddSubjectAbsenceUseCaseResponse = {
    subject: SubjectAbsence
}

export class AddSubjectAbsenceUseCase {
    constructor(
        private subjectsRepository: SubjectsRepository) {}

    async execute({
        publicId
    }: AddSubjectAbsenceUseCaseRequest): Promise<AddSubjectAbsenceUseCaseResponse> {

        const subjectToUpdate = await this.subjectsRepository.readId(publicId)

        if (!subjectToUpdate) {
            throw new ResourceNotFoundError()
        }

        const subject = await this.subjectsRepository.incrementAbsences(subjectToUpdate.publicId)

        return { subject }
    }
}
