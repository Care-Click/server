/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_patientId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "doctorId",
DROP COLUMN "patientId",
DROP COLUMN "senderId";
