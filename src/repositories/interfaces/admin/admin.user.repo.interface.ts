import { Prisma, User } from "../../../generated/prisma/client";


export interface IAdminUserRepository{
    findAll(filter : Prisma.UserWhereInput , skip : number , limit : number) : Promise<User[]>
    count(filter : Prisma.UserWhereInput) : Promise<number>
    findById(id : string) : Promise<User | null>
    findByIdAndBlockUnblock(id : string , status : boolean) : Promise<User | null>
}