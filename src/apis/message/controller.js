import crypto from 'crypto'
import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { isTokenValid } from "../auth/helper.js";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { is_user_admin } from "../role/helper.js";
import { read_project_x_user } from '../project/crud.js';
import { create_group_message, read_message_by_project_id } from './crud.js';
import { get_user_account_by_id } from '../user/crud.js';
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

export const project_group_message = async (req, res) => {
  try {

    let token = req.headers.authorization;
    token = token.split(" ")[1];

    let token_data = await isTokenValid(token)
    if (!token_data) throw new CustomError("Access Denied", "08")
    let user_id = token_data.user_id

    let user = await get_user_account_by_id(user_id)
    if (!user) throw new CustomError("Something went wrong", "09")

    let { message, project_id } = req.body
  
    let project = await read_project_x_user(user.user_id, project_id)
    if(!project) throw new CustomError("You are not associated with this project", "09")

    //write logic to store message
    let message_date = {
        user_id: user.user_id, 
        project_id, 
        message
    }
    let write_message = await create_group_message(message_date)
    if(!write_message) throw new CustomError("Something went wrong", "09")

   
    return res.status(200).json({
      code: 200,
      responseCode: "00",
      status: "success",
      message: "Message sent successfully",
      data: write_message
    });

  } catch (err) {
    return res.status(200).json({
      code: 400,
      responseCode: err.code,
      status: "failed",
      message: err.message,
      error: "An Error Occured!",
    });
  } finally {

  }
}


export const read_all_project_message = async (req, res) => {
    try {
  
      let token = req.headers.authorization;
      token = token.split(" ")[1];
  
      let token_data = await isTokenValid(token)
      if (!token_data) throw new CustomError("Access Denied", "08")
      let user_id = token_data.user_id
  
      let user = await get_user_account_by_id(user_id)
      if (!user) throw new CustomError("Something went wrong", "09")
  
      let { project_id } = req.params
    
      let project = await read_project_x_user(user.user_id, project_id)
      if(!project) throw new CustomError("You are not associated with this project", "09")
  
 
      let messages = await read_message_by_project_id(project_id)
  
     
      return res.status(200).json({
        code: 200,
        responseCode: "00",
        status: "success",
        message: "Message fetched successfully",
        data: messages
      });
  
    } catch (err) {
      return res.status(200).json({
        code: 400,
        responseCode: err.code,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally {
  
    }
  }