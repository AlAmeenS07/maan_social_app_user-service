import { Request, Response } from "express";
import { UserService } from "../services/user.service";


export class UserController {
    constructor(
        private _userService: UserService
    ) { }


    async register(req: Request, res: Response) {
        try {

            console.log(req.body)

            let { name, email, dob, gender, password } = req.body

            let { otp, user } = await this._userService.registerUser(name, email, dob, gender, password)

            res.status(201).json({
                success: true,
                message: "OTP send to you mail",
            })

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {

            let { email , otp } = req.body

            const { accessToken , refreshToken , user} = await this._userService.verifyUserOtp(email , otp)

            res.status(200).cookie("token" , refreshToken , {
                httpOnly : true,
                sameSite : "lax",
                maxAge : 604800000
            })
            .json({
                success : true,
                message : "Otp verified successfully",
                accessToken,
                user
            })

        } catch (error : any) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    async resendOtp(req : Request , res : Response) {
        try {

            let {email} = req.body

            await this._userService.resendOtpService(email)

            res.status(200).json({
                success : true,
                message : "Resend OTP send to your mail"
            })
            
        } catch (error : any) {
             res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }


}