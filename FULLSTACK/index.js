// In Node.js, there are two module systems:
// 1. CommonJS (require)
// 2. ES Module (import)
// If using 'import', update package.json by adding "type": "module"
import express from "express"; // Import the Express framework to create the server
import dotenv from "dotenv"; // Import dotenv to load environment variables from a .env file
import cors from "cors"; // Import CORS (Cross-Origin Resource Sharing) to allow API access from different origins
import db from "./utils/db.js"; // Import the database connection function from the utils folder
import cookieParser from "cookie-parser";

// Import all routes
import userRoutes from "./routes/user.routes.js"; // Import user routes (default export) from user.routes.js
import { registerUser } from "./controller/user.controller.js"; // Import a named function from the user controller file

// Load environment variables from .env file (e.g., PORT, BASE_URL)
dotenv.config(); 

// Create an instance of an Express application
const app = express(); 

// Middleware: Enable CORS to handle cross-origin requests
app.use(cors({
    origin: process.env.BASE_URL, // Allow requests only from the BASE_URL specified in .env
    credentials: true, // Allow sending cookies and authentication headers in requests
    methods: ['GET', 'POST', 'DELETE', 'OPTION'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow only specific request headers
}));

// Middleware: Enable parsing of JSON request bodies
app.use(express.json()); 

// Middleware: Enable parsing of URL-encoded form data
app.use(express.urlencoded({ 
  extended: true, // Allow nested objects in URL-encoded data
}));

app.use(cookieParser()) // now we can access the cookies 

// Define the port for the server (use value from .env or default to 3000)
const port = process.env.PORT || 3000;

// Define a basic test route
app.get('/', (req, res) => {
  res.send('Hello Mars'); // Responds with 'Hello Mars' when accessing '/'
});

// Connect to the database (calls the imported db function)
db(); 

// User routes: Mount all user-related API routes under '/api/v1/users/'
app.use("/api/v1/users", userRoutes);
// This means all routes inside userRoutes will be prefixed with '/api/v1/users/'
// Example: If userRoutes has 'GET /', it will be accessible as 'GET /api/v1/users/'

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
