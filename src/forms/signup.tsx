import { useState } from 'react';
import { FormConfig } from '../components/FormBuilder';

export const useSignupForm = () => {
  const [otpSent, setOtpSent] = useState(false);

  const signupFormConfig: FormConfig = {
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
        disabled: otpSent,
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a password',
        required: true,
        minLength: 8,
        disabled: otpSent,
        tooltip: 'Password must be at least 8 characters',
      },
      {
        name: 'otp',
        label: 'Verification Code',
        type: 'otp',
        placeholder: 'Enter 6-digit code',
        required: otpSent,
        help: 'Please enter the OTP sent to your email/mobile',
        visibleWhen: () => otpSent,
      },
    ],
  };

  return {
    signupFormConfig,
    otpSent,
    setOtpSent,
  };
};
