import z, { email, string } from "zod";


export const registerSchema = z.object({
    name : z.string().min(2 , "Name must be minimum 2 letters !"),
    email : z.string().email("Invalid email !"),
    dob : z.string(),
    gender : z.enum(["male","female","other"]),
    password : z.string().min(6 , "Password must be 6 letters !")
})


export const otpSchema = z.object({
    email : z.string().email("Invalid email !"),
    otp : z.string().length(6 , "Must be enter six digit otp !").regex(/^\d+$/, "OTP must be numbers")
})


export const resendOtpSchema = z.object({
    email : z.string().email("Invalid email !")
})