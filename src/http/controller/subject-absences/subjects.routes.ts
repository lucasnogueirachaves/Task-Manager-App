import type { FastifyInstance } from "fastify";
import { createSubject } from "./create-subject-controller.js";
import { readSubjects } from "./read-subjects-controller.js";
import { addSubjectAbsence } from "./add-subject-absence-controller.js";
import { removeSubjectAbsence } from "./remove-subject-absence-controller.js";
import { deleteSubject } from "./delete-subject-controller.js";

export async function subjectsRoutes(app: FastifyInstance) {
    app.post('/', createSubject)
    app.get('/', readSubjects)
    app.patch('/:publicId/absences/increment', addSubjectAbsence)
    app.patch('/:publicId/absences/decrement', removeSubjectAbsence)
    app.delete('/:publicId', deleteSubject)
}
