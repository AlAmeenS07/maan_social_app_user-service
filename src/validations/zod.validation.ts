import z from "zod";


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
    email: z.string().email("Invalid email !"),
    password: z.string()
})


export const updateProfileSchema = z.object({
    name: z.string().trim().min(2, "Name must be minimum 2 letters!"),
    user_name: z.string().trim().min(3, "Username must be minimum 3 letters!").max(30, "Username cannot exceed 30 characters!").regex(/^[a-zA-Z0-9._@]+$/,"Username can only contain letters, numbers, ., _ and @"),
    gender: z.enum(["male", "female", "other"]),
    dob: z.string().refine((val) => !isNaN(new Date(val).getTime()) && new Date(val) < new Date(), { message: "DOB must be a valid date in the past" }),
    avatar: z.string().trim().optional(),
    bioHead: z.string().trim().max(50, "Bio heading must be below 50 characters!").optional(),
    bioText: z.string().trim().max(250, "Bio must be below 250 characters!").optional(),
    location: z.string().trim().optional()
});

export const profileLinksSchema = z.object({
    bioLinks: z.array(
        z.object({
            title: z.string().trim().min(1, "Title is required!"),
            url: z.string().trim().startsWith("http", "URL must start with http or https!")
        })
    )
});

export const updateProfileLinksSchema = z.object({
    bioLinks: z.array(
        z.object({
            title: z.string().trim().min(1, "Title is required!"),
            url: z.string().trim().startsWith("http", "URL must start with http or https!"),
            linkId: z.string()
        })
    )
});
