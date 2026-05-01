import { Request, Response } from "express";
import { AdminAuthService } from "../../services/admin/admin.auth.service";
import expressAsyncHandler from "express-async-handler";
import { errorResponse, successResponse } from "../../utils/response.handler";
import { LOGIN_ERROR, LOGIN_SUCCESSFULLY, LOGOUT_SUCCESSSFULLY } from "../../utils/constants";



export class AdminAuthController {
    constructor(
        private _adminAuthService: AdminAuthService
    ) {}

    loginAdmin = expressAsyncHandler(async (req: Request, res: Response) => {

        const { email, password } = req.body

        const { user, accessToken, refreshToken } = await this._adminAuthService.adminLoginService(email, password)

        if (!user || !accessToken || !refreshToken) {
            return errorResponse(LOGIN_ERROR)
        }

        res.cookie("token", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 604800000
        })

        successResponse(res, { user, accessToken }, LOGIN_SUCCESSFULLY)

    })

    logoutAdmin = expressAsyncHandler(async (req: Request, res: Response) => {

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 604800000
        })

        successResponse(res, "", LOGOUT_SUCCESSSFULLY)

    })


}