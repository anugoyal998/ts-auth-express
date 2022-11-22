import { Request, Response, NextFunction } from "express"
import Joi from "joi"
import refreshModel from "../../models/refresh.model"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import Jwt from "../../services/Jwt"
import ENV from "../../config"
import { IPayload } from "../../types"
const { JWT_REFRESH_SECRET } = ENV

export const refreshController = async (req: Request, res: Response,next: NextFunction) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required()
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return next(error);
    }

    let refreshToken;
    let accessToken;
    try {

        refreshToken = await refreshModel.findOne({ token: req.body.refreshToken });
        if (!refreshToken) {
            return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
        }
        const [ decoded, jwtError ] = await Jwt.verifyToken(refreshToken.token,JWT_REFRESH_SECRET)
        if(jwtError) {
            return next(jwtError);
        }
        let data = decoded as IPayload
        const payload = {
            name: data.name,
            username: data.username,
            profilePhotoURL: data.profilePhotoURL
        } as IPayload
        accessToken = Jwt.createToken(payload)
        refreshToken = Jwt.createToken(payload,Jwt.EXPIRY,JWT_REFRESH_SECRET)
        await refreshModel.create({ token: refreshToken })
    } catch (err) {
        return next(err);
    }

    res.status(200).json({ accessToken, refreshToken })
}