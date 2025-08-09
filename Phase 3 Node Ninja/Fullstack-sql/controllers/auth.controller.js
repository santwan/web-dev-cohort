import prisma from '../prisma/prismaClient.js';
import bcrypt from 'bcrypt'
import crypto from 'crypto';

const registerUser = async (req , res ) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide all required fields: name, email, and password" 
            });
        }

        
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "User already exists" 
            });
        }

        const hashedPassword = bcrypt.hash(password, 10)
        const verificationToken = crypto.randomBytes(32).toString('hex')
        
        
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password : hashedPassword,
                emailVerificationToken: verificationToken
            }
        });

        // Here you would typically send a verification email to the user
        // For example, using a service like SendGrid or Nodemailer

        

        return res.status(201).json({ 
            message: "User registered successfully", 
            user: newUser 
        });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" ,
            error: error.message
        });
    }

}

const loginUser = async (req, res ) => {
    console.log("Welcome to login route")
}

const verifyUser = async (req, res ) => {
    console.log("Welcome to verification route")

}

const logoutUser = async (req, res ) => {
    console.log("Logging out")
}

const  forgotPassword = async (req, res ) => {
    console.log("User have forgotten his password")
}

const resetPassword = async (req, res) => {
    console.log("Reset the password")
}

export {
    registerUser,
    loginUser,
    verifyUser,
    logoutUser,
    forgotPassword,
    resetPassword
}