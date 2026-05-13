import prisma from "../../../db/prisma.client";
import { Gender, Prisma, Profile, User } from "../../../generated/prisma/client";
import { IUserAuthRepository } from "../../interfaces/user/user.auth.repo.interface";
import { BaseRepository } from "../base/base.repository";


export class UserAuthRepository extends BaseRepository<
    User,
    Prisma.UserFindUniqueArgs,
    Prisma.UserFindManyArgs,
    Prisma.UserCreateArgs,
    Prisma.UserUpdateArgs
>
    implements IUserAuthRepository {

    constructor() {
        super(prisma.user)
    }

    findByEmail(email: string): Promise<User | null> {
        const user = prisma.user.findUnique({
            where: {
                email
            }
        })
        return user
    }

    findByUserName(user_name: string): Promise<User | null> {
        const user = prisma.user.findUnique({
            where: {
                user_name
            }
        })
        return user
    }

    createUserProfile(id: string, dob: Date, gender: Gender): Promise<Profile> {
        const userProfile = prisma.profile.create({
            data: {
                userId: id,
                dob,
                gender
            }
        })
        return userProfile
    }

    verifyUser(id: string): Promise<User> {
        const user = prisma.user.update({
            data: {
                is_verified: true
            },
            where: {
                id
            }
        })
        return user
    }

    updatePassword(id: string, password: string): Promise<User> {
        const user = prisma.user.update({
            data: {
                password
            },
            where: {
                id
            }
        })
        return user
    }

}