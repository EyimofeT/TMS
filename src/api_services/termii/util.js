import axios from "axios";

import { getenv } from "../../core/helper.js";
import { sendPostRequest } from "../../apis/utils/sendpostrequest.js";
import crypto from 'crypto'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});


//function to send OTP to user
export async function sendOTP(phone_number,message, from) {
  //This function sends post request to send OTP to user
  if(phone_number.startsWith("+")){
    phone_number = phone_number.substring(1)
  }

  const url = getenv("TERMII_OTP_SEND_URL");
  const data = {
    api_key: getenv("TERMII_API_KEY"),
    message_type: "NUMERIC",
    to: phone_number,
    from: from || getenv("TERMII_FROM"),
    channel: getenv("TERMII_CHANNEL"),
    pin_attempts: 3,
    pin_time_to_live: 10,
    pin_length: 4,
    pin_placeholder: "< 1234 >",
    message_text: message,
    pin_type: "NUMERIC",
  };
  return await sendPostRequest(url, data);
}

export async function verifyOTP(pin_id, pin) {
  //This function sends post request to verify OTP
  const url = getenv("TERMII_OTP_VERIFY_URL");
  const data = {
    api_key: getenv("TERMII_API_KEY"),
    pin_id: pin_id,
    pin: pin,
  };
  // const otpResponse=await sendPostRequest(url, data)
  return await sendPostRequest(url, data);
}









