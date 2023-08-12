import { StatusCodes } from 'http-status-codes'
import { CustomError } from './customError.js';


export class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}


