import { User } from "../../../generated/prisma/client";


export interface IAdminAuthRepository{
    findByEmail(email : string) : Promise<User | null>
}