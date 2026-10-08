-- AlterTable
ALTER TABLE "Hotel" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "updatedAt" DROP DEFAULT;
