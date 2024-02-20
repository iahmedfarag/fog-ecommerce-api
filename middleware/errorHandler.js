import { StatusCodes } from "http-status-codes";
import { badRes, errorRes } from "../Variables.js";

const errorHandler = (err, req, res, next) => {
    let customError = {
        response: err.message ? badRes : errorRes,
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "something went wrong",
    };

    if (err.name === "ValidationError") {
        customError.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if (err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if (err.name === "CastError") {
        customError.message = `No item found with id : ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }
    if (err.name === "ReferenceError") {
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    return res.status(customError.statusCode).json({ response: customError.response, message: customError.message });
};

export default errorHandler;
