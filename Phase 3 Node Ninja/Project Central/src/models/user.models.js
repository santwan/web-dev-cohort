import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto"

const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localpath: String
        },
        default: {
            url: `https://placehold.co/600x400`,
            localpath: ""
        }
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },

    fullname: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },

    emailVerificationToken: {
        type: String
    },

    emailVerificationTokenExpiry: {
        type: Date
    },

    forgotPasswordToken: {
        type: String
    },

    forgotPasswordTokenExpiry: {
        type: Date
    },

    refreshToken: {
        type: String
    }


} ,{timestamps: true})


userSchema.pre("save", function(next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username

        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username

        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.isPasswordMatch = async function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto
                            .createHash("sha256")
                            .update(unHashedToken)
                            .digest("hex")
    const tokenExpiry = Date.now() + (20*60*1000)

    return {

        unHashedToken,
        hashedToken,
        tokenExpiry
    }
}

export const User = mongoose.model("User", userSchema)