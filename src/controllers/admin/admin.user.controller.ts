import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/response.handler";
import { USER_NOT_FOUND, USER_STATUS_CHANGED_SUCCESSFULLY, USERS_FETCH_SUCCESSFULLY } from "../../utils/constants";
import { FindUsersQuery } from "../../types/admin/user.type";
import { IAdminUserService } from "../../services/interfaces/admin/admin.user.service.interface";

export class AdminUserController {
    constructor(
        private _adminUserService: IAdminUserService
    ) {}

    findAllUsers = expressAsyncHandler(async (req: Request, res: Response) => {

        const { search, status, from, to, page, limit } = req.query

        const query = {
            search: search || "",
            status: status || "",
            from: from || "",
            to: to || "",
            page: Number(page) || 1,
            limit: Number(limit) || 10,
        };

        const {users , total} = await this._adminUserService.findAllUsersService(query as FindUsersQuery)

        successResponse(res, {users , totalPages : Math.ceil(total / Number(limit))}, USERS_FETCH_SUCCESSFULLY)

    })

    changeStatus = expressAsyncHandler(async (req: Request, res: Response) => {

        const { id } = req.params

        if (!id) {
            return errorResponse(USER_NOT_FOUND, 404)
        }

        const user = await this._adminUserService.changeStatusService(id as string)

        successResponse(res, user, USER_STATUS_CHANGED_SUCCESSFULLY)

    })
}