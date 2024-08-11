//Helper functions for user Services
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { encrypt } from "../utils/encrypt.js";
import {  get_redis_client , disconnect_redis_client, read_from_redis, write_to_redis, delete_from_redis} from "../../core/redis.js";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});


export async function is_email_unique(email){
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) return true;

    // console.log(user)
    return false;
  } catch (err) {
    console.log("Unique Email Error: "+ err)
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export async function is_phone_unique(phone){
  try {
    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (!user) return true;

    // console.log(user)
    return false;
  } catch (err) {
    console.log("Unique Phone Error: "+ err)
    return false;
  } finally {
    await prisma.$disconnect();
  }
}



