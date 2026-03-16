import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import aiRouter from "./routes/aiRoute.js"
import chatRouter from "./routes/chatRoute.js"
import favoriteRouter from "./routes/favoriteRoute.js"
import analyticsRouter from "./routes/analyticsRoute.js"
import couponRouter from "./routes/couponRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000;


// middlewares
app.use(express.json())
app.use(cors())

// db connection
connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/ai", aiRouter)
app.use("/api/chat", chatRouter)
app.use("/api/favorite", favoriteRouter)
app.use("/api/analytics", analyticsRouter)
app.use("/api/coupon", couponRouter)

app.get("/", (req, res) => {
    res.send("API Working")
  });

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))