import { Prisma, Profile } from "../../../generated/prisma/client";
import { ProfileLinkInput, ProfileLinkType, ProfileResponseType } from "../../../types/user/profile.types";
import { IBaseRepository } from "../base/base.repository.interface";


export interface IUserProfileRepository extends IBaseRepository
    <
        Profile,
        Prisma.ProfileFindUniqueArgs,
        Prisma.ProfileFindManyArgs,
        Prisma.ProfileCreateArgs,
        Prisma.ProfileUpdateArgs,
        Prisma.ProfileDeleteArgs
    > {

    createBioLinks(profileId: string, data: ProfileLinkInput[]): Promise<ProfileLinkType[]>
    updateBioLinks(profileId: string, data: ProfileLinkInput[]): Promise<ProfileLinkType[]>
    findProfileByUserId(id: string): Promise<Profile | null>
    findProfileLinks(id : string) : Promise<ProfileLinkType[]>
}