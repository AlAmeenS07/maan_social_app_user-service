import { userDtoFun } from "../../dto/user/user.dto";
import { IAdminAuthRepository } from "../../repositories/interfaces/admin/admin.auth.repo.interface";
import { comparePassword } from "../../utils/bcrypt.util";
import { INVALID_CREDENTIALS, INVALID_USER, statusCodes, USER_NOT_FOUND } from "../../utils/constants";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.util";
import { errorResponse } from "../../utils/response.handler";
import { IAdminAuthService } from "../interfaces/admin/admin.auth.service.interface";


export class AdminAuthService implements IAdminAuthService {
    constructor(
        private _adminRepo : IAdminAuthRepository
    ){}


    async adminLoginService(email : string , password : string) {

        const user = await this._adminRepo.findByEmail(email)

        if(!user){
            return errorResponse(USER_NOT_FOUND , statusCodes.BAD_REQUEST)
        }

        if(!user.is_admin){
            return errorResponse(INVALID_USER , statusCodes.FORBIDDEN)
        }

        const checkPassword = await comparePassword(password , user.password)

        if(!checkPassword){
            return errorResponse(INVALID_CREDENTIALS , statusCodes.BAD_REQUEST)
        }

        const role = user.is_admin ? "admin" : "user"

        const accessToken = generateAccessToken(user.id , role)
        const refreshToken = generateRefreshToken(user.id , role)

        const mappedUser = userDtoFun(user)

        return {
            user : mappedUser,
            accessToken,
            refreshToken
        }
    }
}