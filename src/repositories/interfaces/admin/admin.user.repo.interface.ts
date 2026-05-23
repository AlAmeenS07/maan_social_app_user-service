import { Prisma, Profile, User } from "../../../generated/prisma/client";
import { ProfileLinkType } from "../../../types/user/profile.types";
import { IBaseRepository } from "../base/base.repository.interface";


export interface IAdminUserRepository extends IBaseRepository<User, Prisma.UserFindUniqueArgs, Prisma.UserFindManyArgs, Prisma.UserCreateArgs, Prisma.UserUpdateArgs, Prisma.UserDeleteArgs>{
    findAll(filter : Prisma.UserWhereInput , skip : number , limit : number) : Promise<User[]>
    count(filter : Prisma.UserWhereInput) : Promise<number>
    findByIdAndBlockUnblock(id : string , status : boolean) : Promise<User | null>
    findProfileByUserId(id: string): Promise<Profile | null>
    findUserProfileLinkById(id : string) : Promise<ProfileLinkType[]>
}