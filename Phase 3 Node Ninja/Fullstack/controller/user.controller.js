import { User } from "../model/User.model.js"
import crypto from "crypto"
import req from "express/lib/request.js"
import nodemailer from "nodemailer"


const registerUser  = async ( req, res ) => {
    /**
    1. Get the data 
    2. Validate the data
    3. check if user alredy exists
    4. Create a user in the database
    5. create a verification token
    6. Save a token in data base 
    7. send the same token as email to user embed in the link
    8. send success status to user 
    */

    const {name, email, password} = req.body || {}
    if(!name || !email || !password ){
        return res.status(400).json({
            message: "All fields are required",
        })
    }



    try {
        const existingUser =await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: "User Already Exists"
            })
        }

        
        const user = await User.create({
            name, 
            email, 
            password
        })
        console.log(user)

        if(!user){
            return res.status(400).json({
                message: "User Registration Failed",
            })
        }

        // Generating the token 
        const token = crypto.randomBytes(32).toString("hex")
        console.log(token)

        // Saving the token to DB
        user.verificationToken = token
        await user.save()
        

        // send mail
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false, // true for 465, false for other ports
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

        await transporter.sendMail(mailOption)


        res.status(201).json({
            message: "User Registered Successfully",
            success: true,
        })

    } catch(error){
            res.status(400).json({
            message: "Something Went Wrong",
            error,
            success: false,
        })
    }



}


const verifyUser = async (req, res ) => {

}

const login =  async (req, res ) => {
    res.send("Login successful")
}


export {
    registerUser,
    login,

}