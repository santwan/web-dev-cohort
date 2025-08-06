// Import the User model to interact with the database
import { User } from "../model/User.model.js"

// Import crypto to generate a random token for email verification
import crypto from "crypto"

// Import nodemailer for sending verification emails
import nodemailer from "nodemailer"

//Importing bcrypt
import bcrypt from "bcrypt"

//importing JWT
import jwt from "jsonwebtoken"

//! =========================================================================================================
/*
 * =================================================================
 * CONTROLLER: User Registration
 * =================================================================
 * This function handles the new user registration process. It's a comprehensive
 * flow that validates user input, creates a new user record, and initiates
 * the email verification process.
 *
 * It's an 'async' function because it involves multiple asynchronous steps
 * like interacting with the database and sending an email.
 */
const registerUser = async (req, res) => {
    try {
        /*
         * ✅ Step 1 & 2: Extract and Validate User Input
         * We get the `name`, `email`, and `password` from the request body.
         * The `|| {}` is a safety net to prevent errors if `req.body` is undefined.
         * We then check if any of these essential fields are missing. If so,
         * we return a 400 (Bad Request) error immediately.
         */
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields (name, email, password) are required",
            });
        }

        /*
         * ✅ Step 3: Check if User Already Exists
         * Before creating a new user, we must check if an account with the
         * provided email already exists in our database. This prevents duplicate
         * accounts. `User.findOne({ email })` efficiently queries the database for us.
         */
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ // 409 Conflict is more specific here
                message: "An account with this email already exists."
            });
        }

        /*
         * ✅ Step 4: Create the New User
         * If the email is unique, we proceed to create the user with `User.create()`.
         * We pass an object with the user's details.
         ? IMPORTANT: We only pass the plain-text password here. The secure hashing
         * is handled automatically by the `userSchema.pre("save", ...)` middleware
         * we defined in the User model file. Mongoose runs that hook before saving.
         */
        const user = await User.create({ name, email, password });
        if (!user) {
            // This is a safety check in case user creation fails for some reason.
            return res.status(500).json({
                message: "User registration failed, please try again.",
            });
        }

        /*
         * ✅ Step 5 & 6: Generate and Save Verification Token
         * To verify the user's email, we generate a secure, random, and unique token.
         * `crypto.randomBytes(32).toString("hex")` creates a long, unpredictable string.
         * We then save this token to the `verificationToken` field of our new user
         * document and call `user.save()` to update the record in the database.
         */
        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = verificationToken;
        await user.save();

        /*
         * ✅ Step 7: Send Verification Email
         * Here, we use the `nodemailer` library to send an email to the user.
         * First, we create a `transporter` object with our email service credentials
         * (e.g., Mailtrap for testing, SendGrid/SES for production), which are
         * securely loaded from environment variables.
         * Then, we define the `mailOption` with the sender, recipient, subject,
         * and the email body, which includes the unique verification link.
         */
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });

        const verificationLink = `${process.env.BASE_URL}/api/v1/users/verify/${verificationToken}`;
        const mailOption = {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: user.email,
            subject: "Verify Your Email Address",
            html: `<p>Hello ${user.name},</p><p>Thank you for registering. Please click the link below to verify your email address:</p><a href="${verificationLink}">${verificationLink}</a>`
        };

        await transporter.sendMail(mailOption);

        /*
         * ✅ Step 8: Send Success Response to Client
         * After all steps are completed successfully, we send a 201 (Created)
         * status code back to the client, confirming that the user has been
         * registered and the verification email has been sent.
         */
        res.status(201).json({
            success: true,
            message: "User registered successfully. Please check your email to verify your account.",
        });

    } catch (error) {
        /*
         * ❌ Global Error Catcher
         * This block catches any errors that occur in the `try` block.
         * It sends a 500 (Internal Server Error) response and logs the error
         * for debugging, ensuring the server doesn't crash.
         */
        res.status(500).json({
            success: false,
            message: "Something went wrong during the registration process.",
            error: error.message,
        });
    }
}

//!=========================================================================================================
/*
 * =================================================================
 * CONTROLLER: Verify User's Email
 * =================================================================
 * This function is triggered when a user clicks the verification link sent
 * to their email after registering. Its main purpose is to find the user
 * associated with the verification token, mark their account as verified,
 * and invalidate the token so it cannot be used again.
 */
const verifyUser = async (req, res) => {
    // A `try...catch` block is essential in any async function that interacts
    // with a database or other external services. It ensures that if any
    // part of the process fails, we can catch the error gracefully instead of
    // crashing the entire application.
    try {
        /*
         * ✅ Step 1 & 2: Extract and Validate the Token
         * The verification token is expected to be a part of the URL, which we
         * access via `req.params`. We immediately check if the token exists. If not,
         * we send a 400 (Bad Request) error.
         */
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is missing.",
            });
        }

        /*
         * ✅ Step 3: Find the User by their Verification Token
         * We query the `users` collection to find a single document where the
         * `verificationToken` field matches the token from the URL.
         * If `User.findOne()` returns `null`, it means no user was found with
         * that token, implying the link is invalid, expired, or has already been used.
         */
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ // 404 Not Found is a good status here
                success: false,
                message: "Invalid or expired verification link.",
            });
        }

        /*
         * ✅ Step 4: Update the User's Status
         * If we successfully find the user, we perform two crucial updates:
         * 1. Set `isVerified` to `true`. This officially confirms their account.
         * 2. Set `verificationToken` to `undefined`. This is a VITAL security measure
         * to invalidate the token and ensure it cannot be used a second time.
         */
        user.isVerified = true;
        user.verificationToken = undefined;

        /*
         * ✅ Step 5: Save the Changes to the Database
         * `user.save()` tells Mongoose to persist the changes we just made
         * (setting `isVerified` and clearing the token) to the database.
         * We `await` this operation to ensure it completes successfully.
         */
        await user.save();

        /*
         * ✅ Step 6: Respond with a Success Message
         * We send a 200 (OK) response to the client (which is often the user's
         * browser after clicking the link). A frontend application would typically
         * receive this success message and redirect the user to a "Verification
         * Complete!" or login page.
         */
        res.status(200).json({
            success: true,
            message: "Your email has been verified successfully!",
        });

    } catch (error) {
        /*
         * ❌ Global Error Catcher
         * This block will catch any unexpected errors from the `try` block,
         * for example, if the database connection is lost during the `save` operation.
         * It sends a generic 500 (Internal Server Error) response to the client
         * and logs the specific error on the server for debugging.
         */
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred during the email verification process.",
            error: error.message,
        });
    }
};

//!======================================================================================================
/*
 * =================================================================
 * CONTROLLER: User Login
 * =================================================================
 * This function handles the user login process. It's an 'async' function
 * because it needs to perform asynchronous operations like querying the
 * database and comparing passwords.
 *
 * It follows a standard, secure flow:
 * 1. Validate input.
 * 2. Find the user in the database.
 * 3. Compare the provided password with the stored hash.
 * 4. Check for any other business logic (like email verification).
 * 5. Generate a session token (JWT).
 * 6. Send the token and user data back to the client.
 */
const login = async (req, res) => {
    try {
        /*
         * ✅ Step 1 & 2: Get and Validate User Input
         * We first destructure the `email` and `password` from the request body (`req.body`).
         * Then, we perform a basic validation to ensure that neither field is empty.
         * If data is missing, we immediately stop and send a 400 (Bad Request) error,
         * as the request cannot be fulfilled without this information.
         */
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        /*
         * ✅ Step 3: Find the User in the Database
         * We use the Mongoose `User.findOne()` method to search for a user document
         * that has the provided email.
         *
         * If no user is found (`!user`), we send back a generic error message.
         * SECURITY NOTE: We intentionally use a vague message like "Invalid email or password"
         * for both a non-existent user and a wrong password. This prevents "user enumeration attacks",
         * where an attacker could otherwise figure out which emails are registered in our system.
         */
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        /*
         * ✅ Step 4: Compare Passwords
         * We use `bcrypt.compare()` to securely check if the plain-text `password` from the
         * request matches the hashed `user.password` stored in our database.
         * `bcrypt.compare` is also an async function, so we must `await` its result.
         * If it returns `false`, the passwords do not match.
         */
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password" // Same generic message for security
            });
        }

        /*
         * ✅ Step 5: Check Application-Specific Logic (e.g., Verification)
         * After confirming the user's identity, we can check other business rules.
         * Here, we check if the `isVerified` flag on the user model is true.
         * If not, we block the login and instruct them to verify their email.
         */
        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email before logging in"
            });
        }

        /*
         * ✅ Step 6: Generate Authentication Token (JWT)
         * If all checks pass, we generate a JSON Web Token (JWT). This token acts as a
         * key for the user to prove they are logged in for subsequent requests.
         *
         * jwt.sign() takes three arguments:
         *  1. Payload: An object containing data to store in the token (e.g., user ID, role).
         *              Keep this small and do NOT put sensitive data here.
         *  2. Secret Key: A secret string used to sign the token. This key MUST be stored
         *              securely in environment variables (`process.env.JWT_SECRET`) and not hardcoded.
         *  3. Options: An object for settings like `expiresIn`, which sets the token's lifetime.
         */
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET, // Using the secret from environment variables
            { expiresIn: '24h' }
        );

        /*
         * ✅ Step 7: Set Token in an HTTP-Only Cookie
         * For web applications, setting the JWT in a cookie is a secure practice.
         * `httpOnly: true` means the cookie cannot be accessed by client-side JavaScript,
         * which protects it from Cross-Site Scripting (XSS) attacks.
         * `secure: true` ensures the cookie is only sent over HTTPS.
         */
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        };
        res.cookie("token", token, cookieOptions);


        /*
         * ✅ Step 8: Send Success Response
         * Finally, we send a 200 (OK) status with a success message.
         * We also send back the token and some non-sensitive user information
         * that the frontend might need (e.g., to display the user's name).
         * We explicitly create a new object to ensure the hashed password is never sent.
         */
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        /*
         * ❌ Global Error Catcher
         * If any unexpected error occurs within the `try` block (e.g., the database
         * disconnects), this `catch` block will execute. It sends a generic 500
         * (Internal Server Error) response to the client and logs the actual error
         * on the server for debugging purposes.
         */
        res.status(500).json({
            success: false,
            message: "Something went wrong during the login process",
            error: error.message,
        });
    }
};


const getMe = async ( req, res ) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "user cannot be find based on token"
            })
        }

        res.status(200).json({
            success: true,
            user
        })
        console.log("reached getMe controller")

    } catch ( error ){

    }
}


// const logoutUser = async ( req, res ) => {
//     try {
//         res.cookie('token', '', {
//             // expires: new Date(0)
//         })
//         return res.status(200).json({
//             success: true,
//             message: "Logged out successfully",
//         })

//     } catch ( error ){ 
//         res.status(500).json({
//             success: false,
//             message: "An unexpected error occurred while loggging out.",
//             error: error.message,
//         });

//     }
// }


/*
 * =================================================================
 * CONTROLLER: User Logout
 * =================================================================
 * This function handles the user logout process. In a stateless JWT authentication
 * system, "logging out" on the server doesn't technically invalidate the token itself
 * (as it's valid until its expiration). Instead, the primary goal of logout is to
 * instruct the client's browser to delete the token, effectively ending the session
 * on their end.
 *
 * We achieve this by overwriting the existing `token` cookie with an empty one
 * that is set to expire immediately.
 */
const logoutUser = async (req, res) => {
    try {
        /*
         * ✅ Step 1: Clear the Authentication Cookie
         * We use the `res.cookie()` method to send a new cookie to the client.
         * By setting the cookie with the same name ('token'), an empty value (''),
         * and an expiration date in the past, we are instructing the browser
         * to delete the cookie immediately.
         */
        const cookieOptions = {
            // It's crucial that these options (especially `httpOnly` and `secure`)
            // match the options used when the cookie was set during login.
            // This ensures the browser targets the correct cookie for deletion.
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // Setting the expiration date to a time in the past (Date(0) is epoch time)
            // is the standard way to command a browser to delete a cookie.
            expires: new Date(0)
        };

        res.cookie('token', '', cookieOptions);

        /*
         * ✅ Step 2: Send a Success Response
         * We respond with a 200 (OK) status to confirm to the client that the logout
         * process was initiated successfully. The frontend application can then
         * update its state and redirect the user to the homepage or login page.
         */
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        /*
         * ❌ Error Handling
         * This `catch` block acts as a safety net. While errors are less common
         * in a simple function like this, it's good practice to handle any
         * unexpected server issues that might occur.
         */
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred while logging out.",
            error: error.message,
        });
    }
};


const resetPassword = async ( req, res ) => {
    try {

    } catch ( error ){ 

    }
}

const forgotPassword = async ( req, res ) => {
    try {

    } catch ( error ){ 

    }
}

export {
    registerUser,
    login,
    verifyUser,
    getMe, 
    logoutUser,
    resetPassword,
    forgotPassword,
    

}