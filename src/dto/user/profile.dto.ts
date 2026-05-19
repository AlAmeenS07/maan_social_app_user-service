import { Profile, ProfileLink } from "../../generated/prisma/client"
import { Gender } from "../../types/user/user.type"


export interface ProfileDto{
    id : string
    userId : string
    gender : Gender
    dob : Date
    bioHead? : string
    bioText? : string
    avatar? : string
    location? : string
    createdAt : Date
}

export interface ProfileLinkDto{
    id : string
    profileId : string
    title : string
    url : string
    createdAt : Date
}

export function profileDtoFun(profile : Profile) : ProfileDto{
    return {
        id : profile.id,
        userId : profile.userId,
        gender : profile.gender,
        dob: profile.dob,
        location : profile.location || '',
        bioHead : profile.bioHead || '',
        bioText : profile.bioText || '',
        avatar : profile.avatar || '',
        createdAt : profile.createdAt
    }
}


export function profileLinkDtoFun(links : ProfileLink[]) : ProfileLinkDto[] {
    const bioLinks = links.map((link) => {
        return {
            id : link.id,
            profileId : link.profileId,
            title : link.title || '',
            url : link.url,
            createdAt : link.createdAt
        }
    })
    return bioLinks
}