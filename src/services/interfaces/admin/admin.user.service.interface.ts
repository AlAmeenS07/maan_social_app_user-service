// interfaces/admin/admin.user.service.interface.ts

import { UserDto } from "../../../dto/user/user.dto"
import { FindUsersQuery } from "../../../types/admin/user.type"



export interface IAdminUserService {

    findAllUsersService(query: FindUsersQuery): Promise<{ users: UserDto[], total: number }>

    changeStatusService(id: string): Promise<UserDto>

}