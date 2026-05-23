import { UserDto, userDtoFun } from "../../dto/user/user.dto";
import { sendOTPEmail } from "../../helpers/email.helper";
import { deleteOTP, generateOTP, storeOTP, verifyOTP } from "../../helpers/otp.helper";
import { publishUserSyncEvent } from "../../kafka/producers/user.sync.producer";
import { IUserAuthRepository } from "../../repositories/interfaces/user/user.auth.repo.interface";
import { Gender } from "../../types/user/user.type";
import { comparePassword, hashPassword } from "../../utils/bcrypt.util";
import { INVALID_CREDENTIALS, INVALID_OTP, INVALID_USER, OTP_IS_EXPIRED, statusCodes, USER_ALREADY_EXIST_WITH_EMAIL, USER_BLOCKED, USER_NOT_FOUND } from "../../utils/constants";
import { generateAccessToken, generateRefreshToken, generateTempToken } from "../../utils/jwt.util";
import { errorResponse } from "../../utils/response.handler";
import { IUserAuthService } from "../interfaces/user/user.auth.service.interface";


export class UserAuthService implements IUserAuthService {
    constructor(
        private _userAuthRepo: IUserAuthRepository
    ) { }

    async registerUser(name: string, email: string, dob: string, gender: Gender, password: string): Promise<{ otp: string, user: UserDto }> {

        const userExist = await this._userAuthRepo.findByEmail(email)

        if (userExist) {
            return errorResponse(USER_ALREADY_EXIST_WITH_EMAIL, statusCodes.CONFLICT)
        }

        const user_name: string = email.split("@")[0] + email.split("@")[1]

        const hashedPassword = await hashPassword(password)

        const user = await this._userAuthRepo.create({data : {name, user_name, email, password : hashedPassword}})

        const dobDate = new Date(`${dob}T00:00:00`);

        await this._userAuthRepo.createUserProfile(user.id, dobDate, gender)

        const otp = generateOTP()

        const key: string = `otp:${user.email}`

        await sendOTPEmail(user.email, otp)

        await storeOTP(key, otp)

        const mappedUser = userDtoFun(user)

        await publishUserSyncEvent(user.id)

        return {
            otp,
            user : mappedUser
        }
    }

    async loginUserService(email : string , password : string) : Promise<{accessToken : string , refreshToken : string , user : UserDto}>{

        const user = await this._userAuthRepo.findByEmail(email)

        if(!user){
            return errorResponse(USER_NOT_FOUND , statusCodes.BAD_REQUEST)
        }

        if(user.is_admin){
            return errorResponse(INVALID_USER , statusCodes.BAD_REQUEST)
        }

        if(user.is_blocked){
            return errorResponse(USER_BLOCKED , statusCodes.BAD_REQUEST)
        }

        const checkPassword = await comparePassword(password , user.password)

        if(!checkPassword){
            return errorResponse(INVALID_CREDENTIALS , statusCodes.BAD_REQUEST)
        }

        const role = "user"

        const accessToken = generateAccessToken(user.id , role)
        const refreshToken = generateRefreshToken(user.id , role)

        const mappedUser = userDtoFun(user)

        return {
            accessToken,
            refreshToken,
            user : mappedUser
        }
    }
    

    async verifyUserOtp(email: string, otp: string): Promise<{ accessToken: string, refreshToken: string, updatedUser: UserDto }> {

        const user = await this._userAuthRepo.findByEmail(email)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        const key = `otp:${user?.email}`

        const otpResult = await verifyOTP(key, otp)

        if (otpResult == null) {
            return errorResponse(OTP_IS_EXPIRED, statusCodes.BAD_REQUEST)
        }

        if (otpResult == false) {
            return errorResponse(INVALID_OTP, statusCodes.BAD_REQUEST)
        }

        await deleteOTP(key)

        const updatedUser = await this._userAuthRepo.update({
            data: {
                is_verified: true
            },
            where: {
                id : user.id
            }
        })

        const role: string = updatedUser.is_admin == true ? "admin" : "user"

        const accessToken = generateAccessToken(updatedUser.id, role)
        const refreshToken = generateRefreshToken(updatedUser.id, role)

        const mappedUser = userDtoFun(updatedUser)

        await publishUserSyncEvent(updatedUser.id)

        return {
            accessToken,
            refreshToken,
            updatedUser : mappedUser
        }
    }


    async resendOtpService(email: string) {

        const user = await this._userAuthRepo.findByEmail(email)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
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
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        const key = `otp:${user?.email}`

        const otpResult = await verifyOTP(key, otp)

        if (otpResult == null) {
            return errorResponse(OTP_IS_EXPIRED, statusCodes.BAD_REQUEST)
        }

        if (otpResult == false) {
            return errorResponse(INVALID_OTP, statusCodes.BAD_REQUEST)
        }

        await deleteOTP(key)

        const role: string = user.is_admin == true ? "admin" : "user"

        const tempToken = generateTempToken(user.id, role)

        return tempToken
    }

    async forgotPasswordService(id: string, password: string) {

        const user = await this._userAuthRepo.findById({where : {id}})

        if (!user) {
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        const hashedPassword = await hashPassword(password)

        const updatedUser = await this._userAuthRepo.updatePassword(user.id, hashedPassword)

        const mappedUser = userDtoFun(updatedUser)

        await publishUserSyncEvent(updatedUser.id)

        return mappedUser
    }

    async refreshTokenService(id : string){

        const user = await this._userAuthRepo.findById({where : {id}})

        if(!user){
            return errorResponse(USER_NOT_FOUND , statusCodes.NOT_FOUND)
        }

        if(user.is_blocked){
            return errorResponse(USER_BLOCKED , statusCodes.FORBIDDEN)
        }

        const role = user.is_admin == true ? "admin" : "user"

        const accessToken = generateAccessToken(user.id , role)

        const mappedUser = userDtoFun(user)

        return{
            user : mappedUser,
            accessToken
        }
    }

    async userDataService(id : string){
        
        const user = await this._userAuthRepo.findById({where : {id}})

        if(!user){
            return errorResponse(USER_NOT_FOUND , statusCodes.NOT_FOUND)
        }

        const mappedUser = userDtoFun(user)

        return mappedUser
    }

} 