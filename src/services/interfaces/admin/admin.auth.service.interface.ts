// interfaces/admin/admin.auth.service.interface.ts

import { UserDto } from "../../../dto/user/user.dto"


export interface IAdminAuthService {

    adminLoginService(email: string, password: string): Promise<{ user: UserDto, accessToken: string, refreshToken: string }>

}