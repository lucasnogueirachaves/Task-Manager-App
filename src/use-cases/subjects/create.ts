import type { SubjectsRepository } from "@/repositories/subjects-repository.js"
import type { SubjectAbsence } from "@/generated/prisma/client.js"
import { SubjectAlreadyExistsError } from "../errors/subject-already-exists-error.js"

interface CreateSubjectUseCaseRequest {
    subjectName: string
}

type CreateSubjectUseCaseResponse = {
    subject: SubjectAbsence
}

export class CreateSubjectUseCase {
    constructor(
        private subjectsRepository: SubjectsRepository) {}

    async execute({
        subjectName
    }: CreateSubjectUseCaseRequest): Promise<CreateSubjectUseCaseResponse> {

        const subjectWithSameName = await this.subjectsRepository.readBySubject(subjectName)

        if (subjectWithSameName) {
            throw new SubjectAlreadyExistsError()
        }

        const subject = await this.subjectsRepository.create({
            subject: subjectName
        })

        return { subject }
    }
}
