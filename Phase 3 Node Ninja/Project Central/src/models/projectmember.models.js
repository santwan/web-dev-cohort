import mongoose from "mongoose";
import { Schema } from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants";

const projectMemberSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Project: {
        type: Schema.Type.ObjectId,
        ref: "Project",
        required: true
    },
    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRolesEnum.MEMBER,
        
    }
})

export const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema)
