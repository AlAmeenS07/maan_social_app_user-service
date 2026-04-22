import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes"
import { transporter } from "./config/node.mailer"
import { connectRedis } from "./config/redis"

dotenv.config()

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("User service is running...")
})

app.use("/api/v1/user" , userRoutes)

const PORT: number = Number(process.env.PORT)


connectRedis()

app.listen(PORT, () => {
    verifyMailer()
    console.log(`Server running on http://localhost:${PORT}`)
})


async function verifyMailer(){
  try {
    await transporter.verify();
    console.log("SMTP server ready");
  } catch (err) {
    console.error("SMTP error:", err);
  }
};