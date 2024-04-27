/*
  Warnings:

  - You are about to drop the column `speciality` on the `MedicalExp` table. All the data in the column will be lost.
  - Added the required column `speciality` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "speciality" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MedicalExp" DROP COLUMN "speciality";
