/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `MedicalExp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `MedicalInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Doctor_id_key" ON "Doctor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalExp_id_key" ON "MedicalExp"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalInfo_id_key" ON "MedicalInfo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_id_key" ON "Patient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Request_id_key" ON "Request"("id");
