import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.get("/" , (req , res)=>{
    res.send("User service is running...")
})

const PORT : number = Number(process.env.PORT)

app.listen(PORT , ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})