//Helper functions for Auth Services
import jwt from "jsonwebtoken";
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

//function generates JWT TOKEN taking user id as parameter
export function generateJWT(data,expires_in,JWT_SECRET_KEY, source, platform) {

  if(!expires_in) expires_in=getenv("JWT_EXPIRES_IN")
  if(!JWT_SECRET_KEY) JWT_SECRET_KEY = getenv("JWT_SECRET_KEY");
  if(!source) data.source = "web" //to be commented out later

  const token = jwt.sign(data, JWT_SECRET_KEY, {
    expiresIn: expires_in,
  });
  return token;
}

//function to return hash value of any string passed
export async function hashString(key) {
  const hash = await bcrypt.hash(key, getenv("BCRYPT_HASH_SALT_VALUE"));
  return hash;
}

export async function comparehashString(user_input_pin, user_stored_pin){
  try{
    if(!await bcrypt.compare(user_input_pin,user_stored_pin)) return false
    return true
  }
  catch{
    return false
  }
}

//function to check if JWT token is valid
export async function isTokenValid(token, JWT_SECRET_KEY){
  try {
    if(!JWT_SECRET_KEY) JWT_SECRET_KEY = getenv("JWT_SECRET_KEY");
    const data = jwt.verify(token, JWT_SECRET_KEY);
    return data;
  } catch (err) {
    return false;
  } finally {
    // await prisma.$disconnect();
  }
}

export function convertDateFormat(dateOfBirth) {
  const months = {
      "jan": "01",
      "feb": "02",
      "mar": "03",
      "apr": "04",
      "may": "05",
      "jun": "06",
      "jul": "07",
      "aug": "08",
      "sep": "09",
      "oct": "10",
      "nov": "11",
      "dec": "12"
  };

  const [day, monthStr, year] = dateOfBirth.toLowerCase().split('-');
  const month = months[monthStr];
  if (!day || !month || !year) {
      throw new Error("Invalid date format");
  }
  const formattedDate = `${year}-${month}-${day.padStart(2, '0')}`;
  return formattedDate;
}

export const generateUniqueNumbers = (count) => {
  const uniqueNumbers = [];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date().getTime();
    const uniqueNumber = parseInt(timestamp.toString().slice(-9)); // Take the last 9 digits of the timestamp
    uniqueNumbers.push(uniqueNumber);
  }

  return uniqueNumbers;
};

export function removeLeadingZero(value) {
  // Check if the string starts with '0'
  if (value.startsWith('0')) {
      // Remove the leading '0' by slicing the string from the second character onward
      value = value.slice(1);
  }
  return value;
}
