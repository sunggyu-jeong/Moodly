import CryptoJS from 'crypto-js';
import { ENV } from '../trigger/env';

const { ENCRYPTION_SECRET_KEY } = ENV;
const isBase64 = (str: string) => {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};

export const decryptData = (ciphertext: string) => {
  if (!ciphertext) return null;

  if (!isBase64(ciphertext)) {
    return ciphertext;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) return null;

    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    return ciphertext;
  }
};