/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,patientId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_doctorId_patientId_key" ON "Conversation"("doctorId", "patientId");
