import { ProfileDto, ProfileLinkDto } from "../../dto/user/profile.dto";
import { UserDto } from "../../dto/user/user.dto";

export const transformUserSearchDocument = (user: UserDto, profile: ProfileDto, profileLinks: ProfileLinkDto[]) => {

    return {
        id: user.id,
        name: user.name,
        user_name: user.user_name,
        email: user.email,
        is_blocked: user.is_blocked,
        is_verified: user.is_verified,
        createdAt: user.createdAt,
        profile: {
            id: profile?.id || '',
            avatar: profile?.avatar || "",
            gender: profile?.gender || null,
            dob: profile?.dob || null,
            location: profile?.location || "",
            bioHead: profile?.bioHead || "",
            bioText: profile?.bioText || "",
        },
        profileLinks: profileLinks || []
    };
};