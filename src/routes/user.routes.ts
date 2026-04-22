import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/postgres/user.repository";
import { otpSchema, registerSchema, resendOtpSchema } from "../validations/zod.validation";
import { validate } from "../middlewares/validate.middleware";

const router = Router()

const userRepo = new UserRepository()
const userService = new UserService(userRepo)
const userController = new UserController(userService)


router.post("/register" , validate(registerSchema) , userController.register)
router.post("/verify-otp", validate(otpSchema) , userController.verifyOtp)
router.post("/resend-otp" , validate(resendOtpSchema) , userController.resendOtp)


export default router