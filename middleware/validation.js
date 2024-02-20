import { StatusCodes } from "http-status-codes";
const reqMethods = ["body", "query", "params", "headers", "file", "files"];

export const validationCoreFunction = (schema) => {
    return (req, res, next) => {
        let validationErrorArr = [];
        for (const key of reqMethods) {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false });
                if (validationResult.error) {
                    validationErrorArr = [...validationResult.error.details];
                }
            }
        }

        if (validationErrorArr.length) {
            let errorsArr = validationErrorArr.map((err) => {
                const errObj = { field: err.context.key, message: err.message };
                return errObj;
            });
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", errors: errorsArr });
        }

        next();
    };
};
