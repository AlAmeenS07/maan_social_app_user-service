import { UserFindUniqueArgs } from "../../../generated/prisma/models";
import { PrismaDelegate } from "../../../types/prisma/prisma.deligate";
import { IBaseRepository } from "../../interfaces/base/base.repository.interface";


export class BaseRepository<
    T, 
    FindUniqueArgs extends { where?: { id?: string } }, 
    FindManyArgs, 
    CreateArgs, 
    UpdateArgs, 
> implements IBaseRepository<T ,CreateArgs> {

    constructor(
        protected _prisma : PrismaDelegate<T, FindUniqueArgs, FindManyArgs, CreateArgs, UpdateArgs>
    ){}

    async findById(id : string): Promise<T | null> {
        return await this._prisma.findUnique({
            where : {
                id
            }
        }as FindUniqueArgs)
    }

    async create(args: CreateArgs): Promise<T> {
        return await this._prisma.create(args)
    }

}