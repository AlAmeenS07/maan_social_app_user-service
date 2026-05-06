import jwt from "jsonwebtoken"

export const generateAccessToken = (userId : string , role : string) => {
    return jwt.sign({userId , role } , String(process.env.JWT_SECRET) , {expiresIn : "1h"})
} 

export const generateRefreshToken = (userId : string , role : string) => {
    return jwt.sign({userId , role} , String(process.env.JWT_SECRET) , {expiresIn : "7d"})
}

export const generateTempToken = (userId : string , role : string) => {
    return jwt.sign({userId , role} , String(process.env.JWT_SECRET) , {expiresIn : "5m"})
}

export const veriftyToken = (token : string) => {
    return jwt.verify(token , String(process.env.JWT_SECRET))
}