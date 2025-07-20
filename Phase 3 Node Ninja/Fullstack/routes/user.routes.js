// Importing the Express framework to create the router
import express from "express";

// Importing specific controller functions that handle user-related logic
import {
    registerUser, // Handles the user registration logic
    verifyUser,   // Handles the logic for verifying a user's email/token
} from "../controller/user.controller.js";

// Creating a new router object to define route endpoints for users
const router = express.Router();

/**
 * @route   GET /register
 * @desc    Register a new user
 * @access  Public
 *
 * This route will typically:
 * - Accept query parameters or headers (if needed)
 * - Call the `registerUser` function defined in the controller
 * - The controller will handle:
 *    - Input validation
 *    - Creating a user in the database
 *    - Generating a verification token
 *    - Sending a verification email with the token
 */
router.post("/register", registerUser);

/**
 * @route   GET /verify/:token
 * @desc    Verify a user's email using a token
 * @access  Public
 *
 * This route will:
 * - Extract the `token` from the URL using req.params
 * - Call the `verifyUser` function from the controller
 * - The controller will:
 *    - Check if the token is valid and exists in the DB
 *    - Mark the user as verified if successful
 *    - Return a response to the frontend (success or failure)
 */
router.get("/verify/:token", verifyUser);


router.post("/login", login)

// Exporting the router so it can be mounted in the main app (e.g., app.use("/api/users", router))
export default router;