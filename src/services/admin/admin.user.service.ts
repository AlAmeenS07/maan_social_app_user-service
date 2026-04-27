import { IAdminUserRepository } from "../../repositories/interfaces/admin/admin.user.repo.interface";
import { USER_NOT_FOUND } from "../../utils/constants";
import { errorResponse } from "../../utils/response.handler";


export class AdminUserService{
    constructor(
        private _adminUserRepo : IAdminUserRepository
    ){}

    async findAllUsersService(){
        const users = await this._adminUserRepo.findAll()
        return users
    }

    async changeStatusService(id : string){

        const user = await this._adminUserRepo.findById(id)

        if(!user){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        const status = user.is_blocked ? false : true

        const updatedUser = await this._adminUserRepo.findByIdAndBlockUnblock(id , status)

        return updatedUser
    }

}