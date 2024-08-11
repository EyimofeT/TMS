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


export async function name() {
  try{

  }
  catch (err) {
    console.log("Error while trying to create project: " + err)
    return false
  } finally {
    await prisma.$disconnect();
  }
}
