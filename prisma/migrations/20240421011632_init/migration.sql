/*
  Warnings:

  - Added the required column `role` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "role" TEXT NOT NULL;
