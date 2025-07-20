// const express = require('express')
import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import db from './utils/db.js';
import cookieParser from 'cookie-parser';


//import all the routes
import userRoutes from "./routes/user.routes.js";



dotenv.config()

const app = express(); // App ke pass express ki sari saktiyaan transfer ho rahi hain

app.use(cors({
  origin: process.env.BASE_URL,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


// Middleware to parse incoming JSON requests
// This allows your server to accept and understand JSON data in request bodies (e.g., POST, PUT requests)
app.use(express.json());  // Parses incoming requests with JSON payloads and makes the data available in req.body.

/*
 Middleware to parse URL-encoded data (typically from HTML form submissions)
 - extended: true => uses the qs library, allowing for rich objects and arrays
 - extended: false => uses the querystring library (simpler parsing)
 Setting extended: true is recommended for most modern apps to handle nested form data
*/
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


const port = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  res.send('Cohort!');
})

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get("/piyush", (req, res) => {
    res.send("Piyush!");
})

// Connect to DB
db();

//user routes
app.use("/api/v1/users", userRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
