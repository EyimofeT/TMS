import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek , eachDayOfInterval, format } from 'date-fns';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});

export async function create_group_message(data) {
    try {
  
      let group_message = await prisma.project_message.create({
        data
      })
  
    //   console.log(group_message)
      return group_message
    }
    catch (err) {
      console.log("Error while trying to create group message: " + err)
      return false
    } finally {
      await prisma.$disconnect();
    }
  }

  
  export async function read_message_by_project_id(project_id) {
    try {
  
      let group_message = await prisma.project_message.findMany({
        where:{
            project_id
        },
        select:{
            message :true,
            project_id:true,
            user_id :true,
            created_at :true,
            user:{
                select:{
                    first_name:true,
                    last_name:true,
                    profile_photo:true
                }
            },     
            project:{
                select:{
                    name:true,
                    description:true
                }
            }    
        },
        orderBy:{
           created_at : "desc"
        }
      })
  
    //   console.log(group_message)
      return group_message
    }
    catch (err) {
      console.log("Error while trying to create group message: " + err)
      return false
    } finally {
      await prisma.$disconnect();
    }
  }