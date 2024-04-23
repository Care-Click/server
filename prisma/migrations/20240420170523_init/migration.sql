-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "FullName" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalExp" (
    "id" SERIAL NOT NULL,
    "speciality" TEXT NOT NULL,
    "id_card" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "doctor_id" INTEGER,
    "medical_id" TEXT NOT NULL,

    CONSTRAINT "MedicalExp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "report_id" INTEGER,
    "doctorId" INTEGER,
    "patientId" INTEGER,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "request_id" INTEGER NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "FullName" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "Gender" TEXT NOT NULL,
    "profile_picture" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "verification_code" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalInfo" (
    "id" SERIAL NOT NULL,
    "Familial_Medical_History" TEXT NOT NULL,
    "Allergies" TEXT[],
    "PastIllness" TEXT[],
    "Surgeries" TEXT[],
    "Medications" TEXT[],
    "Chronic_Illness" TEXT[],
    "Imaging_test_results" TEXT NOT NULL,
    "patientId" INTEGER,

    CONSTRAINT "MedicalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DoctorToPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalExp_doctor_id_key" ON "MedicalExp"("doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_request_id_key" ON "Report"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalInfo_patientId_key" ON "MedicalInfo"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "_DoctorToPatient_AB_unique" ON "_DoctorToPatient"("A", "B");

-- CreateIndex
CREATE INDEX "_DoctorToPatient_B_index" ON "_DoctorToPatient"("B");

-- AddForeignKey
ALTER TABLE "MedicalExp" ADD CONSTRAINT "MedicalExp_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalInfo" ADD CONSTRAINT "MedicalInfo_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToPatient" ADD CONSTRAINT "_DoctorToPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToPatient" ADD CONSTRAINT "_DoctorToPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
