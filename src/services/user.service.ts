import { Gender, User } from "../generated/prisma/client";
import { sendOTPEmail } from "../helpers/email.helper";
import { deleteOTP, generateOTP, storeOTP, verifyOTP } from "../helpers/otp.helper";
import { IUserRepository } from "../repositories/interfaces/user.repo.interface";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { INVALID_CREDENTIALS, INVALID_OTP, OTP_IS_EXPIRED, USER_ALREADY_EXIST_WITH_EMAIL, USER_NOT_FOUND } from "../utils/constants";
import { generateAccessToken, generateRefreshToken, generateTempToken } from "../utils/jwt.util";
import { errorResponse } from "../utils/response.handler";


export class UserService {
    constructor(
        private _userRepo: IUserRepository
    ) { }

    async registerUser(name: string, email: string, dob: string, gender: Gender, password: string): Promise<{ otp: string, user: User }> {

        const userExist = await this._userRepo.findByEmail(email)

        if (userExist) {
            return errorResponse(USER_ALREADY_EXIST_WITH_EMAIL, 409)
        }

        const user_name: string = email

        const hashedPassword = await hashPassword(password)

        const user = await this._userRepo.createUser(name, user_name, email, hashedPassword)

        const dobDate = new Date(`${dob}T00:00:00`);

        const profile = await this._userRepo.createUserProfile(user.id, dobDate, gender)

        const otp = generateOTP()

        const key: string = `otp:${user.email}`

        await sendOTPEmail(user.email, otp)

        await storeOTP(key, otp)

        return {
            otp,
            user
        }
    }

    async loginUserService(email : string , password : string) : Promise<{accessToken : string , refreshToken : string , user : User}>{

        const user = await this._userRepo.findByEmail(email)

        if(!user){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        const checkPassword = await comparePassword(password , user.password)

        if(!checkPassword){
            return errorResponse(INVALID_CREDENTIALS , 409)
        }

        const role = user.is_admin == true ? "admin" : "user"

        const accessToken = generateAccessToken(user.id , role)
        const refreshToken = generateRefreshToken(user.id , role)

        return {
            accessToken,
            refreshToken,
            user
        }
    }

    async verifyUserOtp(email: string, otp: string): Promise<{ accessToken: string, refreshToken: string, updatedUser: User }> {

        const user = await this._userRepo.findByEmail(email)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const key = `otp:${user?.email}`

        const otpResult = await verifyOTP(key, otp)

        if (otpResult == null) {
            return errorResponse(OTP_IS_EXPIRED, 408)
        }

        if (otpResult == false) {
            return errorResponse(INVALID_OTP, 400)
        }

        await deleteOTP(key)

        const updatedUser = await this._userRepo.verifyUser(user.id)

        const role: string = updatedUser.is_admin == true ? "admin" : "user"

        const accessToken = generateAccessToken(updatedUser.id, role)
        const refreshToken = generateRefreshToken(updatedUser.id, role)

        return {
            accessToken,
            refreshToken,
            updatedUser
        }
    }


    async resendOtpService(email: string) {

        const user = await this._userRepo.findByEmail(email)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const otp = generateOTP()

        const key = `otp:${user.email}`

        await sendOTPEmail(user.email, otp)

        await storeOTP(key, otp)

        return otp
    }

    async verifyForgotPasswordOtp(email: string, otp: string) {

        const user = await this._userRepo.findByEmail(email)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const key = `otp:${user?.email}`

        const otpResult = await verifyOTP(key, otp)

        if (otpResult == null) {
            return errorResponse(OTP_IS_EXPIRED, 408)
        }

        if (otpResult == false) {
            return errorResponse(INVALID_OTP, 400)
        }

        await deleteOTP(key)

        const role: string = user.is_admin == true ? "admin" : "user"

        const tempToken = generateTempToken(user.id, role)

        return tempToken
    }

    async forgotPasswordService(id: string, password: string) {

        const user = await this._userRepo.findById(id)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const hashedPassword = await hashPassword(password)

        const updatedUser = await this._userRepo.updatePassword(user.id, hashedPassword)

        return updatedUser
    }

    async refreshTokenService(id : string){

        const user = await this._userRepo.findById(id)

        if(!user){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        const role = user.is_admin == true ? "admin" : "user"

        const accessToken = generateAccessToken(user.id , role)

        return{
            user,
            accessToken
        }
    }

    async userDataService(id : string){
        
        const user = await this._userRepo.findById(id)

        if(!user){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        return user
    }

} 