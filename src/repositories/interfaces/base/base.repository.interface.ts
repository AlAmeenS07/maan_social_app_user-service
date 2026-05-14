
export interface IBaseRepository<T, FindUniqueArgs, FindManyArgs ,CreateArgs , UpdateArgs, DeleteArgs> {
    findById(args : FindUniqueArgs) : Promise<T | null>
    find(args : FindManyArgs) : Promise<T[]>
    create(args : CreateArgs) : Promise<T>
    update(args : UpdateArgs) : Promise<T>
    delete(args : DeleteArgs) : Promise<void>
}
