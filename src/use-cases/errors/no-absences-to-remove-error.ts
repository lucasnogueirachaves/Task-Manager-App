export class NoAbsencesToRemoveError extends Error {
    constructor() {
        super('Esta matéria não tem faltas para remover')
    }
}
