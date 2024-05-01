/*
  Warnings:

  - A unique constraint covering the columns `[dateTime,doctorId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Appointment_dateTime_key";

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_dateTime_doctorId_key" ON "Appointment"("dateTime", "doctorId");
