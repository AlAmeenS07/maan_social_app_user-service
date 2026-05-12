import { Prisma, User } from "../../../generated/prisma/client";
import { IBaseRepository } from "../base/base.repository.interface";


export interface IAdminUserRepository extends IBaseRepository<User>{
    findAll(filter : Prisma.UserWhereInput , skip : number , limit : number) : Promise<User[]>
    count(filter : Prisma.UserWhereInput) : Promise<number>
    // findById(id : string) : Promise<User | null>
    findByIdAndBlockUnblock(id : string , status : boolean) : Promise<User | null>
}