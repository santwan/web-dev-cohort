// require  - 
// import  - If you are using import then you have to go to package.json file and have to make some changes - Add "type": "module"  in the object.
// const express = require('express')
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"

//import all routes
import userRoutes from "./routes/user.routes.js"  // Importing the user routes (default export) from user.routes.js
import { registerUser } from "./controller/user.controller.js"

dotenv.config()

const app = express();

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTION' ],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({
  extended: true,
}))

const port = process.env.PORT || 3000


app.get('/', (req, res) => {
  res.send('Hello Mars')
})

//connect to db 
db()

//user routes
app.use("/api/v1/users/", userRoutes); // Mounting the userRoutes at '/api/v1/users/'
// This means all routes inside userRoutes will be prefixed with '/api/v1/users/'
// Example: If userRoutes has 'GET /', it will be accessible as 'GET /api/v1/users/'

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
