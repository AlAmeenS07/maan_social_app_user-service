import { ProfileLinkDto } from "../../../dto/user/profile.dto";
import { ProfileLinkInput, ProfileLinkType, ProfileResponseType, ProfileUpdateType } from "../../../types/user/profile.types";


export interface IUserProfileService {

    fetchUserProfile(id : string) : Promise<ProfileResponseType>

    updateProfileService(userId: string, data : ProfileUpdateType) : Promise<ProfileResponseType>

    chechUserName(user_name : string) : Promise<boolean>

    addBioLinks(userId : string, data : ProfileLinkInput[]) : Promise<ProfileLinkDto[]>

    editBioLinks(userId : string, data : ProfileLinkInput[]) : Promise<ProfileLinkDto[]>

    deleteBioLink(linkId : string) : Promise<void>

}