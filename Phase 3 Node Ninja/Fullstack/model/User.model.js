import mongoose from "mongoose";


//!=========================================================================================
// ✅ Define a new schema for the User model
// A Schema is a blueprint for the shape and structure of documents in a MongoDB collection
/*
const userSchema = new mongoose.Schema({

  name: {
    type: String,         // Data type: String
    required: true,       // This field is mandatory
    trim: true            // Removes extra spaces from both ends of the string
  },

  email: {
    type: String,
    required: true,
    unique: true,         // Ensures no two users have the same email
    lowercase: true,      // Converts email to lowercase before saving
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6          // Enforces minimum password length
  },

  createdAt: {
    type: Date,
    default: Date.now     // Automatically set to current date and time
  }
});
*/

//? This line creates a Mongoose model named "User" using the userSchema.
//! const User = mongoose.model("User", userSchema)

//* Mongoose automatically maps this model to a MongoDB collection.
//* And MongoDB collection names are automatically pluralized and lowercased versions of the model name.
/* Mongoose Model Name	MongoDB Collection Name
"User"	users
"BlogPost"	blogposts
"CategoryItem"	categoryitems 
*/
//! This is Mongoose's default behavior.
//!=========================================================================================


const userSchema = new mongoose.Schema({
    name: String, 
    email: String,
    password: String,
    role: {
        type: String, 
        enum: ["user", "admin"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiresL: {
        type: Date,
    },


}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema)


export {
    User
}