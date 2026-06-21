/*
  Warnings:

  - You are about to drop the column `numberOfRooms` on the `Hotel` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hotelId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "numberOfRooms",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "hotelId" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
