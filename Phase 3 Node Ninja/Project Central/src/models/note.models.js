import mongoose from "mongoose";
import { Schema } from "mongoose";

const noteSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: Schema.Types.String,
        required: true
    }
}, {timestamps: true})

export const Note = mongoose.model("Note", noteSchema)




/*
 * =================================================================
 * MONGOOSE SCHEMA: Note
 * =================================================================
 * This schema defines the structure for a "Note" document. Each note is
 * linked to a specific project and a user who created it. This structure
 * is typical for features like comments, activity logs, or project updates.
 */
//? const noteSchema = new Schema({
    /*
     * The `project` field establishes a relationship with a "Project" document.
     *
     * - `type: Schema.Types.ObjectId`: This specifies that the field will store
     * a unique MongoDB document ID.
     * - `ref: "Project"`: This is the crucial part for creating relationships.
     * It tells Mongoose that the ObjectId stored in this field refers to a
     * document in the "Project" collection. This allows us to use Mongoose's
     * `populate()` method to easily fetch the full project details along with the note.
     * - `required: true`: This ensures that a note cannot be created without
     * being linked to a project.
     */
    // project: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Project",
    //     required: true
    // },

    /*
     * The `createdBy` field links the note to the user who created it.
     * Like the `project` field, it uses an ObjectId and a `ref` to establish
     * a relationship, this time with the "User" collection. This allows you to
     * easily look up the author of any note.
     */
    // createdBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // },

    /*
     * The `content` field stores the actual text of the note.
     * It's a simple string and is required, meaning a note cannot be empty.
     */
//     content: {
//         type: String, // `Schema.Types.String` can be shortened to `String`
//         required: true
//     }
// },
    /*
     * =================================================================
     * SCHEMA OPTIONS: Timestamps
     * =================================================================
     * This second argument to the Schema constructor is an options object.
     *
     * `timestamps: true` is a magical Mongoose option that automatically adds
     * two fields to every document created with this schema:
     * 1. `createdAt`: A timestamp for when the document was first created.
     * 2. `updatedAt`: A timestamp that is updated every time the document is saved/modified.
     *
     * This is extremely useful for tracking when data was created or last changed
     * without having to manage it manually in your code.
     */
//     { timestamps: true }
// );

