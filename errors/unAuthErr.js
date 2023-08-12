import { CustomError } from './customError.js';

import { StatusCodes } from 'http-status-codes'


export class UnauthenticatedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

