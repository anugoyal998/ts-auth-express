import { Request, Response, NextFunction } from "express"
import userModel from "../../models/user.model"
import CustomErrorHandler from "../../services/CustomErrorHandler";
import { IPayload } from "../../types";

export const whoAmIController = async (req: Request, res: Response,next: NextFunction) => {
    const payload = req.user as IPayload;
    try {
        const user = await userModel.findOne({ username: payload.username }).select("-updatedAt -__v")
        if(!user){
            return next(CustomErrorHandler.serverError())
        }
        let clientUser = {
            _id: user._id,
            username: user.username,
            providers: user.providers.map((ele)=> {
                return {
                    provider: ele.provider,
                    name: ele.name,
                    profilePhotoURL: ele.profilePhotoURL,
                    isEmailPassword: ele.isEmailPassword,
                }
            })
        }
        res.status(200).json(clientUser)
    } catch (err) {
        return next(err)
    }
}