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


export async function create_task(task_data) {
  try{

    let user_task = await prisma.task.create({
      data : task_data
    })

  console.log(user_task)
  return user_task
  }
  catch (err) {
    console.log("Error while trying to create task: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}
