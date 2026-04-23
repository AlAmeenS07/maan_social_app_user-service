import z, { email, string } from "zod";


export const registerSchema = z.object({
    name: z.string().min(2, "Name must be minimum 2 letters !"),
    email: z.string().email("Invalid email !"),
    dob: z.string().refine((val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !isNaN(date.getTime()) && date < today;
    }, {
        message: "DOB must be a valid date in the past",
    }),
    gender: z.enum(["male", "female", "other"]),
    password: z.string().min(6, "Password must be 6 letters !")
})

export const otpSchema = z.object({
    email: z.string().email("Invalid email !"),
    otp: z.string().length(6, "Must be enter six digit otp !").regex(/^\d+$/, "OTP must be numbers")
})

export const emailSchema = z.object({
    email: z.string().email("Invalid email !")
})

export const passwordSchema = z.object({
    password: z.string().min(6, "Password must be 6 letters !")
})

export const loginSchema = z.object({
    email : z.string().email("Invalid email !"),
    password : z.string()
})