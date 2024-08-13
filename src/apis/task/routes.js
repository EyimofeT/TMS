import express from "express";
import {
  authcheck,create_user_task_middleware , update_user_task_status_middleware, update_user_task_middleware
} from "./middleware.js";
import {
  create_user_task, get_user_task, get_all_user_tasks_by_project_id, update_user_task_status , update_user_task
} from "./controller.js";
// import { verify } from "jsonwebtoken";
import multer from "multer";
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// all routes in here are starting with 
router.post("/", authcheck, create_user_task_middleware, create_user_task )
router.get("/generate/:project_id", authcheck, get_all_user_tasks_by_project_id )
// router.get("/generate/:project_id/:user_id", authcheck, get_all_user_tasks_by_project_id )
router.patch("/interface/:project_id/:task_id", authcheck, update_user_task_middleware , update_user_task)
router.patch("/status", authcheck, update_user_task_status_middleware, update_user_task_status)



export default router;
