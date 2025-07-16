import express from "express";
import {
    registerUser,
    verifyUser,

 } from "../controller/user.controller.js";


const router = express.Router()
router.get("/register", registerUser);
router.get("/verify", verifyUser)


export default router;