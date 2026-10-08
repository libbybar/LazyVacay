import { describe, expect, it } from "vitest";
import prisma from "../prismaClient.js";
import { useCleanDatabase } from "./useCleanDatabase.js";

const OLD_TIMESTAMP = new Date("2020-01-01T00:00:00.000Z");

const createOldHotel = () =>
  prisma.hotel.create({
    data: { name: "Sea View", country: "Israel", city: "Eilat", stars: 4, updatedAt: OLD_TIMESTAMP },
  });

const createOldRoom = async () => {
  const hotel = await createOldHotel();

  return prisma.room.create({
    data: { name: "Deluxe", size: 25, maxGuests: 2, price: 500, hotelId: hotel.id, updatedAt: OLD_TIMESTAMP },
  });
};

const createOldReservation = async () => {
  const room = await createOldRoom();
  const user = await prisma.user.create({
    data: { email: "guest@example.com", password: "hashed", firstName: "Dana", lastName: "Levi" },
  });

  return prisma.reservation.create({
    data: {
      userId: user.id,
      hotelId: room.hotelId,
      roomId: room.id,
      startDate: new Date("2030-01-10"),
      endDate: new Date("2030-01-12"),
      price: 1180,
      updatedAt: OLD_TIMESTAMP,
    },
  });
};

const modelsThatTrackUpdates = [
  {
    model: "Hotel",
    createRecord: createOldHotel,
    changeField: (hotel) => prisma.hotel.update({ where: { id: hotel.id }, data: { city: "Haifa" } }),
  },
  {
    model: "Room",
    createRecord: createOldRoom,
    changeField: (room) => prisma.room.update({ where: { id: room.id }, data: { price: 600 } }),
  },
  {
    model: "Reservation",
    createRecord: createOldReservation,
    changeField: (reservation) =>
      prisma.reservation.update({ where: { id: reservation.id }, data: { status: "CANCELLED" } }),
  },
];

describe("updatedAt bookkeeping", () => {
  useCleanDatabase();

  it.each(modelsThatTrackUpdates)(
    "moves updatedAt of a $model forward when a real field changes",
    async ({ createRecord, changeField }) => {
      const record = await createRecord();
      expect(record.updatedAt).toEqual(OLD_TIMESTAMP);

      const updated = await changeField(record);

      expect(updated.updatedAt.getTime()).toBeGreaterThan(OLD_TIMESTAMP.getTime());
    }
  );
});
