import { User } from "../../../generated/prisma/client";


export interface IAdminUserRepository{
    findAll() : Promise<User[]>
    findById(id : string) : Promise<User | null>
    findByIdAndBlockUnblock(id : string , status : boolean) : Promise<User | null>
}