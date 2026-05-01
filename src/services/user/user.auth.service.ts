import { UserDto, userDto } from "../../dto/user/user.dto";
import { Gender, User } from "../../generated/prisma/client";
import { sendOTPEmail } from "../../helpers/email.helper";
import { deleteOTP, generateOTP, storeOTP, verifyOTP } from "../../helpers/otp.helper";
import { IUserAuthRepository } from "../../repositories/interfaces/user/user.auth.repo.interface";
import { comparePassword, hashPassword } from "../../utils/bcrypt.util";
import { INVALID_CREDENTIALS, INVALID_OTP, INVALID_USER, OTP_IS_EXPIRED, USER_ALREADY_EXIST_WITH_EMAIL, USER_BLOCKED, USER_NOT_FOUND } from "../../utils/constants";
import { generateAccessToken, generateRefreshToken, generateTempToken } from "../../utils/jwt.util";
import { errorResponse } from "../../utils/response.handler";


export class UserAuthService {
    constructor(
        private _userAuthRepo: IUserAuthRepository
    ) { }

    async registerUser(name: string, email: string, dob: string, gender: Gender, password: string): Promise<{ otp: string, user: UserDto }> {

        const userExist = await this._userAuthRepo.findByEmail(email)

        if (userExist) {
            return errorResponse(USER_ALREADY_EXIST_WITH_EMAIL, 409)
        }

        const user_name: string = email

        const hashedPassword = await hashPassword(password)

        const user = await this._userAuthRepo.createUser(name, user_name, email, hashedPassword)

        const dobDate = new Date(`${dob}T00:00:00`);

        const profile = await this._userAuthRepo.createUserProfile(user.id, dobDate, gender)

        const otp = generateOTP()

        const key: string = `otp:${user.email}`

        await sendOTPEmail(user.email, otp)

        await storeOTP(key, otp)

        const mappedUser = userDto(user)

        return {
            otp,
            user : mappedUser
        }
    }

    async loginUserService(email : string , password : string) : Promise<{accessToken : string , refreshToken : string , user : UserDto}>{

        const user = await this._userAuthRepo.findByEmail(email)

        if(!user){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        console.log("here-service-login" , user)

        if(user.is_admin){
            return errorResponse(INVALID_USER , 400)
        }

        if(user.is_blocked){
            return errorResponse(USER_BLOCKED , 400)
        }

        const checkPassword = await comparePassword(password , user.password)

        console.log("check-password" , checkPassword)

        if(!checkPassword){
            return errorResponse(INVALID_CREDENTIALS , 400)
        }

        const role = "user"

        const accessToken = generateAccessToken(user.id , role)
        const refreshToken = generateRefreshToken(user.id , role)

        const mappedUser = userDto(user)

        return {
            accessToken,
            refreshToken,
            user : mappedUser
        }
    }
    

    async verifyUserOtp(email: string, otp: string): Promise<{ accessToken: string, refreshToken: string, updatedUser: UserDto }> {

        const user = await this._userAuthRepo.findByEmail(email)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const key = `otp:${user?.email}`

        const otpResult = await verifyOTP(key, otp)

        if (otpResult == null) {
            return errorResponse(OTP_IS_EXPIRED, 400)
        }

        if (otpResult == false) {
            return errorResponse(INVALID_OTP, 400)
        }

        await deleteOTP(key)

        const updatedUser = await this._userAuthRepo.verifyUser(user.id)

        const role: string = updatedUser.is_admin == true ? "admin" : "user"

        const accessToken = generateAccessToken(updatedUser.id, role)
        const refreshToken = generateRefreshToken(updatedUser.id, role)

        const mappedUser = userDto(updatedUser)

        return {
            accessToken,
            refreshToken,
            updatedUser : mappedUser
        }
    }


    async resendOtpService(email: string) {

        const user = await this._userAuthRepo.findByEmail(email)

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

        const user = await this._userAuthRepo.findByEmail(email)

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

        const user = await this._userAuthRepo.findById(id)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const hashedPassword = await hashPassword(password)

        const updatedUser = await this._userAuthRepo.updatePassword(user.id, hashedPassword)

        const mappedUser = userDto(updatedUser)

        return mappedUser
    }

    async refreshTokenService(id : string){

        const user = await this._userAuthRepo.findById(id)

        if(!user){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        if(user.is_blocked){
            return errorResponse(USER_BLOCKED , 403)
        }

        const role = user.is_admin == true ? "admin" : "user"

        const accessToken = generateAccessToken(user.id , role)

        const mappedUser = userDto(user)

        return{
            user : mappedUser,
            accessToken
        }
    }

    async userDataService(id : string){
        
        const user = await this._userAuthRepo.findById(id)

        if(!user){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        const mappedUser = userDto(user)

        return mappedUser
    }

} 