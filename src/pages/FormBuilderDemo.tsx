import { useState } from 'react';
import { Card, Tabs, message } from 'antd';
import { FormBuilder, FormConfig } from '../components/FormBuilder';

const { TabPane } = Tabs;

const loginFormConfig: FormConfig = {
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

const registrationFormConfig: FormConfig = {
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

const contactFormConfig: FormConfig = {
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

const profileFormConfig: FormConfig = {
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

function FormBuilderDemo() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any, formType: string) => {
    setLoading(true);
    console.log(`${formType} submitted:`, values);

    setTimeout(() => {
      message.success(`${formType} submitted successfully!`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>Dynamic Form Builder Demo</h1>

      <Tabs defaultActiveKey="1" size="large">
        <TabPane tab="Login Form" key="1">
          <Card>
            <FormBuilder
              config={loginFormConfig}
              onSubmit={(values) => handleSubmit(values, 'Login')}
              submitText="Login"
              showReset={false}
              loading={loading}
            />
          </Card>
        </TabPane>

        <TabPane tab="Registration Form" key="2">
          <Card>
            <FormBuilder
              config={registrationFormConfig}
              onSubmit={(values) => handleSubmit(values, 'Registration')}
              submitText="Register"
              loading={loading}
            />
          </Card>
        </TabPane>

        <TabPane tab="Contact Form" key="3">
          <Card>
            <FormBuilder
              config={contactFormConfig}
              onSubmit={(values) => handleSubmit(values, 'Contact')}
              submitText="Send Message"
              loading={loading}
            />
          </Card>
        </TabPane>

        <TabPane tab="Profile Form" key="4">
          <Card>
            <FormBuilder
              config={profileFormConfig}
              onSubmit={(values) => handleSubmit(values, 'Profile')}
              initialValues={{
                username: 'johndoe',
                displayName: 'John Doe',
                notifications: true,
                profileVisibility: 'public',
              }}
              submitText="Save Changes"
              loading={loading}
            />
          </Card>
        </TabPane>
      </Tabs>

      <Card style={{ marginTop: '30px' }}>
        <h3>Features:</h3>
        <ul>
          <li>Multiple field types: input, email, mobile, emailOrMobile, password, OTP, select, textarea, number, date, checkbox, radio, switch</li>
          <li>Built-in validation for common patterns</li>
          <li>Customizable layouts (vertical, horizontal, inline)</li>
          <li>Multi-column grid support</li>
          <li>Prefix/suffix icons</li>
          <li>Field dependencies</li>
          <li>Tooltips and help text</li>
          <li>Responsive design</li>
          <li>TypeScript support</li>
        </ul>
        <h3>Usage:</h3>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`import { FormBuilder, FormConfig } from '@/components/FormBuilder';

const formConfig: FormConfig = {
  layout: 'vertical',
  columns: 1,
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
  ],
};

<FormBuilder
  config={formConfig}
  onSubmit={handleSubmit}
/>`}
        </pre>
      </Card>
    </div>
  );
}

export default FormBuilderDemo;
