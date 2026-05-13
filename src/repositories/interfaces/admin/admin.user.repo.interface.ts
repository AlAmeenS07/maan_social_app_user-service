import { Prisma, User } from "../../../generated/prisma/client";
import { UserFindUniqueArgs } from "../../../generated/prisma/models";
import { IBaseRepository } from "../base/base.repository.interface";


export interface IAdminUserRepository extends IBaseRepository<User, Prisma.UserCreateArgs >{
    findAll(filter : Prisma.UserWhereInput , skip : number , limit : number) : Promise<User[]>
    count(filter : Prisma.UserWhereInput) : Promise<number>
    findByIdAndBlockUnblock(id : string , status : boolean) : Promise<User | null>
}