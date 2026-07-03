import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.hotel.findMany({
    where: { isDeleted: false },
    include: {
      rooms: {
        where: { isDeleted: false },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  for (const hotel of hotels) {
    if (hotel.rooms.length === 0) continue;
    const randomIndex = Math.floor(Math.random() * hotel.rooms.length);
    const room = hotel.rooms[randomIndex];
    await prisma.room.update({
      where: { id: room.id },
      data: { isAccessible: true },
    });
    console.log(`✓ ${hotel.name} — "${room.name}" marked accessible`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

