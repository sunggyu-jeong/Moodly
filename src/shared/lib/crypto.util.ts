import CryptoJS from 'crypto-js';

import { ENV } from '@/shared/lib/env';
import { isEmpty } from '@/shared/lib/value.util';

const { ENCRYPTION_SECRET_KEY } = ENV;

export const encryptData = <T>(data: T) => {
  try {
    if (isEmpty(data)) {
      throw new Error('Data to encrypt cannot be empty');
    }
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_SECRET_KEY ?? '',
    ).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

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
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET_KEY ?? '');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  } catch {
    return ciphertext;
  }
};
