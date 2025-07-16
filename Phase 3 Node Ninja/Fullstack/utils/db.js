import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

// export a function that connects to db

const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to mongoDB')
    })
    .catch(() => {
        console.log('Error connecting to mongodb')
    })
}


export default db;