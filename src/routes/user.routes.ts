import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/postgres/user.repository";
import { emailSchema, loginSchema, otpSchema, passwordSchema, registerSchema } from "../validations/zod.validation";
import { validate } from "../middlewares/validate.middleware";
import { tempTokenCheck } from "../middlewares/temp.token.check";

const router = Router()

const userRepo = new UserRepository()
const userService = new UserService(userRepo)
const userController = new UserController(userService)


router.post("/register" , validate(registerSchema) , userController.register)
router.post("/verify-otp", validate(otpSchema) , userController.verifyOtp)
router.post("/resend-otp" , validate(emailSchema) , userController.resendOtp)
router.post("/forgot-password/otp" , validate(emailSchema) , userController.forgotPasswordOtp)
router.post("/forgot-password/resend-otp" , validate(emailSchema) , userController.resendOtp)
router.post("/forgot-password/verify-otp" , validate(otpSchema) , userController.forgotPasswordOtpVerify)
router.post("/forgot-password" , tempTokenCheck , validate(passwordSchema) , userController.forgotPassword)
router.post("/login" , validate(loginSchema) , userController.login)

export default router