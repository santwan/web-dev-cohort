// Importing the Express framework to create the router
import express from "express";

// Importing specific controller functions that handle user-related logic
import {
    registerUser, // Handles the user registration logic
    verifyUser,   // Handles the logic for verifying a user's email/token
    login,
    getMe,
    resetPassword,
    forgotPassword,
    logoutUser,

} from "../controller/user.controller.js";

import { isLoggedIn } from "../middleware/auth.middleware.js";

/*
 * =================================================================
 * CREATE A MODULAR ROUTER
 * =================================================================
 * This line creates a new "Router" object from the Express framework.
 * Think of a Router as a "mini-application" or a self-contained module
 * capable of having its own routes and middleware.
 *
 * ### Why is this so important?
 *
 * Instead of attaching all of your application's routes directly to the main
 * `app` object in a single file (which can become massive and messy),
 * the Router allows you to group related routes into separate, manageable files.
 * For example, all user-related routes (`/login`, `/register`, `/profile`)
 * can live together in a `user.routes.js` file, while all product-related
 * routes can live in a `product.routes.js` file.
 *
 * This practice is fundamental for:
 * ✅ **Organization:** Keeps your codebase clean and easy to navigate.
 * ✅ **Scalability:** Makes it simple to add new features and endpoints.
 * ✅ **Maintainability:** Allows you to work on one part of your API without
 * getting lost in unrelated code.
 *
 * ### How it's used:
 *
 * 1.  You create this `router` object.
 * 2.  You define all your user-specific routes on this new object (e.g., `router.post('/login', ...)` instead of `app.post(...)`).
 * 3.  At the end of the file, you `export` this `router`.
 * 4.  Finally, you `import` it into your main server file and "mount" it on a base path, like so: `app.use('/api/v1/users', theRouterFromFile);`.
 */
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

router.get("/me", isLoggedIn, getMe)

router.get("/logout", isLoggedIn, logoutUser)

router.post("/forgot", forgotPassword)

router.post("/reset/:resetToken" , resetPassword)



// Exporting the router so it can be mounted in the main app (e.g., app.use("/api/users", router))
export default router;