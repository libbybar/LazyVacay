import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { ERROR_CODES } from "../constants/errorCodes.js";
import { validateRegisterInput } from "../middleware/authValidations.js";

const router = express.Router();


router.post("/register", validateRegisterInput, async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({
        error: ERROR_CODES.EMAIL_ALREADY_EXISTS,
        devMessage: "This email is already registered."
      });
    }

    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber
      }
    });

  
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});


router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: ERROR_CODES.MISSING_REQUIRED_FIELDS,
        devMessage: "Email and password are required."
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        error: ERROR_CODES.INVALID_CREDENTIALS,
        devMessage: "Invalid email or password."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: ERROR_CODES.INVALID_CREDENTIALS,
        devMessage: "Invalid email or password."
      });
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
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;