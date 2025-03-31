// Import the User model from '../model/User.model.js' (MongoDB schema for storing user details)
import User from "../model/User.model.js";

// Import 'crypto' for generating a secure random verification token
import crypto from "crypto";

// Import 'nodemailer' to send verification emails
import nodemailer from "nodemailer";

// Define an asynchronous function to register a user
const registerUser = async (req, res) => {
    //! GET USER DATA FROM REQUEST BODY
    // Extract name, email, and password from req.body (data sent by the user in the request)
    const { name, email, password } = req.body;

    // Validate if all fields are provided
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    //!  CHECK IF USER ALREADY EXISTS
    try {
        // Query MongoDB to check if a user with the same email already exists
        const existingUser = await User.findOne({ email });

        // If user exists, return an error message
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // 3️⃣ CREATE A NEW USER IN THE DATABASE
        // If user does not exist, create a new user instance in the database
        const user = await User.create({
            name,
            email,
            password, // ⚠️ Ideally, hash the password before storing (use bcrypt)
        });

        console.log(user); // Log user details for debugging

        // If user creation fails, return an error message
        if (!user) {
            return res.status(400).json({
                message: "User not registered",
            });
        }

        // 4️⃣ GENERATE A VERIFICATION TOKEN
        // Generate a random 32-byte hexadecimal token using 'crypto' module
        const token = crypto.randomBytes(32).toString("hex");
        console.log(token); // Log the token for debugging

        // Store the verification token in the user's database record
        user.verificationToken = token;

        // Save the updated user record with the token
        await user.save();

        // 5️⃣ CONFIGURE EMAIL TRANSPORTER
        // Create a transporter using nodemailer with environment variables for security
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST, // SMTP host (e.g., Mailtrap, SendGrid)
            port: process.env.MAILTRAP_PORT, // SMTP port (e.g., 2525 for Mailtrap)
            secure: false, // false for non-SSL (TLS) ports, true for SSL (port 465)
            auth: {
                user: process.env.MAILTRAP_USERNAME, // SMTP username
                pass: process.env.MAILTRAP_PASSWORD, // SMTP password
            },
        });

        // 6️⃣ PREPARE EMAIL CONTENT
        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL, // Sender email address
            to: user.email, // Recipient's email address
            subject: "Verify your email", // Email subject
            text: `Please click on the following link to verify your account:
            ${process.env.BASE_URL}/api/v1/users/verify/${token}`, // Email body with the verification link
        };

        // 7️⃣ SEND VERIFICATION EMAIL
        await transporter.sendMail(mailOption);

        // 8️⃣ SEND SUCCESS RESPONSE
        res.status(201).json({
            message: "User registered successfully",
            success: true,
        });

    } catch (error) {
        // 9️⃣ HANDLE ERRORS
        res.status(500).json({ // Change to 500 (Internal Server Error) for better accuracy
            message: "User not registered due to an error",
            error: error.message, // Send only the error message, not the full error object for security reasons
            success: false,
        });
    } 
};
    //get token from the url
    //validate the token from teh url
    // find user based on token 
    //if not 
    // set isVerified field to true
    //removing the verification token 
    //save and return response

//Verifying the user imaginaing that user have received the link in the mail
const verifyUser = async (req, res) => {
    // 🔹 Extract the verification token from the URL parameters
    const { token } = req.params;
    console.log(token); // Log the token for debugging

    // 🔹 Check if the token exists in the request
    if (!token) {
        return res.status(400).json({
            message: "Invalid token", // Return error if no token is provided
        });
    }

    // 🔹 Find a user in the database with the matching verification token
    const user = await User.findOne({ verificationToken: token });

    // 🔹 If no user is found with the given token, return an error
    if (!user) {
        return res.status(400).json({
            message: "Invalid token", // User not found, meaning token is incorrect or expired
        });
    }

    // 🔹 If the user exists, mark them as verified
    user.isVerified = true;

    // 🔹 Remove the verification token to prevent reuse
    user.verificationToken = undefined;

    // 🔹 Save the updated user data in the database
    await user.save();

    // 🔹 Send success response to the client
    res.status(200).json({
        message: "User successfully verified!",
        success: true,
    });
};

// Export the registerUser function for use in routes
export { registerUser , verifyUser };
