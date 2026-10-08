export class SubjectAlreadyExistsError extends Error {
    constructor() {
        super('Já existe uma matéria com esse nome')
    }
}
