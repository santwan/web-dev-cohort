import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(()=> {
        console.log("Connected to MONGODB")
    })
    .catch((error)=>{
        console.log("Error connecting to MONGODB")
    })
}

export default db;