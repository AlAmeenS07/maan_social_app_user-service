
export interface IBaseRepository<T, createArgs> {
    findById(id : string) : Promise<T | null>
    create(args : createArgs) : Promise<T>
}
