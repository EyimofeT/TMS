import { getenv } from "../../core/helper.js";
import crypto from "crypto";

export async function encrypt(value){
  try {  
  const encryptionKey = getenv('ENCRYPT_SECRET_KEY'); // 256-bit key
  const initializationVector = getenv('ENCRYPT_INITIALIZATION_VECTOR'); // 16-byte IV
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, initializationVector);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
  } catch (err) {
    // return res.status(400).json({status: "failed", message: "An Error Occured!",error:err.message });
    console.log("error while trying to encrypt :" + err)
    return false
   
  } 
}

export async function decrypt(value){
  try {
    const encryptionKey = getenv('ENCRYPT_SECRET_KEY'); // 256-bit key
    const initializationVector = getenv('ENCRYPT_INITIALIZATION_VECTOR'); // 16-byte IV
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, initializationVector);
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;

  } catch (err) {
    // return res.status(400).json({status: "failed", message: "An Error Occured!",error:err.message });
    console.log("error while trying to decrypt :" + err)
    return false
  } 
}