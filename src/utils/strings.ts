export const numberToLetter = (number: number) => {
  let letter = "";
  while (number > 0) {
    let remainder = number % 26;
    if (remainder === 0) {
      remainder = 26;
    }
    letter = String.fromCharCode(65 + remainder - 1) + letter;
    number = (number - remainder) / 26;
  }
  return letter;
};
