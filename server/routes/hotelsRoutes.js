import { Router } from "express";
import prisma from "../prismaClient.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { validateHotelInput, validateRoomInput } from "../middleware/hotelsValidations.js";
import { validateReservation } from "../middleware/validateReservation.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const hotels = await prisma.hotel.findMany();
    res.json(hotels);
  } catch (error) {
    next(error);
  }
});

router.get("/available_rooms", async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        error: ERROR_CODES.MISSING_REQUIRED_FIELDS,
        devMessage: "start_date and end_date query parameters are required."
      });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const availableRooms = await prisma.room.findMany({
      where: {
        NOT: {
          reservations: {
            some: {
              startDate: { lt: end },
              endDate: { gt: start }
            }
          }
        }
      },
      include: { hotel: true }
    });

    if (availableRooms.length === 0) {
      return res.status(200).send("No rooms found on these dates");
    }

    res.json(availableRooms);
  } catch (error) {
    next(error);
  }
});

router.get("/room/:roomId", async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { hotel: true }
    });

    if (!room) {
      return res.status(404).json({
        error: ERROR_CODES.RESOURCE_NOT_FOUND,
        devMessage: `Room with ID ${roomId} not found`
      });
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: { rooms: true } 
    });

    if (!hotel) {
      return res.status(404).json({
        error: ERROR_CODES.RESOURCE_NOT_FOUND,
        devMessage: `Hotel with ID ${id} not found`
      });
    }

    res.json(hotel);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireAdmin, validateHotelInput, async (req, res, next) => {
  try {
    const { name, country, city, stars, description, imageUrl } = req.body;

    const newHotel = await prisma.hotel.create({
      data: { name, country, city, stars, description, imageUrl }
    });
    res.status(201).json(newHotel);
  } catch (error) { next(error); }
});

  
router.post("/rooms", requireAuth, requireAdmin, validateRoomInput, async (req, res, next) => {
  try {
    const { name, size, maxGuests, price, hotelId, description, imageUrl } = req.body;
    const newRoom = await prisma.room.create({
      data: { name, size, maxGuests, price, hotelId, description, imageUrl }
    });
    res.status(201).json(newRoom);
  } catch (error) { next(error); }
});

router.post("/reserve", requireAuth, validateReservation, async (req, res, next) => {
  try {
    const { roomId, hotelId } = req.body;
    const userId = req.user.userId;
    const { start, end } = req.validatedDates;

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return res.status(404).json({
        error: ERROR_CODES.RESOURCE_NOT_FOUND,
        devMessage: `Room with ID ${roomId} not found.`
      });
    }

    if (room.hotelId !== hotelId) {
      return res.status(400).json({
        error: ERROR_CODES.INVALID_ROOM_HOTEL_MATCH,
        devMessage: "The room does not exist in the hotel. No reservation made !!"
      });
    }

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        roomId,
        status: { not: "CANCELLED" }, 
        startDate: { lt: end },
        endDate: { gt: start }
      }
    });

    if (conflictingReservation) {
      return res.status(400).json({
        error: ERROR_CODES.ROOM_ALREADY_BOOKED,
        devMessage: "The room is already reserved for the requested dates."
      });
    }

    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const calculatedFinalPrice = (nights * room.price) * 1.18;

    const newReservation = await prisma.reservation.create({
      data: {
        roomId,
        hotelId, 
        userId,
        startDate: start,
        endDate: end,
        price: calculatedFinalPrice 
      }
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
      details: {
        nights,
        pricePerNight: room.price,
        finalPriceIncludingVAT: calculatedFinalPrice
      }
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
      where: { id }
    });

    if (!reservation) {
      return res.status(404).json({
        error: ERROR_CODES.RESOURCE_NOT_FOUND,
        devMessage: "Reservation not found."
      });
    }

    if (reservation.userId !== userId) {
      return res.status(403).json({
        error: ERROR_CODES.UNAUTHORIZED,
        devMessage: "You do not have permission to cancel this reservation."
      });
    }

    const cancelledReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED"
      }
    });

    res.json({
      message: "Reservation cancelled successfully",
      reservation: cancelledReservation
    });
  } catch (error) {
    next(error);
  }
});

export default router;