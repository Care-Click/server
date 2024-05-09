-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "paymentMade" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subscribed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "verified" SET DEFAULT false;
