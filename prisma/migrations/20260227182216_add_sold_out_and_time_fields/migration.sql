-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "availableFrom" TIME,
ADD COLUMN     "availableTo" TIME,
ADD COLUMN     "isSoldOut" BOOLEAN NOT NULL DEFAULT false;
