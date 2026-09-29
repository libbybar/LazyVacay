import { describe, expect, it } from "vitest";
import prisma from "../prismaClient.js";
import { resetDatabase } from "./resetDatabase.js";
import { useCleanDatabase } from "./useCleanDatabase.js";

const createReservationGraph = async () => {
  const user = await prisma.user.create({
    data: { email: "guest@example.com", password: "hashed", firstName: "Dana", lastName: "Levi" },
  });
  const hotel = await prisma.hotel.create({
    data: { name: "Sea View", country: "Israel", city: "Eilat", stars: 4 },
  });
  const room = await prisma.room.create({
    data: { name: "Deluxe", size: 25, maxGuests: 2, price: 500, hotelId: hotel.id },
  });

  return prisma.reservation.create({
    data: {
      userId: user.id,
      hotelId: hotel.id,
      roomId: room.id,
      startDate: new Date("2030-01-10"),
      endDate: new Date("2030-01-12"),
      price: 1180,
    },
  });
};

describe("resetDatabase against the real test database", () => {
  useCleanDatabase();

  it("empties every table, including rows linked by foreign keys", async () => {
    await createReservationGraph();

    await resetDatabase(prisma);

    const counts = await Promise.all([
      prisma.reservation.count(),
      prisma.room.count(),
      prisma.hotel.count(),
      prisma.user.count(),
    ]);
    expect(counts).toEqual([0, 0, 0, 0]);
  });

  it("restarts booking numbers so every test sees the same first value", async () => {
    await createReservationGraph();
    await resetDatabase(prisma);

    const reservation = await createReservationGraph();

    expect(reservation.bookingNumber).toBe(1);
  });

  it("keeps the migration history so the schema is not lost", async () => {
    await resetDatabase(prisma);

    const [{ applied }] = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS applied FROM _prisma_migrations`;
    expect(applied).toBeGreaterThan(0);
  });
});
