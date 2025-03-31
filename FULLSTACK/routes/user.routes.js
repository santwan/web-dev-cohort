import express from "express"  // boiler plate syntax
import { registerUser, verifyUser } from "../controller/user.controller.js"

const router = express.Router()   // boiler plate syntax


router.post("/register", registerUser)
router.get("/verify/:token", verifyUser)

export default router