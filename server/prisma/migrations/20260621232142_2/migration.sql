/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "bookingNumber" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_name_key" ON "Hotel"("name");
