// require  - 
// import  - If you are using import then you have to go to package.json file and have to make some changes - Add "type": "module"  in the object.

// const express = require('express')
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"

dotenv.config()

const app = express();

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTION' ],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const port =process.env.PORT || 3000


app.get('/', (req, res) => {
  res.send('Hello Babu fuck You')
})

app.get('/hitesh', (req, res) => {
  res.send('Hitesh')
})

app.get("/piyush", (request , response) =>{
    response.send("Piyush!!")
})
 
//connect to db 
db()

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})

