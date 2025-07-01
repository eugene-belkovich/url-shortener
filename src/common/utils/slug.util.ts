import {BASE62_ALPHABET, BASE62_LENGTH, encodeBase62} from '@/common/utils/base64.util';

const generateUniqueId = (): number => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return timestamp * 1000000 + random;
};

const generateSlug = (): string => {
  try {
    const uniqueId = generateUniqueId();

    const base62String = encodeBase62(uniqueId);

    if (base62String.length >= 7) {
      return base62String.slice(-7);
    } else {
      return padString(base62String, 7);
    }
  } catch (error) {
    console.error('Error generating slug:', error);
    return generateRandomSlug(7);
  }
};

const padString = (str: string, length: number, char = BASE62_ALPHABET[0]): string => {
  if (str.length >= length) {
    return str;
  }
  const paddingLength = length - str.length;
  return char.repeat(paddingLength) + str;
};

const generateRandomSlug = (length = 7): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE62_ALPHABET[Math.floor(Math.random() * BASE62_LENGTH)];
  }
  return result;
};

const isValidSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  if (slug.length === 0 || slug.length > 7) {
    return false;
  }

  return slug.split('').every(char => BASE62_ALPHABET.includes(char));
};

export {generateSlug, isValidSlug};
