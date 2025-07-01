const BASE62_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BASE62_LENGTH = BASE62_ALPHABET.length;

const encodeBase62 = (num: number): string => {
  if (num === 0) return BASE62_ALPHABET[0];
  let str = '';
  while (num > 0) {
    str = BASE62_ALPHABET[num % 62] + str;
    num = Math.floor(num / 62);
  }
  return str;
};

const decodeBase62 = (str: string): number => {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num = num * 62 + BASE62_ALPHABET.indexOf(str[i]);
  }
  return num;
};

export {BASE62_ALPHABET, BASE62_LENGTH, encodeBase62, decodeBase62};
