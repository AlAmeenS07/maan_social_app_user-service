import bcrypt from "bcryptjs"


export const hashPassword = async(password : string , salt : number = 10) => {
    return await bcrypt.hashSync(password , salt)
}


export const  comparePassword = async(password : string, comparePassword : string) => {
    return await bcrypt.compare(password , comparePassword)
}