import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import userRouter from "./routes/auth.route.js";

dotenv.config()
const app = express()
const port = process.env.PORT || 5173

app.use(cookieParser)
app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use( "/api/v1/auth/users/", userRouter )

app.get("/", (res, req ) => {
    return res.status(400).json({
        message: "this is the default page"
    })
})
app.listen(process.env.PORT, () => {
    console.log(`Backend is listening at port: ${port}`)
})