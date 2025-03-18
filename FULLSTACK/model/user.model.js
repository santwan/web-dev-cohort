import mongoose from "mongoose"

const userScenma = new mongoose.Schema()


const User  = mongoose.model("User", userScenma)


export default User