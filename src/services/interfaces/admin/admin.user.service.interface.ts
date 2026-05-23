// interfaces/admin/admin.user.service.interface.ts

import { UserDto } from "../../../dto/user/user.dto"
import { FindUsersQuery } from "../../../types/admin/user.type"
import { ProfileResponseType } from "../../../types/user/profile.types"



export interface IAdminUserService {
    findAllUsersService(query: FindUsersQuery): Promise<{ users: UserDto[], total: number }>
    changeStatusService(id: string): Promise<UserDto>
    fetchUserProfile(id : string) : Promise<ProfileResponseType>
}