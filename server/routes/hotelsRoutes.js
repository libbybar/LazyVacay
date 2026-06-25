import { Router } from "express";
import prisma from "../prismaClient.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { validateHotelInput, validateRoomInput } from "../middleware/hotelsValidations.js";
import { validateReservation } from "../middleware/validateReservation.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import { ApiError } from "../middleware/ApiError.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
const hotels = await prisma.hotel.findMany({
  where: {
    isDeleted: false,
  },
});    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

router.get("/available_rooms", requireAuth, async (req, res, next) => {
  try {
    const { start_date, end_date, hotelId } = req.query;

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        error: ERROR_CODES.INVALID_DATE_FORMAT,
        devMessage: "Invalid date format provided.",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        error: ERROR_CODES.END_DATE_BEFORE_START_DATE,
        devMessage: "End date must be after start date.",
      });
    }

    const roomFilters = {
      isDeleted: false,
      reservations: {
        none: {
          AND: [
            { status: { not: "CANCELLED" } },
            { startDate: { lt: end } },
            { endDate: { gt: start } },
          ],
        },
      },
    };

   
    if (hotelId) {
      roomFilters.hotelId = hotelId;
    }

    const availableRooms = await prisma.room.findMany({
      where: roomFilters,
      include: {
        hotel: true,
      },
    });

    if (availableRooms.length === 0) {
      return res.status(200).json([]);
    }

    const formattedRooms = availableRooms.map((room) => ({
      id: room.id,
      name: room.name,
      max_guests: room.maxGuests,
      price: room.price,
      size: room.size,
      hotel: room.hotel,
    }));

    res.status(200).json(formattedRooms);
  } catch (error) {
    next(error);
  }
});

router.get("/rooms/:roomId", requireAuth, async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true },
    });

    if (!room) {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          `Room with ID ${roomId} not found`
        )
      );
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireAdmin, validateHotelInput, async (req, res, next) => {
  try {
    const { name, country, city, stars, description, imageUrl } = req.body;

    const newHotel = await prisma.hotel.create({
      data: {
        name: name.trim(),
        country: country.trim(),
        city: city.trim(),
        stars,
        description: description ? description.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null,
      },
    });

    res.status(201).json(newHotel);
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return next(
        new ApiError(
          400,
          ERROR_CODES.HOTEL_ALREADY_EXISTS,
          "Hotel with this name already exists."
        )
      );
    }

    next(error);
  }
});

router.post("/rooms", requireAuth, requireAdmin, validateRoomInput, async (req, res, next) => {
  try {
    const { name, size, maxGuests, price, hotelId, description, imageUrl } = req.body;

    const newRoom = await prisma.room.create({
      data: {
        name,
        size,
        maxGuests,
        price,
        hotelId,
        description,
        imageUrl,
      },
    });

    res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }
});

router.post("/reserve", requireAuth, validateReservation, async (req, res, next) => {
  try {
    const { roomId, hotelId } = req.body;
    const userId = req.user.userId;
    const { start, end } = req.validatedDates;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          `Room with ID ${roomId} not found.`
        )
      );
    }

    if (room.hotelId !== hotelId) {
      return next(
        new ApiError(
          400,
          ERROR_CODES.INVALID_ROOM_HOTEL_MATCH,
          "The room does not exist in the hotel. No reservation made !!"
        )
      );
    }

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        roomId,
        status: { not: "CANCELLED" },
        startDate: { lt: end },
        endDate: { gt: start },
      },
    });

    if (conflictingReservation) {
      return next(
        new ApiError(
          400,
          ERROR_CODES.ROOM_ALREADY_BOOKED,
          "The room is already reserved for the requested dates."
        )
      );
    }

    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const calculatedFinalPrice = nights * room.price * 1.18;

    const newReservation = await prisma.reservation.create({
      data: {
        roomId,
        hotelId,
        userId,
        startDate: start,
        endDate: end,
        price: calculatedFinalPrice,
      },
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
      details: {
        nights,
        pricePerNight: room.price,
        finalPriceIncludingVAT: calculatedFinalPrice,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/reserve/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          "Reservation not found."
        )
      );
    }

    if (reservation.userId !== userId) {
      return next(
        new ApiError(
          403,
          ERROR_CODES.UNAUTHORIZED,
          "You do not have permission to cancel this reservation."
        )
      );
    }

    const cancelledReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    res.json({
      message: "Reservation cancelled successfully",
      reservation: cancelledReservation,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, requireAdmin, validateHotelInput, async (req, res, next) => { 
  try {
    const { id } = req.params;
    const { name, country, city, stars, description, imageUrl } = req.body;

    const updatedHotel = await prisma.hotel.update({
      where: { id },
      data: {
        name: name.trim(),
        country: country.trim(),
        city: city.trim(),
        stars,
        description: description ? description.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null,
      },
    });

    res.json(updatedHotel);
  } catch (error) {
    if (error.code === "P2025") {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          "Hotel not found."
        )
      );
    }

    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return next(
        new ApiError(
          400,
          ERROR_CODES.HOTEL_ALREADY_EXISTS,
          "Hotel with this name already exists."
        )
      );
    }

    next(error);
  }
});

router.patch("/:id/delete", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedHotel = await prisma.hotel.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.json(deletedHotel);
  } catch (error) {
    if (error.code === "P2025") {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          "Hotel not found."
        )
      );
    }

    next(error);
  }
});

router.patch("/rooms/:roomId", requireAuth, requireAdmin, validateRoomInput, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { name, size, maxGuests, price, hotelId, description, imageUrl } = req.body;

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        name: name.trim(),
        size,
        maxGuests,
        price,
        hotelId,
        description: description ? description.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null,
      },
    });

    res.json(updatedRoom);
  } catch (error) {
    if (error.code === "P2025") {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          "Room not found."
        )
      );
    }

    next(error);
  }
});

router.patch("/rooms/:roomId/delete", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const deletedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        isDeleted: true,
      },
    });

    res.json(deletedRoom);
  } catch (error) {
    if (error.code === "P2025") {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          "Room not found."
        )
      );
    }

    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

 const hotel = await prisma.hotel.findFirst({
  where: {
    id,
    isDeleted: false,
  },
  include: {
    rooms: {
      where: {
        isDeleted: false,
      },
    },
  },
});

    if (!hotel) {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          `Hotel with ID ${id} not found`
        )
      );
    }

    res.json(hotel);
  } catch (error) {
    next(error);
  }
});

export default router;