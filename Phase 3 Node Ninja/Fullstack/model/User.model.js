// Import mongoose to define schema and create models
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//=========================================================================================
// ✅ Define the User schema – this acts as the structure/blueprint for each User document
//=========================================================================================
const userSchema = new mongoose.Schema({

    // 👤 User's name
    name: String, // (Can be enhanced: `type: String, required: true, trim: true`)

    // 📧 Email address of the user
    email: String, // (Should ideally be: `type: String, required: true, unique: true, lowercase: true, trim: true`)

    // 🔒 Password (ideally should be hashed before saving)
    password: String, // (Should ideally use: `type: String, required: true, minlength: 6`)

    // 🛡️ Role of the user: either 'user' or 'admin'
    role: {
        type: String,
        enum: ["user", "admin"], // only these two values are allowed
        default: "user"          // by default, every new user is assigned the 'user' role
    },

    // ✅ Flag to check whether the user has verified their email or not
    isVerified: {
        type: Boolean,
        default: false
    },

    // 📧 Token for verifying the user's email
    verificationToken: {
        type: String
    },

    // 🔁 Token for password reset (sent via email)
    resetPasswordToken: {
        type: String
    },

    // ⏳ Expiry time for the reset password token
    resetPasswordExpiresL: { // ⚠️ Typo: `resetPasswordExpiresL` should be `resetPasswordExpires`
        type: Date
    }

}, {
    // 🕒 Automatically adds createdAt and updatedAt fields to each document
    timestamps: true
});


userSchema.pre("save", async function(next){
  if(this.isModified("password")){
    this.password = bcrypt.hash(this.password, 10)
  }
  next()
})

//=========================================================================================
// ✅ Create the User model from the schema
// Mongoose will create a collection called 'users' from this model
//=========================================================================================
const User = mongoose.model("User", userSchema);

// ✅ Export the model for use in other files (e.g., controller, routes)
export {
    User
}
