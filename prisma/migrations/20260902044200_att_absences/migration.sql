/*
  Warnings:

  - You are about to drop the `absences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "absences";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "subjects_absences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "publicId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "absences" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_absences_publicId_key" ON "subjects_absences"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_absences_subject_key" ON "subjects_absences"("subject");
