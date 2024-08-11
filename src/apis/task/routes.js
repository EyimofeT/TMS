import express from "express";
import {
  authcheck,create_user_task_middleware
} from "./middleware.js";
import {
  create_user_task, get_user_task, get_all_user_tasks_by_project_id
} from "./controller.js";
// import { verify } from "jsonwebtoken";
import multer from "multer";
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// all routes in here are starting with 
router.post("/", authcheck, create_user_task_middleware, create_user_task )
router.get("/:project_id", authcheck, get_all_user_tasks_by_project_id )

// get_user_task



export default router;
