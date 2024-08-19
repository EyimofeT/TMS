import { getenv } from "../../core/helper.js";
import { PrismaClient } from "@prisma/client";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
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
            where: {
                project_id
            },
            select: {
                message: true,
                project_id: true,
                user_id: true,
                created_at: true,
                user: {
                    select: {
                        first_name: true,
                        last_name: true,
                        profile_photo: true
                    }
                },
                project: {
                    select: {
                        name: true,
                        description: true,
                        creator_id:true,
                        // users:{
                        //     select :{
                        //         user_id:true,
                        //         role:true
                        //     }
                        // }    
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        })

        if(group_message.length > 0){
        for(let message of group_message){
            // console.log(message)
            message.project.creator_id == message.user_id? message.is_creator = true : message.is_creator = false
            message.role = (await prisma.project_x_user.findFirst({
                where:{
                    user_id:message.user_id,
                    project_id:message.project_id
                },
                select:{
                    role:true
                }
            })).role
        }
    }

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


export async function read_all_user_group_message(user_id) {
    try {

        //   let group_message = await prisma.project_message.findMany({
        //     where:{
        //         project :{
        //             users: {
        //               some: {
        //                 user_id,
        //               },
        //             },
        //           }
        //     },
        //     select:{
        //         message :true,
        //         project_id:true,
        //         user_id :true,
        //         created_at :true,
        //         user:{
        //             select:{
        //                 first_name:true,
        //                 last_name:true,
        //                 profile_photo:true
        //             }
        //         },     
        //         project:{
        //             select:{
        //                 name:true,
        //                 description:true
        //             }
        //         }    
        //     },
        //     orderBy:{
        //        created_at : "desc"
        //     }
        //   })

        //   console.log(group_message)
        //   return group_message
        let messages = await prisma.project.findMany({
            where: {
                users: {
                    some: {
                        user_id,
                    },
                }
            },
            select: {
                project_photo:true,
                name:true,
                description:true,
                creator :{
                    select : {
                      user_id:true,
                      first_name:true,
                      last_name:true,
                      email:true,
                      phone:true,
                      profile_photo:true
                    }
                },
                project_message: {
                    select: {
                        message: true,
                        project_id: true,
                        user_id: true,
                        created_at: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                profile_photo: true
                            }
                        },
                    },
                    orderBy: {
                        created_at: "desc"
                    }
                }
            }
        })

        for(let message of messages){
            if(message.project_message.length < 1) continue
            console.log(message)
            let creator_id = message.creator.user_id
            for(let p_message of message.project_message ){
                p_message.user_id ==creator_id ? p_message.is_creator = true : p_message.is_creator = false
                p_message.role = (await prisma.project_x_user.findFirst({
                    where:{
                        user_id:p_message.user_id,
                        project_id:p_message.project_id
                    },
                    select:{
                        role:true
                    }
                })).role
            }
        }

        return messages
    }
    catch (err) {
        console.log("Error while trying to create group message: " + err)
        return false
    } finally {
        await prisma.$disconnect();
    }
}