
export type Gender = "male" | "female" | "other"

export type RegisterUserData = {
    name : string
    user_name : string
    email : string
    password : string
}

export type User = {
    id: string;
    name: string;
    user_name: string;
    email: string;
    password: string;
    is_blocked: boolean;
    is_verified: boolean;
    is_admin: boolean;
    createdAt: Date;
    updatedAt: Date;
}