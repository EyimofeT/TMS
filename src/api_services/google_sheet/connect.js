import { GoogleSpreadsheet } from "google-spreadsheet";
import fs from "fs";
import {JWT} from 'google-auth-library'
// import { getenv } from "../apis/core/helper.js";
import { getenv } from "../../core/helper.js";

const CREDENTIALS = JSON.parse(fs.readFileSync('mystreo-c0a207293412.json'))
const RESPONSE_SHEET_ID = getenv('RESPONSE_SHEET_ID')
const serviceAccountAuth = new JWT({
  email:CREDENTIALS.client_email,
  key:CREDENTIALS.private_key,
  scopes:[
    'https://www.googleapis.com/auth/spreadsheets'
  ]
})
export const doc = new GoogleSpreadsheet(RESPONSE_SHEET_ID, serviceAccountAuth)
