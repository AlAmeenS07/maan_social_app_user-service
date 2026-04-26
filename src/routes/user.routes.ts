import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/postgres/user.repository";
import { emailSchema, loginSchema, otpSchema, passwordSchema, registerSchema } from "../validations/zod.validation";
import { validate } from "../middlewares/validate.middleware";

const router = Router()

const userRepo = new UserRepository()
const userService = new UserService(userRepo)
const userController = new UserController(userService)


router.post("/auth/register" , validate(registerSchema) , userController.register)
router.post("/auth/verify-otp", validate(otpSchema) , userController.verifyOtp)
router.post("/auth/resend-otp" , validate(emailSchema) , userController.resendOtp)
router.post("/auth/forgot-password/otp" , validate(emailSchema) , userController.forgotPasswordOtp)
// router.post("/forgot-password/resend-otp" , validate(emailSchema) , userController.resendOtp)
router.post("/auth/forgot-password/verify-otp" , validate(otpSchema) , userController.forgotPasswordOtpVerify)
router.post("/auth/forgot-password" , validate(passwordSchema) , userController.forgotPassword)
router.post("/auth/login" , validate(loginSchema) , userController.login)
router.post("/auth/logout" , userController.logout)

router.get("/refresh-token" , userController.refreshToken)
router.get("/me" , userController.userData)

export default router