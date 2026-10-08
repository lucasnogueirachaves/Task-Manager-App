-- AlterTable
ALTER TABLE "tasks" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'next';

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'next';
