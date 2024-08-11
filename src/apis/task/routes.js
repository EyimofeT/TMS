import express from "express";
import {
  authcheck, create_user_project_middleware, add_user_project_middleware, delete_user_project_middleware
} from "./middleware.js";
import {
  create_user_project, get_user_project, get_user_project_by_project_id, add_user_project, delete_user_project
} from "./controller.js";
// import { verify } from "jsonwebtoken";
import multer from "multer";
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// all routes in here are starting with  dhata/api/v1/user




export default router;
