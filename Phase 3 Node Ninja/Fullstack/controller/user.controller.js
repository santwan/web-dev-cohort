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

const registerUser  = async ( req, res ) => {
    /**
     * Flow:
     * 1. Extract user data from request body
     * 2. Validate input fields
     * 3. Check if the user already exists
     * 4. Save new user to DB
     * 5. Generate verification token
     * 6. Save token in DB
     * 7. Send email with verification link
     * 8. Respond to client 
     */

    const {name, email, password} = req.body || {}

    // Step 2: Validate the required fields
    if(!name || !email || !password ){
        return res.status(400).json({
            message: "All fields are required",
        })
    }

    try {
        // Step 3: Check if user already exists
        const existingUser = await User.findOne({ email : email  })
        if(existingUser){
            return res.status(400).json({
                message: "User Already Exists"
            })
        }

        // Step 4: Create the user in the database
        const user = await User.create({ name, email, password })
        console.log(user)

        if(!user){
            return res.status(400).json({
                message: "User Registration Failed",
            })
        }

        // Step 5: Generate a 32-byte random token in hexadecimal
        const token = crypto.randomBytes(32).toString("hex")
        console.log(token)

        // Step 6: Save token to the user document
        user.verificationToken = token
        await user.save()

        // Step 7: Send the email using nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // false for Mailtrap or any other testing service
            auth: { 
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },    
        });

        const mailOption = {
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: "Verify your email",
            text: `Please Click on the following link: ${process.env.BASE_URL}/api/v1/users/verify/${token} `
        }

        // Send the email with the token link
        await transporter.sendMail(mailOption)

        // Step 8: Return a success response
        res.status(201).json({
            message: "User Registered Successfully",
            success: true,
        })

    } catch(error){
        // If any error occurs during registration
        res.status(400).json({
            message: "Something Went Wrong",
            error,
            success: false,
        })
    }
}

//!=========================================================================================================

// handles all the email  verification token
const verifyUser = async (req, res ) => {
    /**
     * Flow:
     * 1. Extract token from URL param
     * 2. Validate the token
     * 3. Find user by token
     * 4. If valid: set isVerified = true & clear token
     * 5. Save and respond with success
     */

    const { token } = req.params
    console.log(token)

    // Step 2: Validate token presence
    if(!token){
        return res.status(400).json({
            message: "Invalid token",
        })
    }

    // Step 3: Find user by token
    const user = await User.findOne({ verificationToken: token }) // User is the whole table named as users in the MongoDB , but user is a particular person in the database or you can say a specific row

        //handling the edge case if the user donot exist in the database 
    if (!user) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false
        });
    }

    // Step 4: Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;

    // Step 5: Save changes and respond
    await user.save();  

    res.status(200).json({
        message: "Email verified successfully",
        success: true
    });
}

//!======================================================================================================

const login = async (req, res) => {
    // ✅ Step 1: Destructure email and password from the request body
    const { email, password } = req.body;

    // ✅ Step 2: Validate that both fields are provided
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        // ✅ Step 3: Check if user exists in the DB with given email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // ✅ Step 4: Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Wrong password or email entered"
            });
        }

        // ✅ Step 5: Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email first"
            });
        }

        // ✅ Step 6: Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            "shhhhh", // ⚠️ Replace this with process.env.JWT_SECRET in production
            { expiresIn: '24h' }
        );

        // ✅ Step 7: Set token in cookie
        const cookieOptions = {
            httpOnly: true,    // JS on client can't access this cookie
            secure: true,      // Only sent over HTTPS (use false for localhost testing)
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        };

        res.cookie("token", token, cookieOptions);

        // ✅ Step 8: Send success response with user info (excluding password)
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        // ❌ Catch any server or database error
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
            success: false
        });
    }
};


export {
    registerUser,
    login,
    verifyUser,

}