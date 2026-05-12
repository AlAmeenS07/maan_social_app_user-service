import prisma from "../../../db/prisma.client";
import { Prisma, User } from "../../../generated/prisma/client";
import { IAdminUserRepository } from "../../interfaces/admin/admin.user.repo.interface";
import { IBaseRepository } from "../../interfaces/base/base.repository.interface";


export class AdminUserRepository implements IAdminUserRepository , IBaseRepository<User>{

    async findAll(filter: Prisma.UserWhereInput, skip: number, limit: number): Promise<User[]> {
        const users = prisma.user.findMany({
            where : filter,
            skip : skip,
            take : limit,
            orderBy : {
                createdAt : "desc"
            }
        })
        return users
    }

    async count(filter: Prisma.UserWhereInput): Promise<number> {
        const counts = prisma.user.count({
            where : filter
        })
        return counts
    }

    async findById(id: string): Promise<User | null> {
        const user = prisma.user.findUnique({
            where : {
                id
            }
        })
        return user
    }

    async findByIdAndBlockUnblock(id: string, status: boolean): Promise<User | null> {
        const user = prisma.user.update({
            data : {
                is_blocked : status
            },
            where : {
                id
            }
        })
        return user
    }
}