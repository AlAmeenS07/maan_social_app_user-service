import { Gender, Prisma, Profile, User } from "../../../generated/prisma/client"
import { IBaseRepository } from "../base/base.repository.interface"


export interface IUserAuthRepository extends IBaseRepository<User ,Prisma.UserFindUniqueArgs, Prisma.UserFindManyArgs, Prisma.UserCreateArgs , Prisma.UserUpdateArgs , Prisma.UserDeleteArgs>{
    findByEmail(email : string) : Promise<User | null>
    findByUserName(user_name : string) : Promise<User | null> 
    // createUser(name : string , user_name : string , email : string , password : string) : Promise<User>
    createUserProfile(id : string , dob : Date , gender : Gender) : Promise<Profile>
    verifyUser(id : string) : Promise<User>
    updatePassword(id : string , password : string) : Promise<User>
}