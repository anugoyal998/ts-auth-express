import { IPayload } from "./types";

declare global {
  namespace Express {
    interface Request {
      user?: IPayload;
    }
  }
}

// controllers
export { registerController } from "./controllers"
export { loginController } from "./controllers"
export { logoutController } from "./controllers"
export { whoAmIController } from "./controllers"
export { refreshController } from "./controllers"

// middlewares
export { default as auth } from "./middlewares/auth"
export { default as errorHandler } from "./middlewares/errorHandler"

// models
export { default as UserModel } from "./models/user.model"
export { default as RefreshModel } from "./models/refresh.model"

// services
export { default as JwtService }  from "./services/Jwt"
export { default as CustomErrorHandler } from  "./services/CustomErrorHandler"