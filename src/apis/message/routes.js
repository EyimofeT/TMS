import express from "express";
import {
  authcheck, project_group_message_middleware
} from "./middleware.js";
import {
    project_group_message, read_all_project_message
 } from "./controller.js";
// import { verify } from "jsonwebtoken";
import multer from "multer";
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// all routes in here are starting with 
router.post("/group", authcheck, project_group_message_middleware, project_group_message )
router.get("/group/:project_id", authcheck, read_all_project_message )






export default router;
