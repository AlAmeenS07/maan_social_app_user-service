import prisma from "../../../db/prisma.client";
import { Prisma, Profile } from "../../../generated/prisma/client";
import { ProfileLinkInput, ProfileLinkType } from "../../../types/user/profile.types";
import { IUserProfileRepository } from "../../interfaces/user/user.profile.repo.interface";
import { BaseRepository } from "../base/base.repository";


export class UserProfileRepository extends BaseRepository
    <
        Profile,
        Prisma.ProfileFindUniqueArgs,
        Prisma.ProfileFindManyArgs,
        Prisma.ProfileCreateArgs,
        Prisma.ProfileUpdateArgs,
        Prisma.ProfileDeleteArgs
    > implements IUserProfileRepository {

    constructor(){
        super(prisma.profile)
    }


    async createBioLinks(profileId : string , data: ProfileLinkInput[]): Promise<ProfileLinkType[]> {
        const bioLinks = await Promise.all(
            data.map((d) => {
                return prisma.profileLink.create({
                    data: {
                        profileId : profileId,
                        title : d.title,
                        url : d.url
                    }
                })
            })
        )
        return bioLinks
    }

    async updateBioLinks(profileId: string, data: ProfileLinkInput[]): Promise<ProfileLinkType[]> {
        const bioLinks = await Promise.all(
            data.map((d) => {
                return prisma.profileLink.update({
                    data : {
                        title : d.title,
                        url : d.url
                    },
                    where : {
                        id : d.linkId,
                        profileId
                    }
                })
            })
        )
        return bioLinks
    }

    async findProfileByUserId(id: string): Promise<Profile | null> {
        const profile = prisma.profile.findUnique({
            where : {
                userId : id
            }
        })
        return profile
    }

    async findProfileLinks(id: string): Promise<ProfileLinkType[]> {
        const profileLinks = prisma.profileLink.findMany({
            where : {
                profileId : id
            }
        })
        return profileLinks
    }

}