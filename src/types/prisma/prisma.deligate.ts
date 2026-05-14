export interface PrismaDelegate<
  T,
  FindUniqueArgs,
  FindManyArgs,
  CreateArgs,
  UpdateArgs,
  DeleteArgs
> {
  findUnique(args: FindUniqueArgs): Promise<T | null>;

  create(args: CreateArgs): Promise<T>;

  findMany(args: FindManyArgs): Promise<T[]>;

  update(args: UpdateArgs): Promise<T>;

  delete(args : DeleteArgs) : void
}