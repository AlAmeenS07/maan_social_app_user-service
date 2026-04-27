import expressAsyncHandler from "express-async-handler";
import { AdminUserService } from "../../services/admin/admin.user.service";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/response.handler";
import { USER_NOT_FOUND, USER_STATUS_CHANGED_SUCCESSFULLY, USERS_FETCH_SUCCESSFULLY } from "../../utils/constants";


export class  AdminUserController {
    constructor(
        private _adminUserService : AdminUserService
    ){}

    findAllUsers = expressAsyncHandler(async(req : Request , res : Response) => {

        const users = await this._adminUserService.findAllUsersService()

        successResponse(res , users , USERS_FETCH_SUCCESSFULLY)

    })

    changeStatus = expressAsyncHandler(async(req : Request , res : Response) => {

        const { id } = req.params

        if(!id){
            return errorResponse(USER_NOT_FOUND , 404)
        }

        const user = await this._adminUserService.changeStatusService(id as string)

        successResponse(res , user , USER_STATUS_CHANGED_SUCCESSFULLY)

    })
}