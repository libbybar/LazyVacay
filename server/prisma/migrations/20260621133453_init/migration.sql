/*
  Warnings:

  - You are about to drop the column `type` on the `Room` table. All the data in the column will be lost.
  - Added the required column `country` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfRooms` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxGuests` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_hotelId_fkey";

-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "numberOfRooms" INTEGER NOT NULL,
ADD COLUMN     "stars" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "type",
ADD COLUMN     "maxGuests" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "size" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
