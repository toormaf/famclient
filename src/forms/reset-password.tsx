import { useState } from 'react';
import { FormConfig } from '../components/FormBuilder';

export const useResetPasswordForm = () => {
  const [codeSent, setCodeSent] = useState(false);

  const resetPasswordFormConfig: FormConfig = {
    layout: 'vertical',
    columns: 1,
    size: 'large',
    submitButtonAlign: 'center',
    fields: [
      {
        name: 'emailOrMobile',
        label: 'Email or Mobile',
        type: 'emailOrMobile',
        placeholder: 'Enter your email or mobile number',
        required: true,
        disabled: codeSent,
      },
      {
        name: 'verificationCode',
        label: 'Verification Code',
        type: 'otp',
        placeholder: 'Enter 6-digit code',
        required: codeSent,
        help: 'Please enter the verification code sent to your email/mobile',
        visibleWhen: () => codeSent,
      },
      {
        name: 'newPassword',
        label: 'New Password',
        type: 'password',
        placeholder: 'Enter new password',
        required: codeSent,
        minLength: 8,
        tooltip: 'Password must be at least 8 characters',
        visibleWhen: () => codeSent,
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Confirm new password',
        required: codeSent,
        dependencies: ['newPassword'],
        visibleWhen: () => codeSent,
        rules: [
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ],
      },
    ],
  };

  return {
    resetPasswordFormConfig,
    codeSent,
    setCodeSent,
  };
};
