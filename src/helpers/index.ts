// round progress to nearest step
export const roundToN = (x: number, n: number): number => {
  return Math.round(x / n) * n;
};

// https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
export const roundNumber = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
