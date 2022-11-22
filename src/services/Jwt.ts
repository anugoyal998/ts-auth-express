import jwt from 'jsonwebtoken'
import ENV from '../config'
const { JWT_ACCESS_SECRET } = ENV

class Jwt {
    static EXPIRY = "1d"
    static createToken(payload: any, expiry: string = '1h', secret = JWT_ACCESS_SECRET): string{
        return jwt.sign(payload, secret, { expiresIn: expiry})
    }
    static async verifyToken(token: string, secret: string = JWT_ACCESS_SECRET){
        let decoded;
        let error;
        try {
            decoded = jwt.verify(token,secret)
        } catch (err) {
            error = err
        }
        return [decoded, error]
    }
}

export default Jwt