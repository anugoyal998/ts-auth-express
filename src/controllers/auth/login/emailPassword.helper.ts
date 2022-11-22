import { Request, Response, NextFunction } from "express";
import CustomErrorHandler from "../../../services/CustomErrorHandler";
import Joi from "joi"
import userModel from "../../../models/user.model";
import refreshModel from "../../../models/refresh.model";
import bcrypt from 'bcrypt'
import Jwt from '../../../services/Jwt'
import ENV from '../../../config'
import { IFindOneUser, IPayload, IProvider } from "../../../types";
const { JWT_REFRESH_SECRET } = ENV

export const emailPasswordHelper = async (
    req: Request,
    res: Response,
    next: NextFunction,
    provider: string
) => {
    // validate schema
    const schema = Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password'),
        provider: Joi.string()
    })

    const { error } = schema.validate(req.body);

    if(error){
        return next(error)
    }

    // find user
    let user: IFindOneUser;
    try {
        user = await userModel.findOne({ username: req.body.username}) as IFindOneUser
        if(!user){
            return next(CustomErrorHandler.notFound('user not found'))
        }
    } catch (err) {
        return next(err)
    }

    // match password

    const [userProvider] = user.providers.filter((e: IProvider)=> e.provider === "emailPassword")

    if(!userProvider){
        return next(CustomErrorHandler.notFound())
    }else{
        try {
            const match = await bcrypt.compare(req.body.password,userProvider.password as string)
            if(!match) {
                return next(CustomErrorHandler.wrongCredentials())
            }
        } catch (err) {
            return next(err)
        }
    }

    // genrate tokens

    let accessToken;
    let refreshToken;

    try {
        const payload: IPayload = {
            name: userProvider.name,
            profilePhotoURL: userProvider.profilePhotoURL,
            username: req.body.username
        }
        accessToken = Jwt.createToken(payload)
        refreshToken = Jwt.createToken(payload,Jwt.EXPIRY,JWT_REFRESH_SECRET)
        await refreshModel.create({ token: refreshToken })
    } catch (err) {
        return next(err)
    }

    res.status(200).json({ accessToken, refreshToken })
}