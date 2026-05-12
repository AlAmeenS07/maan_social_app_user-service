// src/interfaces/user/user.auth.service.interface.ts

import { UserDto } from "../../../dto/user/user.dto"
import { Gender } from "../../../types/user/user.type"



export interface IUserAuthService {
    registerUser(name: string, email: string, dob: string, gender: Gender, password: string): Promise<{ otp: string, user: UserDto }>

    loginUserService(email: string, password: string): Promise<{ accessToken: string, refreshToken: string, user: UserDto }>

    verifyUserOtp(email: string, otp: string): Promise<{ accessToken: string, refreshToken: string, updatedUser: UserDto }>

    resendOtpService(email: string): Promise<string>

    verifyForgotPasswordOtp(email: string, otp: string): Promise<string>

    forgotPasswordService(id: string, password: string): Promise<UserDto>

    refreshTokenService(id: string): Promise<{ user: UserDto, accessToken: string }>

    userDataService(id: string): Promise<UserDto>
}