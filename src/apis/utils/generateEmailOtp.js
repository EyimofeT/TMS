import crypto from 'crypto'
export function generateUniqueDigitNumber(number) {
  // Generate a random 14-digit number (to allow for potential collisions)
  const random14DigitNumber = crypto.randomInt(0, 99999999999999);

  // Take the last 7 digits of the random number
  const uniqueDigitNumber = random14DigitNumber % 10000;

  return uniqueDigitNumber.toString().padStart(number, '0');
}

export function generateUniqueCode(num) {
  let code = '';
  for (let i = 0; i < num; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}