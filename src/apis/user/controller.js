import jwt from "jsonwebtoken";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { get_user_account_by_id, update_user_by_id, get_all_user_account } from "./crud.js";
import { isTokenValid } from "../auth/helper.js";
import { is_email_unique, is_phone_unique } from "./helper.js";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary'; 
cloudinary.config({ 
  cloud_name: getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key: getenv("CLOUDINARY_API_KEY"), 
  api_secret: getenv("CLOUDINARY_API_SECRET") 
});
const folderName = 'TMS';
const storage = multer.memoryStorage();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});


export const get_user = async (req, res) => {
  try{

    //Validate token
    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if(!user) throw new CustomError("Something went wrong", "09")

    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "User fetched successfully",
      data: {user},
    });


  } catch (err) {
      return res.status(200).json({
        code: 400 ,
        responseCode: err.code ,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally { 
  
    }
}

export const patch_user = async (req, res) => {
  try{

    //Validate token
    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id
    let user 
    let update_data = {
      ...req.body
    }

    user = await get_user_account_by_id(user_id)
    if(!user) throw new CustomError("Something went wrong", "09")

    if(update_data.email && update_data.email != user.email ) if(!await is_email_unique(update_data.email)) throw new CustomError("An account has already been registered with this email", "09")
    if(update_data.phone && update_data.phone != user.phone) if(!await is_phone_unique(update_data.phone))  throw new CustomError("An account has already been registered with this phone", "09")
  

    if(req.files.profile_photo){
      const b64 = Buffer.from(req.files.profile_photo[0].buffer).toString("base64");
    let dataURI = "data:" + req.files.profile_photo[0].mimetype + ";base64," + b64;
    const doc1Result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: folderName,
    });
    let cloud_image = {
      "file_name": req.files.profile_photo[0].originalname,
      "file_url": doc1Result.secure_url
     }
     update_data.profile_photo = doc1Result.secure_url
    }

    user = await update_user_by_id(user_id, update_data)
    if(!user) throw new CustomError("Something went wrong", "09")
    // console.log(update_data)

  delete user.password
  delete user.user_id

    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "User updated successfully",
      data: {user},
    });


  } catch (err) {
      return res.status(200).json({
        code: 400 ,
        responseCode: err.code ,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally { 
  
    }
}

export const get_all_user = async (req, res) => {
  try{

    //Validate token
    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if(!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let users = await get_all_user_account()
    if(!users) throw new CustomError("Something went wrong", "09")

    return res.status(200).json({
      code: 200 ,
      responseCode: "00",
      status: "success",
      message: "Users fetched successfully",
      data: users,
    });


  } catch (err) {
      return res.status(200).json({
        code: 400 ,
        responseCode: err.code ,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally { 
  
    }
}