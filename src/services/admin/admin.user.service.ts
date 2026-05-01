import { userDto } from "../../dto/user/user.dto";
import { IAdminUserRepository } from "../../repositories/interfaces/admin/admin.user.repo.interface";
import { USER_NOT_FOUND } from "../../utils/constants";
import { errorResponse } from "../../utils/response.handler";


export class AdminUserService {
    constructor(
        private _adminUserRepo: IAdminUserRepository
    ) { }

    async findAllUsersService(query: any) {

        const { search, status, from, to, page, limit } = query;

        const filter: any = {
            is_admin: false,
        };

        if (search) {
            filter.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { user_name : {contains : search , mode : "insensitive"}}
            ];
        }

        if (status === "active") {
            filter.is_blocked = false;
        }

        if (status === "blocked") {
            filter.is_blocked = true;
        }

        if (from && to) {
            filter.createdAt = {
                gte: new Date(from),
                lte: new Date(to),
            };
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this._adminUserRepo.findAll(filter, skip, limit),
            this._adminUserRepo.count(filter),
        ]);

        const updatedUsers = users?.map((user)=>{
            return userDto(user)
        })

        return {
            users : updatedUsers,
            total
        }

    }

    async changeStatusService(id: string) {

        const user = await this._adminUserRepo.findById(id)

        if (!user) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const status = user.is_blocked ? false : true

        const updatedUser = await this._adminUserRepo.findByIdAndBlockUnblock(id, status)

        if(!updatedUser){
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const mappedUser = userDto(updatedUser)

        return mappedUser
    }

}