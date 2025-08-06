/*
 * Import Mongoose, our primary tool for interacting with the MongoDB database.
 * Think of Mongoose as a powerful and friendly translator between our JavaScript code and MongoDB.
 * MongoDB is "schemaless" by default (meaning it's very flexible), but Mongoose allows us to
 * enforce a predictable structure for our data using "Schemas".
 *
 * Key things Mongoose helps us with:
 * ✅ Defining a `Schema`: A blueprint for how our data should look (e.g., a user must have an email and password).
 * ✅ Creating a `Model`: A constructor built from the Schema that gives us methods to create, read, update, and delete documents (e.g., `User.create()`, `User.findById()`).
 * ✅ Data Validation: Automatically checks if the data being saved matches the schema's rules.
 * ✅ Middleware (Hooks): Allows us to run code automatically at certain points (like hashing a password before saving).
 */
import mongoose from "mongoose";

/*
 * Import bcrypt, a library dedicated to hashing passwords securely.
 * This is a fundamental security tool. We NEVER, EVER store passwords as plain text in our database.
 * If the database were ever breached and passwords were in plain text, all user accounts would be instantly compromised.
 *
 * How bcrypt works:
 * 1. HASHING: When a user signs up, we use `bcrypt.hash()` to transform their plain-text
 * password into a long, complex, and effectively irreversible string (the "hash"). This hash is what we store.
 * 2. COMPARING: When a user tries to log in, they provide their password again. We use
 * `bcrypt.compare()` to take their login attempt, hash it the same way, and see if the result matches the hash
 * we have stored in the database.
 *
 * It is a one-way process; you cannot "un-hash" a password to get the original text, which is what makes it so secure.
 */
import bcrypt from "bcrypt";

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


/*
 * =================================================================
 * Mongoose Middleware (also called pre-hooks or post-hooks)
 * =================================================================
 * Middleware are functions that are executed at specific points during a document's lifecycle.
 * This "pre-save" hook runs *before* a document is saved to the database.
 * It's the perfect place to perform actions like hashing passwords, creating slugs, etc.,
 * ensuring that our data is processed correctly before it's stored.
 */

// We attach a "pre" middleware to our userSchema that will run before any "save" operation.
// The function is `async` because password hashing is a CPU-intensive, asynchronous operation.
userSchema.pre("save", async function (next) {
    /* 
    ! IMPORTANT: We MUST use a regular `function` declaration here, NOT an arrow function `() => {}`.
    ? Why? Because we need access to the document that is about to be saved via the `this` keyword.
    ?      Arrow functions do not have their own `this` context; they inherit it from their parent scope.

     This `if` statement checks if the 'password' field has been modified for this specific document.
     This is a crucial optimization and security measure. 
     ? It ensures we ONLY hash the password if:
        * 1. A new user is being created (the password field is new).
        * 2. An existing user is updating their password.
     Without this check, the password would be re-hashed every time a user updates their email or any other field.
     Re-hashing an already-hashed password would make it invalid, and the user wouldn't be able to log in.
    */
    if (this.isModified("password")) {
        
        /* 
        ! Now we perform the actual hashing.
            `bcrypt.hash()` is the function from the bcrypt library that does the heavy lifting.
            It takes two arguments:
                1. `this.password`: The plain-text password to be hashed.
                2. `10`: The "salt rounds" or "cost factor". This number determines how computationally expensive (and thus, how secure) the hash calculation is.
                A value of 10 is a strong, standard baseline.
        
         *We use `await` because hashing takes time, and we need to wait for it to finish.
         *The result (the secure hash) then overwrites the plain-text password on the document (`this.password`).
        */
        this.password = await bcrypt.hash(this.password, 10);
    }

    // `next()` is a function that passes control to the next middleware in the Mongoose stack.
    // If there are no more middleware functions, it proceeds with the actual `save` operation.
    // If we forget to call `next()`, the entire save process will hang and never complete!
    next();
});

/*
 * =================================================================
 * COMPILE SCHEMA INTO A MODEL
 * =================================================================
 * This is the final and one of the most crucial steps in defining our data structure.
 * Here, we take the `userSchema` (our blueprint) and compile it into a workable `Model`.
 *
 * Think of it like this:
 * ➡️ `userSchema`: An architect's detailed blueprint for a house. It defines the structure, rules, and materials.
 * ➡️ `mongoose.model()`: The process of creating a construction company that specializes in building houses based on that specific blueprint.
 * ➡️ `User`: The resulting construction company (the Model). We can now use this `User` object to build, find, update, and demolish houses (documents) in our database.
 *
 ? `mongoose.model()` takes two essential arguments:
 *
 * 1. The singular name of the model as a string: `"User"`.
 * Mongoose has a bit of magic here: it will automatically look for the
 * plural, lowercased version of this name as the collection in the database.
 * So, `"User"` model interacts with the `"users"` collection in MongoDB.
 *
 * 2. The schema to use: `userSchema`.
 * This tells the model what structure, validation rules, and middleware
 * (like our password hashing hook) to apply to every document.
 *
 * The `User` constant is now our primary interface for querying and manipulating
 * the `users` collection in our MongoDB database.
 */
const User = mongoose.model("User", userSchema);



//  Export the model for use in other files (e.g., controller, routes)
export {
    User
}
