import express from "express"  // boiler plate syntax
import { registerUser } from "../controller/user.controller.js"

const router = express.Router()   // boiler plate syntax


router.get("/register", registerUser)

export default router