import { Router } from "express";
import prisma from "../prismaClient.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { validateBooking } from "../middlewares/validateBooking.js"; 

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const hotels = await prisma.hotel.findMany();
    res.json(hotels);
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

router.post("/book", validateBooking, async (req, res, next) => {
  try {
    const { roomId, hotelId, userId } = req.body;
    
    const { start, end } = req.validatedDates;

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    // Required by project specification: validate that the selected room belongs to the selected hotel.
    if (!room || room.hotelId !== hotelId) {
      return res.status(400).json({
        error: ERROR_CODES.INVALID_ROOM_HOTEL_MATCH,
       devMessage: `Room ${roomId} does not belong to hotel ${hotelId}`
      });
    }

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        roomId,
        startDate: { lt: end }, 
        endDate: { gt: start }  
      }
    });

    if (conflictingReservation) {
      return res.status(400).json({
        error: ERROR_CODES.ROOM_ALREADY_BOOKED,
        devMessage: "The room is already booked for the selected dates"
      });
    }

    const newReservation = await prisma.reservation.create({
      data: {
        startDate: start,
        endDate: end,
        userId,
        roomId
      }
    });

    res.status(201).json(newReservation);
  } catch (error) {
    next(error);
  }
});

export default router;