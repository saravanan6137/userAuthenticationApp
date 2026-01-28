import CryptoJS from 'crypto-js';

export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const verifyPassword = (password: string, hash: string): boolean => {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
};
