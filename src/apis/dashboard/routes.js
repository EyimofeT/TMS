import express from "express";
import {
  authcheck,
} from "./middleware.js";
import {
  get_dashboard
} from "./controller.js";
// import { verify } from "jsonwebtoken";
import multer from "multer";
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// all routes in here are starting with  

router.get("/", authcheck, get_dashboard)




export default router;
