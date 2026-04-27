import { IAdminAuthRepository } from "../../repositories/interfaces/admin/admin.auth.repo.interface";
import { IUserAuthRepository } from "../../repositories/interfaces/user/user.auth.repo.interface";
import { comparePassword } from "../../utils/bcrypt.util";
import { INVALID_CREDENTIALS, INVALID_USER, USER_NOT_FOUND } from "../../utils/constants";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.util";
import { errorResponse } from "../../utils/response.handler";


export class AdminAuthService{
    constructor(
        private _adminRepo : IAdminAuthRepository
    ){}


    async adminLoginService(email : string , password : string) {

        const user = await this._adminRepo.findByEmail(email)

        if(!user){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        if(!user.is_admin){
            return errorResponse(INVALID_USER , 403)
        }

        const checkPassword = await comparePassword(password , user.password)

        if(!checkPassword){
            return errorResponse(INVALID_CREDENTIALS , 400)
        }

        const role = user.is_admin ? "admin" : "user"

        const accessToken = generateAccessToken(user.id , role)
        const refreshToken = generateRefreshToken(user.id , role)

        return {
            user,
            accessToken,
            refreshToken
        }

    }
}