import prisma from "../../../db/prisma.client";
import { User } from "../../../generated/prisma/client";
import { IAdminAuthRepository } from "../../interfaces/admin/admin.auth.repo.interface";



export class AdminAuthRepository implements IAdminAuthRepository{
    async findByEmail(email: string): Promise<User | null> {
        const user = prisma.user.findUnique({
            where : {
                email
            }
        })
        return user
    }
}