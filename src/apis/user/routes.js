import express from "express";
import {
  authcheck, update_profile_middleware
} from "./middleware.js";
import {
  get_user, patch_user, get_all_user
} from "./controller.js";
// import { verify } from "jsonwebtoken";
import multer from "multer";
const storage = multer.memoryStorage(); // Store uploaded files in memory
const upload = multer({ storage: storage });

const router = express.Router();

// all routes in here are starting with  dhata/api/v1/user
router.get("/", authcheck, get_user)
router.patch("/",upload.fields([{ name: 'profile_photo', maxCount: 1 }]), authcheck, update_profile_middleware, patch_user)

router.get("/all", authcheck, get_all_user)

// router.patch("/upload_nin",upload.fields([{ name: 'nin', maxCount: 1 }]), upload_nin_middleware, upload_nin)
// router.patch("/",upload.any(), update_user_middleware, update_user ) 
// router.patch("/profile_photo",upload.fields([{ name: 'profile_photo', maxCount: 1 }]), update_user_profile_photo_middleware, update_user_profile_photo )

export default router;
