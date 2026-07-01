import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { ApiError } from "../middleware/ApiError.js";
import { validateRegisterInput, validateProfileUpdate } from "../middleware/authValidations.js";
import { requireAuth } from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/register", validateRegisterInput, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return next(
        new ApiError(
          400,
          ERROR_CODES.EMAIL_ALREADY_EXISTS,
          "This email is already registered."
        )
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber ? phoneNumber.trim() : null,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
});


router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return next(new ApiError(
        400,
        ERROR_CODES.MISSING_REQUIRED_FIELDS,
        "Email and password are required."));
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return next(new ApiError(
        401,
        ERROR_CODES.INVALID_CREDENTIALS,
        "Invalid email or password."
      ));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new ApiError(
        401,
        ERROR_CODES.INVALID_CREDENTIALS,
        "Invalid email or password."
      ));
    }


    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/profile", requireAuth, async (req, res, next) => {
  try {
    const loggedInUserId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: loggedInUserId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,

        reservations: {
          where: {
            status: {
              not: "CANCELLED",
            },
          },
          orderBy: {
            startDate: "asc",
          },
          select: {
            id: true,
            bookingNumber: true,
            startDate: true,
            endDate: true,
            price: true,
            status: true,
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
              },
            },
          },
        },
      },
    });

    if (!user) {
      return next(
        new ApiError(
          404,
          ERROR_CODES.USER_NOT_FOUND,
          "User not found."
        )
      );
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      reservations: user.reservations,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/profile", requireAuth, validateProfileUpdate, async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    const userId = req.user.userId;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      return next(new ApiError(
        409,
        ERROR_CODES.EMAIL_ALREADY_EXISTS,
        "This email is already in use by another account."
      ));
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName ? lastName.trim() : null,
        email: normalizedEmail,
        phoneNumber: phoneNumber ? phoneNumber.trim() : null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
      },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
});

export default router;