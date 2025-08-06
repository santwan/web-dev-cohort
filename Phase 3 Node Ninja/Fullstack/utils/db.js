//! --- IMPORTING OUR TOOLS ---

// We import 'mongoose', which is a library that helps our Node.js application
// communicate with a MongoDB database in a structured and easy way.
// Think of it as a translator that makes talking to the database much simpler.
import mongoose from "mongoose";

// We import 'dotenv' again so we can access the secret database connection URL
// from our `.env` file.
import dotenv from "dotenv";

// This line loads the variables from the .env file into `process.env`.
// Now we can access them in this file.
dotenv.config()


//! --- DEFINING AND EXPORTING THE DATABASE CONNECTION FUNCTION ---

// We are defining a function named `db`. The `() => {}` is "arrow function" syntax.
// The entire purpose of this function is to establish the connection to our database.
const db = () => {

    // Connecting to a database is an "asynchronous" operation (it takes time).
    // JavaScript uses something called a "Promise" to handle this.
    // A Promise is like an IOU: "I promise to let you know if this works or if it fails."

    mongoose
        // This is the core command. We ask Mongoose to connect to the database.
        // We pass it the connection string (the URL) which we securely get from our environment variables.
        // `process.env.MONGO_URL` retrieves the value you set in your .env file.
        .connect(process.env.MONGO_URL)

        // The `.then()` block is the "SUCCESS" part of the Promise.
        // The code inside here will ONLY run if the connection to MongoDB is successful.
        .then(() => {
            // We print a message to the developer's console to confirm that we are connected.
            console.log('✅ Connected to MongoDB successfully!')
        })

        // The `.catch()` block is the "FAILURE" part of the Promise.
        // The code inside here will ONLY run if an error occurs during the connection attempt.
        .catch((err) => {
            // We print an error message to the console. This helps us debug what went wrong.
            // It's good practice to also log the actual error object `err` for more details.
            console.log('❌ Error connecting to MongoDB:', err.message)
        })
}


// This line makes our `db` function available to be used in other files.
// `export default` means that when another file imports from this one,
// it will get the `db` function by default. This is what allows us to write
// `import db from './utils/db.js'` in our main server file.
export default db;