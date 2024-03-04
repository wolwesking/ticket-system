function generateRandomNumber() {
  let randomNumber = "";
  for (let i = 0; i < 8; i++) {
    const digit = Math.floor(Math.random() * 10); // Generates a random digit between 0 and 9
    randomNumber += digit;
  }
  return randomNumber;
}

const random8DigitNumber = generateRandomNumber();

module.exports = random8DigitNumber;
