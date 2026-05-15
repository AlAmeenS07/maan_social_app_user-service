import prisma from "../../db/prisma.client";
import { profileDtoFun, ProfileLinkDto, profileLinkDtoFun } from "../../dto/user/profile.dto";
import { userDtoFun } from "../../dto/user/user.dto";
import { IUserAuthRepository } from "../../repositories/interfaces/user/user.auth.repo.interface";
import { IUserProfileRepository } from "../../repositories/interfaces/user/user.profile.repo.interface";
import { ProfileLinkInput, ProfileLinkType, ProfileResponseType, ProfileUpdateType } from "../../types/user/profile.types";
import { User } from "../../types/user/user.type";
import { LINK_NOT_FOUND, PROFILE_NOT_FOUND, statusCodes, USER_ALREADY_EXIST_WITH_USER_NAME, USER_NOT_FOUND } from "../../utils/constants";
import { errorResponse } from "../../utils/response.handler";
import { IUserProfileService } from "../interfaces/user/user.profile.service.interface";



export class UserProfileService implements IUserProfileService{
    constructor(
        private _userRepo : IUserAuthRepository,
        private _userProfileRepo : IUserProfileRepository
    ){
    
    }


    async fetchUserProfile(id: string): Promise<ProfileResponseType> {
        
        const user = await this._userRepo.findById({where : {id}})

        if(!user){
            return errorResponse(USER_NOT_FOUND , statusCodes.NOT_FOUND)
        }

        const profile = await this._userProfileRepo.findProfileByUserId(id)

        if(!profile){
            return errorResponse(PROFILE_NOT_FOUND, statusCodes.NOT_FOUND)
        }

        const profileLinks = await this._userProfileRepo.findProfileLinks(profile.id)

        return {
            user : userDtoFun(user),
            profile : profileDtoFun(profile),
            profileLinks : profileLinkDtoFun(profileLinks)
        }

    }

    async updateProfileService(userId: string, data: ProfileUpdateType): Promise<ProfileResponseType> {
        
        const { name , user_name , gender, dob , avatar = '' , bioHead = '' , bioText = '' , location = '' } = data

        const dobDate = new Date(`${dob}T00:00:00`);
        
        const profile = await this._userProfileRepo.findProfileByUserId(userId)

        if(!profile){
            return errorResponse(PROFILE_NOT_FOUND , statusCodes.NOT_FOUND)
        }

        const userNameUser = await this._userRepo.findByUserName(user_name as string)

        if(userNameUser){
            return errorResponse(USER_ALREADY_EXIST_WITH_USER_NAME , statusCodes.CONFLICT)
        }

        const updatedUser = await this._userRepo.update({data : {name , user_name} , where : {id : userId}})

        const updateProfile = await this._userProfileRepo.update({data : {gender, dob : dobDate , bioHead, bioText, avatar , location} , where: {id : profile?.id}})

        const profileLinks = await this._userProfileRepo.findProfileLinks(profile.id)

        const dtoUser = userDtoFun(updatedUser)
        const dtoProfile = profileDtoFun(updateProfile)
        const dtoProfileLinks = profileLinkDtoFun(profileLinks)

        return {
            user : dtoUser,
            profile : dtoProfile,
            profileLinks : dtoProfileLinks
        }
    }


    async chechUserName(user_name: string): Promise<boolean> {

        const user = await this._userRepo.findByUserName(user_name)
        
        if(user){
            return false
        }
        else{
            return true
        }
    }

    async addBioLinks(userId : string, data: ProfileLinkInput[]): Promise<ProfileLinkDto[]> {

        const profile = await this._userProfileRepo.findProfileByUserId(userId)

        if(!profile){
            return errorResponse(PROFILE_NOT_FOUND , statusCodes.NOT_FOUND)
        }

        const profileLinks = await this._userProfileRepo.createBioLinks(profile.id , data)

        return profileLinkDtoFun(profileLinks)

    }

    async editBioLinks(userId : string , data : ProfileLinkInput[]) : Promise<ProfileLinkDto[]> {

        const profile = await this._userProfileRepo.findProfileByUserId(userId)

        if(!profile){
            return errorResponse(PROFILE_NOT_FOUND , statusCodes.NOT_FOUND)
        }

        const updatedProfileLinks = await this._userProfileRepo.updateBioLinks(profile.id , data)

        return profileLinkDtoFun(updatedProfileLinks)
    }

    async deleteBioLink(linkId: string): Promise<void> {
        
        const link = await this._userProfileRepo.findProfileLinkById(linkId)

        if(!link){
            return errorResponse(LINK_NOT_FOUND , statusCodes.NOT_FOUND)
        }

        await this._userProfileRepo.deleteProfileLinkById(linkId)
    }

}