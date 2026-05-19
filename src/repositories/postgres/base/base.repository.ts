import { PrismaDelegate } from "../../../types/prisma/prisma.deligate";
import { IBaseRepository } from "../../interfaces/base/base.repository.interface";


export class BaseRepository<
    T, 
    FindUniqueArgs, 
    FindManyArgs, 
    CreateArgs, 
    UpdateArgs, 
    DeleteArgs
> implements IBaseRepository<T , FindUniqueArgs, FindManyArgs, CreateArgs, UpdateArgs, DeleteArgs> {

    constructor(
        protected _prisma : PrismaDelegate<T, FindUniqueArgs, FindManyArgs, CreateArgs, UpdateArgs , DeleteArgs>
    ){}

    async findById(args : FindUniqueArgs): Promise<T | null> {
        return await this._prisma.findUnique(args)
    }

    async create(args: CreateArgs): Promise<T> {
        return await this._prisma.create(args)
    }

    async update(args: UpdateArgs): Promise<T> {
        return await this._prisma.update(args)
    }

    async delete(args: DeleteArgs): Promise<void> {
        await this._prisma.delete(args)
    }

    async find(args: FindManyArgs): Promise<T[]> {
        return await this._prisma.findMany(args)
    }

}