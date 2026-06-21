import { ERROR_CODES } from "../constants/errorCodes.js";

const hasMissingFields = (body, requiredFields) => {
    return requiredFields.some((field) => body[field] === undefined);
};


export const validateHotelInput = (req, res, next) => {
    const { name, country, city, stars } = req.body;

    const requiredFields = ["name", "country", "city", "stars"];

    if (hasMissingFields(req.body, requiredFields)) {
        return res.status(400).json({
            error: ERROR_CODES.MISSING_REQUIRED_FIELDS,
            devMessage: "name, country, city, and stars are required."
        });
    }

    if (
        typeof name !== "string" ||
        typeof country !== "string" ||
        typeof city !== "string" ||
        !Number.isInteger(stars) ||
        name.trim() === "" ||
        country.trim() === "" ||
        city.trim() === "" ||
        stars < 1 ||
        stars > 5
    ) {
        return res.status(400).json({
            error: ERROR_CODES.INVALID_HOTEL_INPUT,
            devMessage: "Invalid hotel input."
        });
    }

    next();
};

export const validateRoomInput = (req, res, next) => {

    const { name, size, maxGuests, price, hotelId } = req.body;

    const requiredFields = ["name", "size", "maxGuests", "price", "hotelId"];
    if (hasMissingFields(req.body, requiredFields)) {
        return res.status(400).json({
            error: ERROR_CODES.MISSING_REQUIRED_FIELDS,
            devMessage: "name, size, maxGuests, price, and hotelId are required."
        });
    }

    if (
        typeof name !== "string" ||
        typeof size !== "number" ||
        !Number.isInteger(maxGuests) ||
        typeof price !== "number" ||
        typeof hotelId !== "string" ||
        name.trim() === "" ||
        hotelId.trim() === "" ||
        size < 0 ||
        maxGuests < 0 ||
        price < 0 || price > 100000
    ) {
        return res.status(400).json({
            error: ERROR_CODES.INVALID_ROOM_INPUT,
            devMessage: "Invalid room input."
        });
    }

    next();
};