// A modern way to import packages in Node.js, part of the ES6 module system.
// The line below is the older "CommonJS" way. We're using the newer "import" syntax.
// const express = require('express')

// --- IMPORTING OUR TOOLS (PACKAGES) ---
// We are bringing in all the necessary tools we need for our server.

// 'express' is the main framework for building the web server. It simplifies handling web requests.
import express from 'express';

// 'dotenv' is a utility that loads "environment variables" from a .env file into our application.
// This is great for hiding sensitive data like database passwords or API keys from our main code.
import dotenv from "dotenv";

// 'cors' stands for Cross-Origin Resource Sharing. It's a security feature.
// It's like a bouncer at a club that tells the browser which other websites (origins) are allowed to request data from our server.
import cors from "cors";

// Here we're importing our own code! This is the function we wrote in another file to connect to our database.
import db from './utils/db.js';

// 'cookie-parser' is a middleware that helps our server understand and work with cookies sent by the browser.
// It parses the cookie header and makes it available in `req.cookies`.
import cookieParser from 'cookie-parser';


// --- IMPORTING OUR ROUTE HANDLERS ---
// To keep our code organized, we define the logic for different URLs in separate files.

// This imports all the routes related to "users" (e.g., /login, /register, /profile).
import userRoutes from "./routes/user.routes.js";


//! --- INITIAL CONFIGURATION AND SETUP ---

// This line executes the `dotenv` package. It looks for a file named `.env` in the root directory,
// reads all the key-value pairs, and makes them available throughout our app via `process.env`.
dotenv.config()

// Here, we create an instance of the Express application.
// Think of `app` as our main server object. It holds all the power and methods of Express.
const app = express();


//! --- APPLYING MIDDLEWARE ---
// Middleware are functions that run for every incoming request. They can modify the request,
// run some code, or pass it along to the next function. They are used with `app.use()`.
// The order of middleware is VERY important. They run one after another.

//* We apply the CORS middleware here.
app.use(cors({
    // `origin`: Specifies which frontend URL is allowed to access our backend.
    // We store the actual URL in our .env file for security and flexibility.
    origin: process.env.BASE_URL,
    // `methods`: The HTTP methods (verbs) that are allowed from the frontend.
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    // `allowedHeaders`: The specific headers that can be included in a request.
    allowedHeaders: ['Content-Type', 'Authorization'],
    // `credentials`: This is crucial! It allows the browser to send cookies with requests to our server.
    credentials: true,
}));

// This is a built-in Express middleware. Its job is to parse incoming requests that have a JSON payload (body).
// If a frontend sends data as JSON, this middleware understands it and makes it available in `req.body`.
app.use(express.json());

// This is another built-in middleware. It parses incoming requests with URL-encoded payloads.
// This is the format data usually comes in from a standard HTML form submission.
// `extended: true` allows for more complex, nested objects to be parsed.
app.use(express.urlencoded({ extended: true }));

// This middleware parses the `Cookie` header on the request and makes the cookie data
// easily accessible as an object at `req.cookies`.
app.use(cookieParser());


//! --- DATABASE CONNECTION ---

// Here we call the database connection function we imported earlier.
// This will attempt to connect to our MongoDB (or other) database.
db();


//! --- DEFINING ROUTES ---
// A route determines how the application responds to a client request to a specific endpoint (URI) and a specific HTTP method (GET, POST, etc.).

// A simple test route to check if the server is running.
// When someone visits the root URL of our server (e.g., http://localhost:3000/), this function runs.
app.get('/', (req, res) => {
    // `res.send()` sends a response back to the client.
    res.send('Cohort!');
})

// NOTE: You have two routes for `app.get('/')`. In Express, only the FIRST one that is defined will ever run.
// The request will be handled by the route above, and this one will be ignored. I'm commenting it out for clarity.
/*
app.get('/', (req, res) => {
    res.send('Hello World!');
})
*/

// Another example of a simple GET route for a different path.
app.get("/piyush", (req, res) => {
    res.send("Piyush!");
})


//! --- USING THE IMPORTED ROUTERS (API Routes) ---
// This is a powerful way to organize our code.
// We tell our app: "For any request that starts with the path `/api/v1/users`,
// pass it over to the `userRoutes` handler to figure out what to do next."
// So, a request to `/api/v1/users/login` will be handled by the `/login` route inside `user.routes.js`.
app.use("/api/v1/users", userRoutes)


//! --- STARTING THE SERVER ---

// Define the port number our server will listen on.
// It first tries to get the port from an environment variable (best for production),
// but if it's not defined, it defaults to port 3000.
const port = process.env.PORT || 3000;

// This is the final command. It tells our app to start listening for HTTP requests on the specified port.
// The function `() => { ... }` is a "callback" that runs once the server is successfully started.
// It logs a message to our console so we know that everything is up and running.
app.listen(port, () => {
    console.log(`✅ Server is running successfully on port ${port}`)
})