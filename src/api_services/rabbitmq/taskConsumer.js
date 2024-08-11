
// import { verify } from 'jsonwebtoken';
import { is_bvn_unique, is_email_unique, is_phone_unique } from '../../apis/user/helper.js';
import { sendToQueue, consumeQueue } from './rabbitmqManager.js';
import { verify_bvn, verify_nin } from '../dojah/utils.js';
import { sendOTP, verifyOTP } from '../termii/util.js';
import { getenv } from '../../core/helper.js';
import { create_dhata_ardilla_retail_user_account } from '../../apis/user/crud.js';

export const processTask = async (task) => {
    // console.log(`Processing task: ${JSON.stringify(task)}`);
    try{
    // if(task.task == "test") {
    //         console.log(task)
    // }
    if(task.task == "email_unique" && task.server == 'dhata') {
        let result = false
        result = await is_email_unique(task.email)
        await sendToQueue(result,task.replyTo,{correlationId:task.correlationId})
    }
    if(task.task == "fetch_bvn_data" && task.server == 'dhata') {
        let result =false
        result = await verify_bvn(task.bvn,getenv('DOJA_LIVE_KEY'))
        if(result) result = result.data
        // console.log(result)
        await sendToQueue(result,task.replyTo,{correlationId:task.correlationId})
    }
    if(task.task == "fetch_nin_data" && task.server == 'dhata') {
        console.log("in fetch nin")
        let result = false
        result = await verify_nin(task.nin,getenv('DOJA_LIVE_KEY'))
        if(result) result = result.data
        await sendToQueue(result,task.replyTo,{correlationId:task.correlationId})
    }
    if(task.task == "send_otp" && task.server == 'dhata') {
        console.log("Phone : " + task.phone)
        // let phone = '+2348136603427'
        let phone  = task.phone
        const otp_response = await sendOTP(phone, task.message,task.sender_id)
        const otp_response_data = {
         pin_id: otp_response.pin_id || otp_response.pinId,
          pin_verified: false,
        }
        await sendToQueue(otp_response_data,task.replyTo,{correlationId:task.correlationId})
    }
    if(task.task == "verify_otp" && task.server == 'dhata') {
        const otp_response = await verifyOTP(task.pin_id,task.otp)
        // console.log(otp_response)  
        await sendToQueue(otp_response,task.replyTo,{correlationId:task.correlationId})
    }

    if(task.task == "check_existence" && task.server == 'dhata'){
        let result
        if(task.field == 'bvn'){
            result = await is_bvn_unique(task.bvn)
            // console.log("result : "+ result)
           
        }
        if(task.field == 'phone'){
            result = await is_phone_unique(task.phone)
            // console.log("result : "+ result)
        }

        await sendToQueue(result,task.replyTo,{correlationId:task.correlationId})
    }
    if(task.task == "write_dhata_account" && task.server == 'dhata'){
        let result
    //    console.log(task)
    let write_action = await create_dhata_ardilla_retail_user_account(task.user_id,task.field_officer_id,task.user_data)
    if(!write_action) retryTask(task)
       result = true
        await sendToQueue(result,task.replyTo,{correlationId:task.correlationId})
    }
    
    console.log(`Task - ${task.task} completed successfully`);
    return true
}
catch(err){
    console.log("Error in process task : "+ err)
    return false
}
};

export const retryTask = async (task) => {
    console.log('Task processing failed:', task);
    // Requeue the task for retry
    await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // Retry after 5 minutes
    await sendToQueue(task);
};

export const start_consume_queue = async (queue) => {
    console.log("Starting Consume Queue Service")
    await consumeQueue(async (task) => {
    try {
       if(!await processTask(task)) throw new Error
       
    } catch (error) {
        console.log("Error in start consume queue service ")
        await retryTask(task);
    } 
},queue);

}

export const add_to_queue = async (req, res, next) => {
    console.log("Adding to queue")
    // let task = `Task ${Date()}`
    //     console.log(await sendToQueue(task))
    }
