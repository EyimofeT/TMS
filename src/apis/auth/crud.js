import jwt from "jsonwebtoken";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});

export async function update_last_login(user_id){
  try{
    let user = await prisma.user.update({
     where : {
      user_id
      },
      data : {
        last_login :  new Date()
      }
    })
    return user
  }
  catch (err) {
    console.log("Error while trying to update last login: "+ err)
    return false
  } finally {
    await prisma.$disconnect();
  }
  }

