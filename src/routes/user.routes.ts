import { Router } from "express";
import { UserAuthController } from "../controllers/user/user.auth.controller";
import { UserAuthService } from "../services/user/user.auth.service";
import { UserAuthRepository } from "../repositories/postgres/user/user.auth.repository";
import { emailSchema, loginSchema, otpSchema, passwordSchema, registerSchema } from "../validations/zod.validation";
import { validate } from "../middlewares/validate.middleware";

const router = Router()

const userRepo = new UserAuthRepository()
const userService = new UserAuthService(userRepo)
const userController = new UserAuthController(userService)


router.post("/auth/register" , validate(registerSchema) , userController.register)
router.post("/auth/verify-otp", validate(otpSchema) , userController.verifyOtp)
router.post("/auth/resend-otp" , validate(emailSchema) , userController.resendOtp)
router.post("/auth/forgot-password/otp" , validate(emailSchema) , userController.forgotPasswordOtp)
router.post("/auth/forgot-password/verify-otp" , validate(otpSchema) , userController.forgotPasswordOtpVerify)
router.post("/auth/forgot-password" , validate(passwordSchema) , userController.forgotPassword)
router.post("/auth/login" , validate(loginSchema) , userController.login)
router.post("/auth/logout" , userController.logout)

router.get("/refresh-token" , userController.refreshToken)
router.get("/me" , userController.userData)

export default router