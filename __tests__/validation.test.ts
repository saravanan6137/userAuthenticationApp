import { validationRules } from '../src/config/formConfig';

describe('Signup Form Validation - Unit Tests', () => {
  describe('Name Validation', () => {
    const validateName = validationRules.required('Name');

    it('should pass validation with valid name', () => {
      const result = validateName('John Doe');
      expect(result).toBeUndefined();
    });

    it('should fail validation with empty name', () => {
      const result = validateName('');
      expect(result).toBe('Name is required');
    });

    it('should fail validation with whitespace only', () => {
      const result = validateName('   ');
      expect(result).toBe('Name is required');
    });

    it('should pass validation with single character name', () => {
      const result = validateName('A');
      expect(result).toBeUndefined();
    });

    it('should pass validation with name containing spaces', () => {
      const result = validateName('Mary Jane Watson');
      expect(result).toBeUndefined();
    });
  });

  describe('Email Validation', () => {
    const validateEmail = validationRules.email;

    it('should pass validation with valid email', () => {
      const result = validateEmail('test@example.com');
      expect(result).toBeUndefined();
    });

    it('should fail validation with empty email', () => {
      const result = validateEmail('');
      expect(result).toBe('Email is required');
    });

    it('should fail validation with whitespace only', () => {
      const result = validateEmail('   ');
      expect(result).toBe('Email is required');
    });

    it('should fail validation without @ symbol', () => {
      const result = validateEmail('invalidemail.com');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should fail validation without domain', () => {
      const result = validateEmail('user@');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should fail validation without extension', () => {
      const result = validateEmail('user@domain');
      expect(result).toBe('Please enter a valid email address');
    });

    it('should pass validation with subdomain', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result).toBeUndefined();
    });

    it('should pass validation with plus sign', () => {
      const result = validateEmail('user+tag@example.com');
      expect(result).toBeUndefined();
    });

    it('should pass validation with numbers', () => {
      const result = validateEmail('user123@example.com');
      expect(result).toBeUndefined();
    });

    it('should trim whitespace before validation', () => {
      const result = validateEmail('  test@example.com  ');
      expect(result).toBeUndefined();
    });
  });

  describe('Password Validation', () => {
    const validatePassword = validationRules.minLength(6, 'Password');

    it('should pass validation with valid password (6 characters)', () => {
      const result = validatePassword('abcdef');
      expect(result).toBeUndefined();
    });

    it('should pass validation with longer password', () => {
      const result = validatePassword('password123');
      expect(result).toBeUndefined();
    });

    it('should fail validation with empty password', () => {
      const result = validatePassword('');
      expect(result).toBe('Password is required');
    });

    it('should fail validation with whitespace only', () => {
      const result = validatePassword('   ');
      expect(result).toBe('Password is required');
    });

    it('should fail validation with less than 6 characters', () => {
      const result = validatePassword('12345');
      expect(result).toBe('Password must be at least 6 characters');
    });

    it('should pass validation with exactly 6 characters', () => {
      const result = validatePassword('123456');
      expect(result).toBeUndefined();
    });

    it('should pass validation with special characters', () => {
      const result = validatePassword('P@ssw0rd!');
      expect(result).toBeUndefined();
    });

    it('should count spaces in password length', () => {
      const result = validatePassword('12 45');
      expect(result).toBe('Password must be at least 6 characters');
    });
  });

  describe('Complete Signup Form Validation', () => {
    const signupFields = {
      name: validationRules.required('Name'),
      email: validationRules.email,
      password: validationRules.minLength(6, 'Password'),
    };

    it('should validate all fields pass', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const errors = {
        name: signupFields.name(formData.name),
        email: signupFields.email(formData.email),
        password: signupFields.password(formData.password),
      };

      expect(errors.name).toBeUndefined();
      expect(errors.email).toBeUndefined();
      expect(errors.password).toBeUndefined();
    });

    it('should validate all fields fail when empty', () => {
      const formData = {
        name: '',
        email: '',
        password: '',
      };

      const errors = {
        name: signupFields.name(formData.name),
        email: signupFields.email(formData.email),
        password: signupFields.password(formData.password),
      };

      expect(errors.name).toBe('Name is required');
      expect(errors.email).toBe('Email is required');
      expect(errors.password).toBe('Password is required');
    });

    it('should validate mixed valid and invalid fields', () => {
      const formData = {
        name: 'Alice Johnson',
        email: 'invalid-email',
        password: '12345',
      };

      const errors = {
        name: signupFields.name(formData.name),
        email: signupFields.email(formData.email),
        password: signupFields.password(formData.password),
      };

      expect(errors.name).toBeUndefined();
      expect(errors.email).toBe('Please enter a valid email address');
      expect(errors.password).toBe('Password must be at least 6 characters');
    });
  });
});
