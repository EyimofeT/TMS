import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});
const transaction_timeout = 60000
const user_obj ={}

export async function create_user_account(user_data){
try{
  let user = await prisma.user.create({
    data : user_data
  })
  return user
}
catch (err) {
  console.log("Error while trying to create user account: "+ err)
  return false
} finally {
  await prisma.$disconnect();
}
}

export async function get_user_account_by_identifier(identifier){
  try{
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              contains: identifier,
            },
          },
          {
            phone: {
              contains: identifier,
            },
          }
        ],
      },
    })
    if(!user) return false
    return user
  }
  catch (err) {
    console.log("Error while trying to get user account: "+ err)
    return false
  } finally {
    await prisma.$disconnect();
  }
  }

export async function get_user_account_by_id(user_id) {
  try {
    let user = await prisma.user.findFirst({
      where: {
        user_id
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        profile_photo: true,
        last_login: true
      }
    })
    if (!user) return false
    return user
  }
  catch (err) {
    console.log("Error while trying to get user account: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function update_user_by_id(user_id, data){
  try {
    let user = await prisma.user.update({
      where: {
        user_id
      },
      data
    })
    if (!user) return false
    return user
  }
  catch (err) {
    console.log("Error while trying to update user account: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}

export async function get_all_user_account() {
  try {
    let user = await prisma.user.findMany({
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        profile_photo: true,
      }
    })
    if (!user) return false
    return user
  }
  catch (err) {
    console.log("Error while trying to get user account: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}