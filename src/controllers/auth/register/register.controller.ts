import { Request, Response, NextFunction } from "express";
import CustomErrorHandler from "../../../services/CustomErrorHandler";
import { emailPasswordHelper } from "./emailPassword.helper";
import { googleHelper } from './google.helper'
import { githubHelper } from "./github.helper";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // find provider
  const provider: string = req.body.provider;
  if (!provider) {
    return next(CustomErrorHandler.unAuthorized("Provider not found"));
  }

  if (provider === "emailPassword") {
    emailPasswordHelper(req,res,next,provider)
  } else if (provider === "google") {
    googleHelper(req,res,next,provider)
  } else if (provider === "github") {
    githubHelper(req,res,next,provider)
  }
};
