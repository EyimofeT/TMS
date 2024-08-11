import jwt from "jsonwebtoken";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { create_user_account, get_user_account_by_identifier } from "../user/crud.js";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});

import { comparehashString, generateJWT, hashString } from "./helper.js";
import { is_email_unique, is_phone_unique } from "../user/helper.js";
import { update_last_login } from "./crud.js";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary'; 
cloudinary.config({ 
  cloud_name: getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key: getenv("CLOUDINARY_API_KEY"), 
  api_secret: getenv("CLOUDINARY_API_SECRET") 
});
const folderName = 'TMS';
const storage = multer.memoryStorage();

export const signup = async (req, res) => {
 try{
  let {first_name, last_name, phone, email, password} = req.body;
  password = await hashString(password)

  if(!await is_email_unique(email)) throw new CustomError("An account has already been registered with this email", "09")
  if(!await is_phone_unique(phone))  throw new CustomError("An account has already been registered with this phone", "09")

  let user_data = {
    user_id : crypto.randomUUID(),
    first_name,
    last_name,
    phone,
    email,
    password
  }

  if(req.files){
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
     user_data.profile_photo = doc1Result.secure_url
    }
  }

  // console.log(user_data)
  let user = await create_user_account(user_data)
  if(!user) throw new CustomError("Something went wrong", "09")
  
  delete user.id
  delete user.user_id
  delete user.password

  return res.status(200).json({
    code: 200 ,
    responseCode: "00" ,
    status: "success",
    message: "User registration successful",
    data: user,
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

export const login = async (req, res) => {
  try{
    let {identifier, password} = req.body;
    
    let user = await get_user_account_by_identifier(identifier)
    if(!user) throw new CustomError("Invalid/Incorrect credentials", "09")

    
    let user_stored_password = user.password
    if(!await comparehashString(password, user_stored_password)) throw new CustomError("Invalid/Incorrect credentials", "09")
    
    let token_data = {
      user_id: user.user_id
    }
    let token = generateJWT(token_data)

    update_last_login(user.user_id)
    delete user.password
    delete user.id
    delete user.user_id    

    return res.status(200).json({
      code: 200 ,
      responseCode: "00" ,
      status: "success",
      message: "Login successful",
      data: {token,user},
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

