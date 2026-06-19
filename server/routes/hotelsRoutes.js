import { Router } from "express";
import prisma from "../prismaClient.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { validateReservation } from "../middlewares/validateReservation.js";

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

router.post("/reserve", validateReservation, async (req, res, next) => {
  try {
    const { roomId, userId } = req.body;
    const { start, end } = req.validatedDates;

   
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
        devMessage: "The room is already reserved for the requested dates."
      });
    }

  
    const newReservation = await prisma.reservation.create({
      data: {
        roomId,
        userId,
        startDate: start,
        endDate: end
      }
    });

    res.status(201).json(newReservation);
  } catch (error) {
    next(error);
  }
});

export default router;