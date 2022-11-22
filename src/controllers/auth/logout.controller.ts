import { Request, Response, NextFunction } from "express"
import Joi from "joi"
import refreshModel from "../../models/refresh.model"

export const logoutController = async (req: Request, res: Response,next: NextFunction) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required()
    })
    const { error } = schema.validate(req.body)

    if(error){
        return next(error)
    }

    try {
        await refreshModel.deleteOne({ token: req.body.refreshToken })
    } catch (err) {
        return next(err)
    }

    res.status(200).json({ msg: "logout successful" })
}