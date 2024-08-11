import express from "express";
import {
    signup_middleware, login_middleware
 
} from "./middleware.js";
import {
    signup, login
} from "./controller.js";
import multer from "multer";
import { authcheck } from "../user/middleware.js";
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/signup",upload.fields([{ name: 'profile_photo', maxCount: 1 }]), signup_middleware, signup)

router.post("/login", login_middleware, login)
// router.post("/logout", authcheck, logout)


export default router;
