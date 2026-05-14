import { ProfileDto, ProfileLinkDto } from "../../dto/user/profile.dto"
import { UserDto } from "../../dto/user/user.dto"
import { Gender } from "../../generated/prisma/enums"

export type ProfileLinkInput = {
    linkId?: string
    title: string
    url: string
}

export type ProfileLinkType = {
    id: string
    profileId: string
    title: string | null
    url: string
    createdAt: Date
    updatedAt: Date
}

export type ProfileUpdateType = {
    name? : string
    user_name? : string
    gender? : Gender
    dob? : string
    avatar?: string
    bioHead? : string
    bioText? : string
    location? : string
    bioLinks? : ProfileLinkInput
}

export type Profile = {
    name : string
    user_name : string
    avatar : string
    bioHead : string
    bioText : string
    gender : string
    location : string
    dob : string
}

export type ProfileResponseType = {
    user : UserDto
    profile : ProfileDto
    profileLinks : ProfileLinkDto[]
}