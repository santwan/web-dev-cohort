import mongoose from "mongoose"

const userScenma = new mongoose.Schema({
    name: String,
    email: String,
})


const User  = mongoose.model("User", userScenma)


export default User