import { FormBuilder, FormConfig } from './index';
import { message, Button, Typography } from 'antd';

const { Link } = Typography;

export const loginFormConfig: FormConfig = {
  layout: 'vertical',
  columns: 1,
  size: 'large',
  fields: [
    {
      name: 'emailOrMobile',
      label: 'Email or Mobile',
      type: 'emailOrMobile',
      placeholder: 'Enter your email or mobile number',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      minLength: 8,
    },
  ],
};

export const registrationFormConfig: FormConfig = {
  layout: 'vertical',
  columns: 2,
  size: 'middle',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'input',
      placeholder: 'Enter your first name',
      required: true,
      prefix: 'UserOutlined',
      span: 12,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'input',
      placeholder: 'Enter your last name',
      required: true,
      prefix: 'UserOutlined',
      span: 12,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      span: 12,
    },
    {
      name: 'mobile',
      label: 'Mobile Number',
      type: 'mobile',
      placeholder: 'Enter your mobile number',
      required: true,
      span: 12,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create a password',
      required: true,
      minLength: 8,
      tooltip: 'Password must be at least 8 characters with uppercase, lowercase and number',
      span: 12,
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true,
      dependencies: ['password'],
      rules: [
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Passwords do not match'));
          },
        }),
      ],
      span: 12,
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      placeholder: 'Select your gender',
      required: true,
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
      ],
      span: 12,
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      placeholder: 'Select your date of birth',
      required: true,
      span: 12,
    },
    {
      name: 'terms',
      label: 'I agree to the terms and conditions',
      type: 'checkbox',
      required: true,
      span: 24,
    },
  ],
};

export const profileFormConfig: FormConfig = {
  layout: 'vertical',
  columns: 2,
  fields: [
    {
      name: 'username',
      label: 'Username',
      type: 'input',
      placeholder: 'Enter username',
      required: true,
      prefix: 'UserOutlined',
      maxLength: 50,
      showCount: true,
      span: 12,
    },
    {
      name: 'displayName',
      label: 'Display Name',
      type: 'input',
      placeholder: 'Enter display name',
      required: true,
      maxLength: 100,
      span: 12,
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about yourself',
      rows: 4,
      maxLength: 500,
      showCount: true,
      span: 24,
    },
    {
      name: 'website',
      label: 'Website',
      type: 'input',
      placeholder: 'https://example.com',
      prefix: 'GlobalOutlined',
      rules: [
        {
          type: 'url',
          message: 'Please enter a valid URL',
        },
      ],
      span: 12,
    },
    {
      name: 'location',
      label: 'Location',
      type: 'input',
      placeholder: 'City, Country',
      prefix: 'EnvironmentOutlined',
      span: 12,
    },
    {
      name: 'interests',
      label: 'Interests',
      type: 'select',
      placeholder: 'Select your interests',
      mode: 'multiple',
      options: [
        { label: 'Technology', value: 'tech' },
        { label: 'Sports', value: 'sports' },
        { label: 'Music', value: 'music' },
        { label: 'Travel', value: 'travel' },
        { label: 'Reading', value: 'reading' },
        { label: 'Gaming', value: 'gaming' },
      ],
      span: 24,
    },
    {
      name: 'notifications',
      label: 'Enable Notifications',
      type: 'switch',
      defaultValue: true,
      span: 12,
    },
    {
      name: 'profileVisibility',
      label: 'Profile Visibility',
      type: 'radio',
      required: true,
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Friends Only', value: 'friends' },
        { label: 'Private', value: 'private' },
      ],
      span: 12,
    },
  ],
};

export const contactFormConfig: FormConfig = {
  layout: 'vertical',
  columns: 1,
  fields: [
    {
      name: 'name',
      label: 'Your Name',
      type: 'input',
      placeholder: 'Enter your name',
      required: true,
      prefix: 'UserOutlined',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'input',
      placeholder: 'What is this about?',
      required: true,
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      placeholder: 'Select priority',
      required: true,
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Enter your message',
      required: true,
      rows: 6,
      maxLength: 1000,
      showCount: true,
    },
  ],
};

export const otpVerificationConfig: FormConfig = {
  layout: 'vertical',
  columns: 1,
  size: 'large',
  fields: [
    {
      name: 'otp',
      label: 'Enter OTP',
      type: 'otp',
      placeholder: 'Enter 6-digit code',
      required: true,
      help: 'Please enter the OTP sent to your mobile/email',
    },
  ],
};

export const paymentFormConfig: FormConfig = {
  layout: 'vertical',
  columns: 2,
  fields: [
    {
      name: 'cardNumber',
      label: 'Card Number',
      type: 'input',
      placeholder: '1234 5678 9012 3456',
      required: true,
      prefix: 'CreditCardOutlined',
      maxLength: 19,
      span: 24,
    },
    {
      name: 'cardHolder',
      label: 'Card Holder Name',
      type: 'input',
      placeholder: 'John Doe',
      required: true,
      prefix: 'UserOutlined',
      span: 24,
    },
    {
      name: 'expiryDate',
      label: 'Expiry Date',
      type: 'input',
      placeholder: 'MM/YY',
      required: true,
      maxLength: 5,
      span: 12,
    },
    {
      name: 'cvv',
      label: 'CVV',
      type: 'password',
      placeholder: '123',
      required: true,
      maxLength: 4,
      span: 12,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      placeholder: '0.00',
      required: true,
      min: 0,
      prefix: 'DollarOutlined',
      span: 12,
    },
    {
      name: 'currency',
      label: 'Currency',
      type: 'select',
      required: true,
      defaultValue: 'USD',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'INR', value: 'INR' },
      ],
      span: 12,
    },
  ],
};

export function LoginFormExample() {
  const handleSubmit = async (values: any) => {
    console.log('Login values:', values);
    message.success('Login successful!');
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 20px' }}>
      <h2>Login</h2>
      <FormBuilder config={loginFormConfig} onSubmit={handleSubmit} submitText="Login" showReset={false} />
    </div>
  );
}

export function RegistrationFormExample() {
  const handleSubmit = async (values: any) => {
    console.log('Registration values:', values);
    message.success('Registration successful!');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h2>Create Account</h2>
      <FormBuilder config={registrationFormConfig} onSubmit={handleSubmit} submitText="Register" />
    </div>
  );
}

export function ProfileFormExample() {
  const handleSubmit = async (values: any) => {
    console.log('Profile values:', values);
    message.success('Profile updated successfully!');
  };

  const initialValues = {
    username: 'johndoe',
    displayName: 'John Doe',
    notifications: true,
    profileVisibility: 'public',
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h2>Edit Profile</h2>
      <FormBuilder
        config={profileFormConfig}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        submitText="Save Changes"
      />
    </div>
  );
}

export function ContactFormExample() {
  const handleSubmit = async (values: any) => {
    console.log('Contact values:', values);
    message.success('Message sent successfully!');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <h2>Contact Us</h2>
      <FormBuilder config={contactFormConfig} onSubmit={handleSubmit} submitText="Send Message" />
    </div>
  );
}

export const advancedFormConfig: FormConfig = {
  layout: 'vertical',
  columns: 2,
  submitButtonAlign: 'center',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'input',
      placeholder: 'Enter first name',
      defaultValue: 'John',
      required: true,
      prefix: 'UserOutlined',
      span: 12,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'input',
      placeholder: 'Enter last name',
      defaultValue: 'Doe',
      required: true,
      prefix: 'UserOutlined',
      span: 12,
    },
    {
      name: 'accountType',
      label: 'Account Type',
      type: 'select',
      required: true,
      defaultValue: 'personal',
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Business', value: 'business' },
      ],
      span: 24,
    },
    {
      name: 'businessName',
      label: 'Business Name',
      type: 'input',
      placeholder: 'Enter business name',
      required: true,
      visibleWhen: (values) => values.accountType === 'business',
      span: 24,
    },
    {
      name: 'taxId',
      label: 'Tax ID',
      type: 'input',
      placeholder: 'Enter tax ID',
      required: true,
      visibleWhen: (values) => values.accountType === 'business',
      span: 24,
    },
    {
      name: 'agreeToTerms',
      label: 'I agree to the terms and conditions',
      type: 'checkbox',
      required: true,
      span: 24,
    },
    {
      name: 'termsLink',
      label: ' ',
      type: 'custom',
      span: 24,
      render: () => (
        <div style={{ marginTop: -16 }}>
          <Link href="/terms" target="_blank">
            Read Terms and Conditions
          </Link>
        </div>
      ),
    },
  ],
};

export const disabledFieldsConfig: FormConfig = {
  layout: 'vertical',
  columns: 1,
  submitButtonAlign: 'right',
  fields: [
    {
      name: 'userId',
      label: 'User ID',
      type: 'input',
      defaultValue: 'USER-12345',
      disabled: true,
      help: 'This field cannot be modified',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      defaultValue: 'user@example.com',
      disabled: true,
      help: 'Contact support to change your email',
    },
    {
      name: 'displayName',
      label: 'Display Name',
      type: 'input',
      placeholder: 'Enter your display name',
      required: true,
      prefix: 'UserOutlined',
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about yourself',
      rows: 4,
      maxLength: 500,
      showCount: true,
    },
  ],
};

export const conditionalFormConfig: FormConfig = {
  layout: 'vertical',
  columns: 1,
  fields: [
    {
      name: 'shippingRequired',
      label: 'Requires Shipping',
      type: 'switch',
      defaultValue: false,
    },
    {
      name: 'shippingAddress',
      label: 'Shipping Address',
      type: 'textarea',
      placeholder: 'Enter shipping address',
      required: true,
      rows: 3,
      visibleWhen: (values) => values.shippingRequired === true,
    },
    {
      name: 'shippingMethod',
      label: 'Shipping Method',
      type: 'select',
      required: true,
      visibleWhen: (values) => values.shippingRequired === true,
      options: [
        { label: 'Standard (5-7 days)', value: 'standard' },
        { label: 'Express (2-3 days)', value: 'express' },
        { label: 'Overnight', value: 'overnight' },
      ],
    },
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'radio',
      required: true,
      defaultValue: 'card',
      options: [
        { label: 'Credit/Debit Card', value: 'card' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Bank Transfer', value: 'bank' },
      ],
    },
    {
      name: 'cardNumber',
      label: 'Card Number',
      type: 'input',
      placeholder: '1234 5678 9012 3456',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'card',
    },
    {
      name: 'paypalEmail',
      label: 'PayPal Email',
      type: 'email',
      placeholder: 'Enter PayPal email',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'paypal',
    },
    {
      name: 'bankAccount',
      label: 'Bank Account Number',
      type: 'input',
      placeholder: 'Enter bank account',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'bank',
    },
  ],
};

export const customFieldsConfig: FormConfig = {
  layout: 'vertical',
  columns: 1,
  fields: [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email',
    },
    {
      name: 'customAction',
      label: ' ',
      type: 'custom',
      render: (_config, form) => (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="link"
            onClick={() => {
              const email = form.getFieldValue('email');
              if (email) {
                message.info(`Sending verification to ${email}`);
              } else {
                message.warning('Please enter an email first');
              }
            }}
          >
            Send Verification Email
          </Button>
        </div>
      ),
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Create a password',
      minLength: 8,
    },
    {
      name: 'passwordStrength',
      label: ' ',
      type: 'custom',
      render: (_config, form) => (
        <div style={{ marginTop: -16, marginBottom: 16 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Password strength: {form.getFieldValue('password')?.length >= 12 ? 'Strong' : form.getFieldValue('password')?.length >= 8 ? 'Medium' : 'Weak'}
          </Typography.Text>
        </div>
      ),
    },
  ],
};

export function AdvancedFormExample() {
  const handleSubmit = async (values: any) => {
    console.log('Advanced form values:', values);
    message.success('Form submitted successfully!');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <h2>Advanced Form Features</h2>
      <p>This form demonstrates:</p>
      <ul>
        <li>Default values from config</li>
        <li>Conditional field visibility</li>
        <li>Custom components</li>
        <li>Center-aligned submit button</li>
      </ul>
      <FormBuilder
        config={advancedFormConfig}
        onSubmit={handleSubmit}
        submitText="Create Account"
      />
    </div>
  );
}

export function DisabledFieldsExample() {
  const handleSubmit = async (values: any) => {
    console.log('Updated values:', values);
    message.success('Profile updated successfully!');
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 20px' }}>
      <h2>Disabled Fields Example</h2>
      <p>Some fields are disabled and cannot be modified</p>
      <FormBuilder
        config={disabledFieldsConfig}
        onSubmit={handleSubmit}
        submitText="Update Profile"
      />
    </div>
  );
}

export function ConditionalFormExample() {
  const handleSubmit = async (values: any) => {
    console.log('Order values:', values);
    message.success('Order placed successfully!');
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 20px' }}>
      <h2>Conditional Fields Example</h2>
      <p>Fields appear and disappear based on your selections</p>
      <FormBuilder
        config={conditionalFormConfig}
        onSubmit={handleSubmit}
        submitText="Place Order"
      />
    </div>
  );
}

export function CustomFieldsExample() {
  const handleSubmit = async (values: any) => {
    console.log('Custom form values:', values);
    message.success('Registration successful!');
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 20px' }}>
      <h2>Custom Fields Example</h2>
      <p>Custom components integrated into the form</p>
      <FormBuilder
        config={customFieldsConfig}
        onSubmit={handleSubmit}
        submitText="Register"
      />
    </div>
  );
}
