import { StatusCodes } from 'http-status-codes'
import joi from 'joi'
const reqMethods = ['body', 'query', 'params', 'headers', 'file', 'files']
// export const generalFields = {
//     email: joi
//         .string()
//         .email({ tlds: { allow: ['com', 'net', 'org'] } })
//         .required(),
//     password: joi
//         .string()
//         .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
//         .messages({ 'string.pattern.base': 'Password regex fail', })
//         .required(),
// }
export const validationCoreFunction = (schema) => {
    return (req, res, next) => {
        // req
        let validationErrorArr = []
        for (const key of reqMethods) {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false, })
                // console.log(validationResult.error, "here")
                if (validationResult.error) {
                    validationErrorArr = [...validationResult.error.details]
                }
            }
        }

        if (validationErrorArr.length) {
            let errorsArr = validationErrorArr.map((err) => {
                const errObj = {
                    field: err.context.key,
                    message: err.message
                }
                return errObj
            })
            console.log(errorsArr)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Validation Error', errors: errorsArr })
        }
        next()
    }
}
