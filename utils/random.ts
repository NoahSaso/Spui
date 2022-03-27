export const randomString = (chars: string, len: number): string =>
  [...Array(len)].map(() => chars[Math.floor(Math.random() * len)]).join("")
