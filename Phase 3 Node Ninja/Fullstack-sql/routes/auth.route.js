import express from "express";

import { 
    forgotPassword,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    verifyUser,
    
 } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/register", registerUser)

router.get("/verify", verifyUser)

router.post("/login", loginUser)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password", resetPassword)

router.get("/logout", logoutUser)

export default router;