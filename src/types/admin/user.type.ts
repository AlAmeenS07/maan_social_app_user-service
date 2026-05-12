
export type FindUsersQuery = {
  search?: string;
  status?: "active" | "blocked" | "";
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};


export type UserFilter = {
  is_admin: boolean;
  OR?: {
    name?: { contains: string; mode: "insensitive" };
    email?: { contains: string; mode: "insensitive" };
    user_name?: { contains: string; mode: "insensitive" };
  }[];
  is_blocked?: boolean;
  createdAt?: {
    gte: Date;
    lte: Date;
  };
};