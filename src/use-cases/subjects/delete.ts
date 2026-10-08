import type { SubjectsRepository } from "@/repositories/subjects-repository.js"
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js"

interface DeleteSubjectUseCaseRequest {
    publicId: string
}

export class DeleteSubjectUseCase {
    constructor(private subjectsRepository: SubjectsRepository) {}
    async execute({publicId}: DeleteSubjectUseCaseRequest): Promise<void> {
        const subject = await this.subjectsRepository.readId(publicId)

        if(!subject) {
            throw new ResourceNotFoundError()
        }

        await this.subjectsRepository.delete(subject.publicId)
    }
}
