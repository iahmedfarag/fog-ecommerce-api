import jwt from "jsonwebtoken"
import { StatusCodes } from 'http-status-codes';
import userModel from "../db/models/user.model.js";
import { badRes } from "../Variables.js";


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith(process.env.TOKEN_PERFIX)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ response: badRes, message: "sign in 'no token provided'" })
    }

    const token = authHeader.split(' ')[1]
    console.log(token)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id } = decoded
        const user = await userModel.findOne({ _id: id })

        if (!user) {
            // throw new UnAuthError("sign in again")
        }
        req.user = user
        next()
    } catch (error) {
        // throw new UnAuthError(`Not authorized to access this route`)
        console.log(error)
    }
}

export default auth
