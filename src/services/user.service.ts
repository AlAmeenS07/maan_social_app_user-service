import { Gender, User } from "../generated/prisma/client";
import { sendOTPEmail } from "../helpers/email.helper";
import { deleteOTP, generateOTP, storeOTP, verifyOTP } from "../helpers/otp.helper";
import { IUserRepository } from "../repositories/interfaces/user.repo.interface";
import { hashPassword } from "../utils/bcrypt.util";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.util";


export class UserService{
    constructor(
        private _userRepo : IUserRepository
    ){}

    async registerUser(name : string , email : string , dob : string , gender : Gender , password : string) : Promise<{otp : string , user : User}>{

        const userExist = await this._userRepo.findByEmail(email)

        if(userExist){
            throw new Error("User exists with email");
        }

        const user_name : string = `${name}_${Date.now()}`

        const hashedPassword = await hashPassword(password)

        const user = await this._userRepo.createUser(name , user_name , email , hashedPassword)

        await this._userRepo.createUserProfile(user.id , dob , gender)

        const otp = generateOTP()

        const key : string = `otp:${user.email}`

        await sendOTPEmail(user.email , otp)

        await storeOTP(key , otp)

        return {
            otp,
            user
        }
    }

    async verifyUserOtp(email : string , otp : string) : Promise<{accessToken : string , refreshToken : string , user : User}>{

        let user = await this._userRepo.findByEmail(email)

        if(!user){
            throw new Error("User not found !");
        }

        const key = `otp:${user.email}`

        const otpResult = await verifyOTP(key, otp)

        if(otpResult == null){
            throw new Error("OTP is expired !");
        }

        if(otpResult == false){
            throw new Error("Invalid OTP !");
        }

        await deleteOTP(key)

        user = await this._userRepo.verifyUser(user.id)

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        return {
            accessToken,
            refreshToken,
            user
        }
    }


    async resendOtpService(email : string) {

        let user = await this._userRepo.findByEmail(email)

        if(!user){
            throw new Error("User not found !");
        }

        const otp = generateOTP()

        const key = `otp:${user.email}`

        await sendOTPEmail(user.email , otp)

        await storeOTP(key , otp)

    }


}