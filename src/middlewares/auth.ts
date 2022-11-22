import { Request, Response, NextFunction } from "express"
import CustomErrorHandler from "../services/CustomErrorHandler"
import Jwt from "../services/Jwt"
import { IPayload } from "../types"

const auth = async (req: Request, res: Response,next: NextFunction) => {
    let authHeader = req.headers.authorization
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized())
    }
    const token = authHeader.split(' ')[1]
    if(!token){
        return next(CustomErrorHandler.unAuthorized())
    }

    try {
        const [decoded,error] = await Jwt.verifyToken(token)
        if(error){
            return next(error)
        }
        let payload = decoded as IPayload
        req.user = payload
        next()
    } catch (err) {
        return next(err)
    }
}

export default auth