import mongoose from "mongoose";
import { Schema } from "mongoose";

const subtaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Type.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true})

export const Subtask = mongoose.model("Subtask", subtaskSchema)
