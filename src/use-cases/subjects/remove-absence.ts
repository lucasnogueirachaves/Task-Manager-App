import type { SubjectsRepository } from "@/repositories/subjects-repository.js"
import type { SubjectAbsence } from "@/generated/prisma/client.js"
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js"
import { NoAbsencesToRemoveError } from "../errors/no-absences-to-remove-error.js"

interface RemoveSubjectAbsenceUseCaseRequest {
    publicId: string
}

type RemoveSubjectAbsenceUseCaseResponse = {
    subject: SubjectAbsence
}

export class RemoveSubjectAbsenceUseCase {
    constructor(
        private subjectsRepository: SubjectsRepository) {}

    async execute({
        publicId
    }: RemoveSubjectAbsenceUseCaseRequest): Promise<RemoveSubjectAbsenceUseCaseResponse> {

        const subjectToUpdate = await this.subjectsRepository.readId(publicId)

        if (!subjectToUpdate) {
            throw new ResourceNotFoundError()
        }

        // Regra de negócio: o contador nunca fica negativo.
        if (subjectToUpdate.absences <= 0) {
            throw new NoAbsencesToRemoveError()
        }

        const subject = await this.subjectsRepository.decrementAbsences(subjectToUpdate.publicId)

        // O repositório devolve null se, entre a leitura acima e o update, outra
        // requisição já levou o contador a zero. Tratamos como o mesmo caso.
        if (!subject) {
            throw new NoAbsencesToRemoveError()
        }

        return { subject }
    }
}
