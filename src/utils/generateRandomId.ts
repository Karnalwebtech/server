export function generateRandomId(): string {
  const length: number = 8;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const rendomindex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(rendomindex);
  }
  return result;
}
