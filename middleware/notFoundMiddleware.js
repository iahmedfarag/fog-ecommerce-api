import { StatusCodes } from "http-status-codes"
import { badRes } from "../Variables.js"

const notFoundMiddleware = (req, res) => {

    return res.status(StatusCodes.NOT_FOUND).json({ response: badRes, message: "route not found" })
}


export default notFoundMiddleware