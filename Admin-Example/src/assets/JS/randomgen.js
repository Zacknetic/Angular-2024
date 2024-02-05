export function getRandomNumbers() {
  let randomNumbers = [];
  const base = 100;
  const limit = base * 10 - 1;
  for (let i = 0; i < base; i++) {
    const randomNumber = Math.floor(Math.random() * limit) + 1;
    randomNumbers.push(randomNumber);
  }
  return randomNumbers;
}
