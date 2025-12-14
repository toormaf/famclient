import { Rule } from 'antd/es/form';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const mobileRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
export const otpRegex = /^\d{4,6}$/;

export const validators = {
  email: (): Rule => ({
    pattern: emailRegex,
    message: 'Please enter a valid email address',
  }),

  mobile: (): Rule => ({
    validator: async (_, value) => {
      if (!value) return Promise.resolve();

      try {
        if (isValidPhoneNumber(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Please enter a valid mobile number'));
      } catch {
        if (mobileRegex.test(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Please enter a valid mobile number'));
      }
    },
  }),

  emailOrMobile: (): Rule => ({
    validator: async (_, value) => {
      if (!value) return Promise.resolve();

      const isEmail = emailRegex.test(value);

      if (isEmail) {
        return Promise.resolve();
      }

      try {
        if (isValidPhoneNumber(value)) {
          return Promise.resolve();
        }
      } catch {
        if (mobileRegex.test(value)) {
          return Promise.resolve();
        }
      }

      return Promise.reject(new Error('Please enter a valid email or mobile number'));
    },
  }),

  otp: (): Rule => ({
    pattern: otpRegex,
    message: 'Please enter a valid OTP (4-6 digits)',
  }),

  required: (fieldName: string = 'This field'): Rule => ({
    required: true,
    message: `${fieldName} is required`,
  }),

  minLength: (min: number): Rule => ({
    min,
    message: `Must be at least ${min} characters`,
  }),

  maxLength: (max: number): Rule => ({
    max,
    message: `Must be no more than ${max} characters`,
  }),

  pattern: (pattern: RegExp, message: string): Rule => ({
    pattern,
    message,
  }),

  password: (minLength: number = 8): Rule[] => [
    validators.required('Password'),
    validators.minLength(minLength),
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain uppercase, lowercase and number',
    },
  ],

  confirmPassword: (): Rule => ({
    validator: async (_, value) => {
      if (!value) {
        return Promise.resolve();
      }
      return Promise.resolve();
    },
  }),

  url: (): Rule => ({
    type: 'url',
    message: 'Please enter a valid URL',
  }),

  number: (min?: number, max?: number): Rule[] => {
    const rules: Rule[] = [
      {
        type: 'number',
        message: 'Please enter a valid number',
      },
    ];

    if (min !== undefined) {
      rules.push({
        type: 'number',
        min,
        message: `Must be at least ${min}`,
      });
    }

    if (max !== undefined) {
      rules.push({
        type: 'number',
        max,
        message: `Must be no more than ${max}`,
      });
    }

    return rules;
  },
};

export const buildFieldRules = (config: {
  required?: boolean;
  label?: string;
  type?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  customRules?: Rule[];
}): Rule[] => {
  const rules: Rule[] = [];

  if (config.required) {
    rules.push(validators.required(config.label || 'This field'));
  }

  switch (config.type) {
    case 'email':
      rules.push(validators.email());
      break;
    case 'mobile':
      rules.push(validators.mobile());
      break;
    case 'emailOrMobile':
      rules.push(validators.emailOrMobile());
      break;
    case 'otp':
      rules.push(validators.otp());
      break;
    case 'password':
      rules.push(...validators.password(config.minLength));
      break;
    case 'number':
      rules.push(...validators.number(config.min, config.max));
      break;
  }

  if (config.minLength) {
    rules.push(validators.minLength(config.minLength));
  }

  if (config.maxLength) {
    rules.push(validators.maxLength(config.maxLength));
  }

  if (config.pattern) {
    rules.push(validators.pattern(config.pattern, 'Invalid format'));
  }

  if (config.customRules) {
    rules.push(...config.customRules);
  }

  return rules;
};
