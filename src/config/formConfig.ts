import { KeyboardTypeOptions, ImageSourcePropType } from 'react-native';
import { images } from '../assets/images';

export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  validation?: (
    value: string,
    formValues?: Record<string, string>,
  ) => string | undefined;
}

export interface AuthScreenConfig {
  title: string;
  subtitle: string;
  icon: string | ImageSourcePropType;
  submitButtonText: string;
  footerText: string;
  footerLinkText: string;
  footerLinkScreen: string;
  fields: FormFieldConfig[];
}

// Validation rules
export const validationRules = {
  required: (fieldName: string) => (value: string) =>
    value.trim() ? undefined : `${fieldName} is required`,

  email: (value: string) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim())
      ? undefined
      : 'Please enter a valid email address';
  },

  minLength: (min: number, fieldName: string) => (value: string) => {
    if (!value.trim()) return `${fieldName} is required`;
    return value.length >= min
      ? undefined
      : `${fieldName} must be at least ${min} characters`;
  },

  compose:
    (...validators: ((value: string) => string | undefined)[]) =>
    (value: string) => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return undefined;
    },
};

// Login screen configuration
export const loginScreenConfig: AuthScreenConfig = {
  title: 'Welcome Back',
  subtitle: 'Sign in to continue',
  icon: images.loginIcon, // Use image instead of emoji
  submitButtonText: 'Login',
  footerText: "Don't have an account?",
  footerLinkText: 'Sign Up',
  footerLinkScreen: 'Signup',
  fields: [
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      keyboardType: 'email-address',
      validation: validationRules.email,
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      isPassword: true,
      validation: validationRules.minLength(6, 'Password'),
    },
  ],
};

// Signup screen configuration
export const signupScreenConfig: AuthScreenConfig = {
  title: 'Create Account',
  subtitle: 'Sign up to get started',
  icon: images.signupIcon, // Use image instead of emoji
  submitButtonText: 'Sign Up',
  footerText: 'Already have an account?',
  footerLinkText: 'Login',
  footerLinkScreen: 'Login',
  fields: [
    {
      name: 'name',
      label: 'Name',
      placeholder: 'Enter your full name',
      validation: validationRules.required('Name'),
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      keyboardType: 'email-address',
      validation: validationRules.email,
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Create a password (min 6 characters)',
      isPassword: true,
      validation: validationRules.minLength(6, 'Password'),
    },
  ],
};
