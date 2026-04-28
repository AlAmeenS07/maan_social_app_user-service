import { User } from "../../../generated/prisma/client";


export interface IAdminUserRepository{
    findAll(filter : any , skip : number , limit : number) : Promise<User[]>
    count(filter : any) : Promise<number>
    findById(id : string) : Promise<User | null>
    findByIdAndBlockUnblock(id : string , status : boolean) : Promise<User | null>
}