import mongoose from "mongoose";
import { Schema } from "mongoose";

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    
}, {timestamps: true })

export const Project = mongoose.model("Project", projectSchema)
