import { Request, Response, NextFunction } from "express";
import CustomErrorHandler from "../../../services/CustomErrorHandler";
import Joi from "joi"
import userModel from "../../../models/user.model";
import refreshModel from "../../../models/refresh.model";
import Jwt from '../../../services/Jwt'
import ENV from '../../../config'
import { IFindOneUser, IPayload, IProvider } from "../../../types";
const { JWT_REFRESH_SECRET } = ENV

export const githubHelper = async (
    req: Request,
    res: Response,
    next: NextFunction,
    provider: string
) => {
    // validate schema
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        username: Joi.string().email().required(),
        profilePhotoURL: Joi.string().uri(),
        provider: Joi.string()
    })

    const { error } = schema.validate(req.body);

    if(error){
        return next(error)
    }

    // find providers
    let user: IFindOneUser;
    try {
        user = await userModel.findOne({ username: req.body.username }) as IFindOneUser
    } catch (err) {
        return next(err)
    }

    if(!user){
        // save user
        const newUser = new userModel({
            username: req.body.username,
            providers: [{
                provider,
                name: req.body.name,
                profilePhotoURL: req.body.profilePhotoURL,
                isEmailPassword: false,
            }]
        })
        try {
            await newUser.save()
        } catch (err) {
            return next(err)
        }
    }else{
        const [githubProvider] = user.providers.filter((ele: IProvider)=> ele.provider === "github")
        if(githubProvider){
            return next(CustomErrorHandler.alreadyExist('This email is already in use'));
        }   
        try {
            await userModel.findByIdAndUpdate({_id: user._id},{
                $push: {
                    providers: {
                        provider,
                        name: req.body.name,
                        profilePhotoURL: req.body.profilePhotoURL,
                        isEmailPassword: false,
                    }
                }
            })
        } catch (err) {
            return next(err);
        }
    }
    
    // genrate tokens

    let accessToken;
    let refreshToken;

    try {
        const payload: IPayload = {
            name: req.body.name,
            profilePhotoURL: req.body.profilePhotoURL,
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