import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import dotenv from "dotenv"

dotenv.config()

const connection = process.env.DATABASE_URL!;

console.log("connection string" , connection)

const adapter = new PrismaPg({ connectionString : connection });

const prisma = new PrismaClient({ adapter });

export default prisma;