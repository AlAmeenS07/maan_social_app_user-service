import { Request, Response } from "express";
import { UserAuthService } from "../../services/user/user.auth.service";
import expressAsyncHandler from "express-async-handler";
import { errorResponse, successResponse } from "../../utils/response.handler";
import { User } from "../../generated/prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { veriftyToken } from "../../utils/jwt.util";
import { LOGIN_ERROR, LOGIN_SUCCESSFULLY, LOGOUT_SUCCESSSFULLY, OTP_SEND_TO_MAIL, OTP_SENDING_ERROR, OTP_VERFIED_SUCCESSFULLY, PASSWORD_RESET_SUCCESSFULLY, REGISTRATION_ERROR, RESET_PASSWORD_ERROR, USER_DATA_FETCH, USER_FETCH_ERROR, USER_NOT_FOUND, VERIFY_OTP_ERROR, TOKEN_MISSING } from "../../utils/constants";


export class UserAuthController {
    constructor(
        private _userService: UserAuthService
    ) { }


    register = expressAsyncHandler(async (req: Request, res: Response) => {

        const { name, email, dob, gender, password } = req.body

        const { otp, user } = await this._userService.registerUser(name, email, dob, gender, password)

        if (!otp || !user) {
            return errorResponse(REGISTRATION_ERROR)
        }

        successResponse(res, user, OTP_SEND_TO_MAIL, 201)
    })

    login = expressAsyncHandler(async (req: Request, res: Response) => {

        const { email, password } = req.body

        console.log("controller" , req.body)

        const { accessToken, refreshToken, user } = await this._userService.loginUserService(email, password)

        if (!accessToken || !refreshToken || !user) {
            return errorResponse(LOGIN_ERROR)
        }

        res.cookie("token", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 604800000
        })

        successResponse(res, { accessToken, user }, LOGIN_SUCCESSFULLY)
    })

    logout = expressAsyncHandler(async (req: Request, res: Response) => {

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 604800000
        })

        successResponse(res, "", LOGOUT_SUCCESSSFULLY)

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
                success: true,
                message: OTP_VERFIED_SUCCESSFULLY
            })

    })

    forgotPassword = expressAsyncHandler(async (req: Request, res: Response) => {

        console.log(req.body, req.headers)

        const { password } = req.body

        const userId = (req as any).headers["x-user-id"]

        if (!userId) {
            return errorResponse(USER_NOT_FOUND, 400)
        }

        const user = await this._userService.forgotPasswordService(userId, password)

        if (!user) {
            return errorResponse(RESET_PASSWORD_ERROR)
        }

        res.clearCookie("tempToken", {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 300000
        })

        successResponse(res, user, PASSWORD_RESET_SUCCESSFULLY)
    })


    refreshToken = expressAsyncHandler(async (req: Request, res: Response) => {

        const { token } = req.cookies;

        if (!token) {
            return errorResponse(TOKEN_MISSING, 401)
        }

        const decoded = veriftyToken(token) as JwtPayload;

        const { user, accessToken } = await this._userService.refreshTokenService(decoded.userId)

        if (!user || !accessToken) {
            return errorResponse(USER_FETCH_ERROR, 401)
        }

        successResponse(res, { user, accessToken })
    })


    userData = expressAsyncHandler(async (req: Request, res: Response) => {

        const userId = req.headers["x-user-id"]

        if (!userId) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const user = await this._userService.userDataService(userId as string)

        successResponse(res, user, USER_DATA_FETCH)

    })

}