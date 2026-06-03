import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/user/user.routes"
import { verifyMailer } from "./config/node.mailer"
import { connectRedis } from "./config/redis"
import { errorHandler } from "./middlewares/error.middleware"
import cookieParser from "cookie-parser"
import adminRoutes from "./routes/admin/admin.routes"
import { consumer, producer } from "./config/kafka"
import { createUsersIndex } from "./elastic-search/index/user.index"
import { startUserSyncConsumer } from "./kafka/consumers/user.sync.consumer"
import { metricsMiddleware } from "./middlewares/metrics.middleware"
import register from "./config/prom.client"
import { requestLogger } from "./middlewares/req.logger"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(requestLogger)
app.use(metricsMiddleware)

// app.use((req , res , next)=>{
//     console.log("here" , req.headers , req.body)
//     next()
// })

app.get("/", (req, res) => {
    res.send("User service is running...")
})


app.use(process.env.API_USER_ROUTE as string , userRoutes)

app.use(process.env.API_ADMIN_ROUTE as string , adminRoutes)

app.get(process.env.API_METRICS_ROUTE as string, async (_req, res) => {
  res.set("Content-Type", register.contentType);

  res.end(await register.metrics());

});


app.use(errorHandler)

const PORT: number = Number(process.env.PORT)

const startServer = async () => {

  await producer.connect();

  await consumer.connect();

  await createUsersIndex();

  await startUserSyncConsumer();

  connectRedis();

  verifyMailer();

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  });
};

startServer();