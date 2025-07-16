// const express = require('express')
import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import db from './utils/db.js';


dotenv.config()

const app = express(); // App ke pass express ki sari saktiyaan transfer ho rahi hain

app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['get', 'post', 'delete', 'options'],
    allowedHeaders: ['Content-type', 'Authorization'],
    Credentials: true,
}))

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


db();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
