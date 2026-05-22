import prisma from "../../../db/prisma.client";
import { Prisma, Profile, User } from "../../../generated/prisma/client";
import { ProfileLinkType } from "../../../types/user/profile.types";
import { IAdminUserRepository } from "../../interfaces/admin/admin.user.repo.interface";
import { BaseRepository } from "../base/base.repository";


export class AdminUserRepository extends BaseRepository<
    User,
    Prisma.UserFindUniqueArgs,
    Prisma.UserFindManyArgs,
    Prisma.UserCreateArgs,
    Prisma.UserUpdateArgs,
    Prisma.UserDeleteArgs
> implements IAdminUserRepository {

    constructor() {
        super(prisma.user)
    }

    async findAll(filter: Prisma.UserWhereInput, skip: number, limit: number): Promise<User[]> {
        const users = prisma.user.findMany({
            where: filter,
            skip: skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        })
        return users
    }

    async count(filter: Prisma.UserWhereInput): Promise<number> {
        const counts = prisma.user.count({
            where: filter
        })
        return counts
    }

    async findByIdAndBlockUnblock(id: string, status: boolean): Promise<User | null> {
        const user = prisma.user.update({
            data: {
                is_blocked: status
            },
            where: {
                id
            }
        })
        return user
    }

    async findProfileByUserId(id: string): Promise<Profile | null> {
        const profile = prisma.profile.findUnique({
            where: {
                userId: id
            }
        })
        return profile
    }

    async findUserProfileLinkById(profileId: string): Promise<ProfileLinkType[]> {
        const profileLinks = prisma.profileLink.findMany({
            where: {
                profileId
            }
        })
        return profileLinks
    }

}