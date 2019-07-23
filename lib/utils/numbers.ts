export function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}
