import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes"
import { transporter, verifyMailer } from "./config/node.mailer"
import { connectRedis } from "./config/redis"
import { errorHandler } from "./middlewares/error.middleware"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

connectRedis()
verifyMailer()

app.get("/", (req, res) => {
    res.send("User service is running...")
})

app.use("/api/v1/user" , userRoutes)


app.use(errorHandler)

const PORT: number = Number(process.env.PORT)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

