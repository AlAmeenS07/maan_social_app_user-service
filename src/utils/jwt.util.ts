import jwt from "jsonwebtoken"

export const generateAccessToken = (payload : string) => {
    return jwt.sign({userId : payload} , String(process.env.JWT_SECRET) , {expiresIn : "1h"})
} 

export const generateRefreshToken = (payload : string) => {
    return jwt.sign({userId : payload} , String(process.env.JWT_SECRET) , {expiresIn : "7d"})
}

