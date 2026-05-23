import expressAsyncHandler from "express-async-handler";
import { IUserProfileService } from "../../services/interfaces/user/user.profile.service.interface";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/response.handler";
import { INVALID_PROFILE_LINKS, LINK_DELETED, LINK_NOT_FOUND, PROFILE_FETCHED_SUCCESSFULLY, PROFILE_LINKS_ADDED_SUCCESSFULLY, PROFILE_UPDATED_SUCCESSFULLY, statusCodes, USER_NAME_CHECKED_SUCCESSFULLY, USER_NAME_MISSING, USER_NOT_FOUND } from "../../utils/constants";



export class UserProfileController {
    constructor(
        private _userProfile: IUserProfileService
    ) { }


    getProfile = expressAsyncHandler(async (req: Request, res: Response) => {

        const userId = req.headers["x-user-id"]

        if (!userId) {
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        const profile = await this._userProfile.fetchUserProfile(userId as string)

        successResponse(res, profile, PROFILE_FETCHED_SUCCESSFULLY)

    })

    updateProfile = expressAsyncHandler(async (req: Request, res: Response) => {

        const { id } = req.params

        if (!id) {
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        const updateProfile = await this._userProfile.updateProfileService(id as string, req.body)

        successResponse(res, updateProfile, PROFILE_UPDATED_SUCCESSFULLY)

    })

    addProfileLinks = expressAsyncHandler(async (req: Request, res: Response) => {

        const { bioLinks } = req.body
        const userId = req.headers["x-user-id"]

        if (!userId) {
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        for (const v of bioLinks) {
            if (!v?.url?.startsWith("http")) {
                return errorResponse(INVALID_PROFILE_LINKS, statusCodes.BAD_REQUEST)
            }
        }

        const profileLinks = await this._userProfile.addBioLinks(userId as string, bioLinks)

        successResponse(res, profileLinks, PROFILE_LINKS_ADDED_SUCCESSFULLY, statusCodes.CREATED)
    })

    editProfileLinks = expressAsyncHandler(async (req: Request, res: Response) => {

        const userId = req.headers["x-user-id"]

        const { bioLinks } = req.body

        if (!userId) {
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        const updatedProfileLinks = await this._userProfile.editBioLinks(userId as string, bioLinks)

        successResponse(res, updatedProfileLinks, PROFILE_UPDATED_SUCCESSFULLY)
    })

    deleteProfileLink = expressAsyncHandler(async (req: Request, res: Response) => {

        const userId = req.headers["x-user-id"]

        if(!userId){
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        const linkId = req.params.id

        console.log("controller-link-delete", linkId)

        if (!linkId) {
            return errorResponse(LINK_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        await this._userProfile.deleteBioLink(userId as string , linkId as string)

        successResponse(res, "", LINK_DELETED)
    })

    checkUserName = expressAsyncHandler(async (req: Request, res: Response) => {

        const { user_name } = req.body
        const userId = req.headers["x-user-id"]

        if (!userId) {
            return errorResponse(USER_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        if (!user_name) {
            return errorResponse(USER_NAME_MISSING, statusCodes.BAD_REQUEST)
        }

        const result = await this._userProfile.chechUserName(userId as string, user_name)

        successResponse(res, result, USER_NAME_CHECKED_SUCCESSFULLY)

    })

}