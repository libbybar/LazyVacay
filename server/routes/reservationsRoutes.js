import { Router } from "express";
import prisma from "../prismaClient.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import { ApiError } from "../middleware/ApiError.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        startDate: "asc",
      },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });

    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, status } = req.body;

    const allowedStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];

    if (status && !allowedStatuses.includes(status)) {
      return next(
        new ApiError(
          400,
          ERROR_CODES.INVALID_USER_INPUT,
          "Invalid reservation status."
        )
      );
    }

    const existingReservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        room: true,
      },
    });

    if (!existingReservation) {
      return next(
        new ApiError(
          404,
          ERROR_CODES.RESOURCE_NOT_FOUND,
          "Reservation not found."
        )
      );
    }

    const nextStartDate = startDate
      ? new Date(startDate)
      : existingReservation.startDate;

    const nextEndDate = endDate
      ? new Date(endDate)
      : existingReservation.endDate;

    if (isNaN(nextStartDate.getTime()) || isNaN(nextEndDate.getTime())) {
      return next(
        new ApiError(
          400,
          ERROR_CODES.INVALID_DATE_FORMAT,
          "Invalid date format."
        )
      );
    }

    if (nextEndDate <= nextStartDate) {
      return next(
        new ApiError(
          400,
          ERROR_CODES.END_DATE_BEFORE_START_DATE,
          "End date must be after start date."
        )
      );
    }

    const nextStatus = status || existingReservation.status;

    if (nextStatus !== "CANCELLED") {
      const conflictingReservation = await prisma.reservation.findFirst({
        where: {
          id: {
            not: id,
          },
          roomId: existingReservation.roomId,
          status: {
            not: "CANCELLED",
          },
          startDate: {
            lt: nextEndDate,
          },
          endDate: {
            gt: nextStartDate,
          },
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
    }

    const diffTime = Math.abs(nextEndDate - nextStartDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const calculatedFinalPrice = nights * existingReservation.room.price * 1.18;

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        startDate: nextStartDate,
        endDate: nextEndDate,
        status: nextStatus,

        price: calculatedFinalPrice,
      },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });

    res.json(updatedReservation);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user.userId;
    const loggedInUserRole = req.user.role;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        room: true,
        hotel: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
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

    const isReservationOwner = reservation.userId === loggedInUserId;
    const isAdmin = loggedInUserRole === "ADMIN";

    if (!isReservationOwner && !isAdmin) {
      return next(
        new ApiError(
          403,
          ERROR_CODES.UNAUTHORIZED,
          "You do not have permission to view this reservation."
        )
      );
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

export default router;