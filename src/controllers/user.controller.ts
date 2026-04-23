import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import expressAsyncHandler from "express-async-handler";
import { errorResponse, successResponse } from "../utils/response.handler";
import { User } from "../generated/prisma/client";
import { OTP_SEND_TO_MAIL, OTP_SENDING_ERROR, OTP_VERFIED_SUCCESSFULLY, PASSWORD_RESET_SUCCESSFULLY, REGISTRATION_ERROR, RESET_PASSWORD_ERROR, USER_LOGIN_ERROR, USER_LOGIN_SUCCESSFULLY, USER_NOT_FOUND, VERIFY_OTP_ERROR } from "../utils/constants";


export class UserController {
    constructor(
        private _userService: UserService
    ) { }


    register = expressAsyncHandler(async (req: Request, res: Response) => {

        const { name, email, dob, gender, password } = req.body

        const { otp, user } = await this._userService.registerUser(name, email, dob, gender, password)

        if (!otp || !user) {
            return errorResponse(REGISTRATION_ERROR)
        }

        successResponse(res, user, OTP_SEND_TO_MAIL, 201)
    })

    login = expressAsyncHandler(async(req : Request , res : Response) => {

        const {email , password} = req.body

        const {accessToken , refreshToken , user} = await this._userService.loginUserService(email , password)

        if(!accessToken || !refreshToken || !user){
            return errorResponse(USER_LOGIN_ERROR)
        }

        res.cookie("token" , refreshToken , {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 604800000
        })

        successResponse(res , {accessToken , user} , USER_LOGIN_SUCCESSFULLY)
    })


    verifyOtp = expressAsyncHandler(async (req: Request, res: Response) => {

        const { email, otp } = req.body

        const { accessToken, refreshToken, updatedUser } = await this._userService.verifyUserOtp(email, otp)

        if (!accessToken || !refreshToken || !updatedUser) {
            return errorResponse(VERIFY_OTP_ERROR)
        }

        res.cookie("token", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 604800000
        })

        successResponse(res, { accessToken, updatedUser }, OTP_VERFIED_SUCCESSFULLY, 200)
    })

    resendOtp = expressAsyncHandler(async (req: Request, res: Response) => {

        const { email } = req.body

        const otp = await this._userService.resendOtpService(email)

        if (!otp) {
            return errorResponse(OTP_SENDING_ERROR)
        }

        successResponse(res, "", OTP_SEND_TO_MAIL)
    })

    forgotPasswordOtp = expressAsyncHandler(async (req: Request, res: Response) => {

        const { email } = req.body

        const otp = await this._userService.resendOtpService(email)

        if (!otp) {
            return errorResponse(OTP_SENDING_ERROR)
        }

        successResponse(res, "", OTP_SEND_TO_MAIL)
    })

    forgotPasswordOtpVerify = expressAsyncHandler(async (req: Request, res: Response) => {
        const { email, otp } = req.body

        const token = await this._userService.verifyForgotPasswordOtp(email, otp)

        if (!token) {
            return errorResponse(VERIFY_OTP_ERROR)
        }

        res.status(200).cookie("tempToken", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 300000
        })
        .json({
            success : true,
            message : OTP_VERFIED_SUCCESSFULLY
        })

    })

    forgotPassword = expressAsyncHandler(async (req: Request, res: Response) => {

        const { password } = req.body

        const userId = (req as any).userId

        if(!userId){
            return errorResponse(USER_NOT_FOUND , 400)
        }

        const user = await this._userService.forgotPasswordService(userId, password)

        if (!user) {
            return errorResponse(RESET_PASSWORD_ERROR)
        }

        res.clearCookie("tempToken" , {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 300000
        })

        successResponse(res, user, PASSWORD_RESET_SUCCESSFULLY)
    })

}