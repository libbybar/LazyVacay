import { Router } from "express";
import prisma from "../prismaClient.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { ApiError } from "../middleware/ApiError.js";

const router = Router();

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