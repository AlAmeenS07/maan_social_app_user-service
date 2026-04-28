import prisma from "../../../db/prisma.client";
import { User } from "../../../generated/prisma/client";
import { IAdminUserRepository } from "../../interfaces/admin/admin.user.repo.interface";


export class AdminUserRepository implements IAdminUserRepository{

    async findAll(filter: any, skip: number, limit: number): Promise<User[]> {
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

    async count(filter: any): Promise<number> {
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