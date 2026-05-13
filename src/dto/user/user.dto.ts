import { User } from "../../types/user/user.type";

export interface UserDto {
  id: string;
  name: string;
  user_name: string;
  email: string;
  is_blocked: boolean;
  is_verified: boolean;
  is_admin: boolean;
  createdAt: Date;
}


export function userDto(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    user_name: user.user_name,
    email: user.email,
    is_blocked: user.is_blocked,
    is_verified: user.is_verified,
    is_admin: user.is_admin,
    createdAt: user.createdAt,
  };
}