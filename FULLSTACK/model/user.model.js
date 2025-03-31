import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin"], //enumeration - sirf ini mese value select karo
        default: "user", 
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },

}, {
    timestamps: true,
})

// Apply a middleware function before saving the document in MongoDB
userSchema.pre("save", async function (next) {
    // 🔹 Check if the 'password' field has been modified
    // 'this' refers to the current user document being saved
    if (this.isModified("password")) { 
        // 🔹 Hash the password before saving
        // 'bcrypt.hash()' is used to securely hash the password
        // ⚠️ The second parameter (salt rounds) is required in bcrypt.hash()
        this.password = await bcrypt.hash(this.password, 10); // 10 is the recommended salt rounds for security
    }

    // 🔹 Call 'next()' to proceed with saving the document
    next();
});


const User  = mongoose.model("User", userSchema)

export default User