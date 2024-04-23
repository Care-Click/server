/*
  Warnings:

  - The `Familial_Medical_History` column on the `MedicalInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `Imaging_test_results` column on the `MedicalInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `content` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicalInfo" DROP COLUMN "Familial_Medical_History",
ADD COLUMN     "Familial_Medical_History" TEXT[],
DROP COLUMN "Imaging_test_results",
ADD COLUMN     "Imaging_test_results" TEXT[];

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "content",
ADD COLUMN     "Allergies" TEXT[],
ADD COLUMN     "Chronic_Illness" TEXT[],
ADD COLUMN     "Familial_Medical_History" TEXT[],
ADD COLUMN     "Imaging_test_results" TEXT[],
ADD COLUMN     "Medications" TEXT[],
ADD COLUMN     "PastIllness" TEXT[],
ADD COLUMN     "Surgeries" TEXT[];
