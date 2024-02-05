export function getRandomNumbers() {
    let randomNumbers = [];
    const base = 1900;
    const limit = 2024;
    for (let i = base; i <= limit; i++) {
        const randomNumber = base + Math.floor(Math.random() * (limit - base + 1));
        randomNumbers.push(randomNumber);
    }
    return randomNumbers;
}