import prisma from "../../../db/prisma.client";
import { Gender, Profile, User } from "../../../generated/prisma/client";
import { IBaseRepository } from "../../interfaces/base/base.repository.interface";
import { IUserAuthRepository } from "../../interfaces/user/user.auth.repo.interface";


export class UserAuthRepository implements IUserAuthRepository, IBaseRepository<User> {

    findByEmail(email: string): Promise<User | null> {
        const user = prisma.user.findUnique({
            where: {
                email
            }
        })
        return user
    }

    findById(id: string): Promise<User | null> {
        const user = prisma.user.findUnique({
            where: {
                id
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

    createUser(name: string, user_name: string, email: string, password: string): Promise<User> {
        const user = prisma.user.create({
            data: {
                name,
                user_name,
                email,
                password
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