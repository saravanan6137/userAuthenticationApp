import { hashPassword, verifyPassword } from '../src/utils/crypto';

describe('Password Utilities - Unit Tests', () => {
  describe('hashPassword', () => {
    it('should hash a password', () => {
      const password = 'testPassword123';
      const hashed = hashPassword(password);

      expect(hashed).toBeTruthy();
      expect(hashed).not.toBe(password);
      expect(typeof hashed).toBe('string');
    });

    it('should generate consistent hash for same password', () => {
      const password = 'myPassword';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different passwords', () => {
      const password1 = 'password1';
      const password2 = 'password2';
      const hash1 = hashPassword(password1);
      const hash2 = hashPassword(password2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = hashPassword('');
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
    });

    it('should handle special characters', () => {
      const password = 'P@ssw0rd!#$%';
      const hash = hashPassword(password);

      expect(hash).toBeTruthy();
      expect(hash).not.toBe(password);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', () => {
      const password = 'correctPassword';
      const hash = hashPassword(password);
      const isValid = verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', () => {
      const password = 'correctPassword';
      const wrongPassword = 'wrongPassword';
      const hash = hashPassword(password);
      const isValid = verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it('should be case sensitive', () => {
      const password = 'Password123';
      const hash = hashPassword(password);
      const isValid = verifyPassword('password123', hash);

      expect(isValid).toBe(false);
    });

    it('should reject empty password against valid hash', () => {
      const password = 'myPassword';
      const hash = hashPassword(password);
      const isValid = verifyPassword('', hash);

      expect(isValid).toBe(false);
    });
  });
});
