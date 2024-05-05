/*
  Warnings:

  - You are about to drop the column `fromDoctorId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `fromPatientId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `toDoctorId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `toPatientId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_fromDoctorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_fromPatientId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "fromDoctorId",
DROP COLUMN "fromPatientId",
DROP COLUMN "toDoctorId",
DROP COLUMN "toPatientId",
DROP COLUMN "updatedAt",
ADD COLUMN     "conversationId" INTEGER NOT NULL,
ADD COLUMN     "doctorId" INTEGER,
ADD COLUMN     "patientId" INTEGER,
ADD COLUMN     "sender" TEXT NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
