import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema } from "../../validations/zod.validation";
import { AdminAuthService } from "../../services/admin/admin.auth.service";
import { AdminAuthController } from "../../controllers/admin/admin.auth.controller";
import { AdminAuthRepository } from "../../repositories/postgres/admin/admin.auth.repository";
import { AdminUserService } from "../../services/admin/admin.user.service";
import { AdminUserRepository } from "../../repositories/postgres/admin/admin.user.repository";
import { AdminUserController } from "../../controllers/admin/admin.user.controller";


const router = Router()

const adminAuthRepo = new AdminAuthRepository()
const adminAuthService = new AdminAuthService(adminAuthRepo)
const adminAuthController = new AdminAuthController(adminAuthService)

const adminUserRepo = new AdminUserRepository()
const adminUserService = new AdminUserService(adminUserRepo)
const adminUserController = new AdminUserController(adminUserService)


router.post("/auth/login" , validate(loginSchema) , adminAuthController.loginAdmin)
router.post("/auth/logout" , adminAuthController.logoutAdmin)

router.get("/users" , adminUserController.findAllUsers)
router.patch("/users/:id" , adminUserController.changeStatus)


export default router