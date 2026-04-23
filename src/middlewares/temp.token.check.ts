import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { errorResponse } from "../utils/response.handler";
import { veriftyToken } from "../utils/jwt.util";
import { JwtPayload } from "jsonwebtoken";
import { INVALID_USER, TOKEN_MISSING } from "../utils/constants";


export const tempTokenCheck = expressAsyncHandler(async(req : Request , res : Response , next : NextFunction) => {

    const {tempToken} = req.cookies

    if(!tempToken){
        return errorResponse(TOKEN_MISSING , 401)
    }

    const decoded = veriftyToken(tempToken) as JwtPayload

    if(decoded.role != "user"){
        return errorResponse(INVALID_USER , 400)
    }

    (req as any).userId = decoded.userId

    next()
})