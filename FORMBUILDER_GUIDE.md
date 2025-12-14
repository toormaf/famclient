# Dynamic Form Builder - Complete Guide

## Overview

A powerful, flexible form builder component that generates fully functional forms from JSON configuration with comprehensive validation support.

## Quick Start

```tsx
import { FormBuilder, FormConfig } from '@/components/FormBuilder';
import { message } from 'antd';

const formConfig: FormConfig = {
  layout: 'vertical',
  columns: 1,
  fields: [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
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

function MyForm() {
  const handleSubmit = async (values: any) => {
    console.log('Form values:', values);
    message.success('Form submitted!');
  };

  return <FormBuilder config={formConfig} onSubmit={handleSubmit} />;
}
```

## Field Types

### 1. EmailOrMobile
Accepts either email or mobile number with automatic validation.

```tsx
{
  name: 'loginId',
  label: 'Email or Mobile',
  type: 'emailOrMobile',
  placeholder: 'Enter email or mobile number',
  required: true,
}
```

### 2. Email
Standard email input with validation.

```tsx
{
  name: 'email',
  label: 'Email Address',
  type: 'email',
  placeholder: 'Enter your email',
  required: true,
  prefix: 'MailOutlined',
}
```

### 3. Mobile
Mobile number input with international format support.

```tsx
{
  name: 'phone',
  label: 'Phone Number',
  type: 'mobile',
  placeholder: '+1234567890',
  required: true,
  prefix: 'PhoneOutlined',
}
```

### 4. Password
Secure password input with strength validation.

```tsx
{
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Create password',
  required: true,
  minLength: 8,
  tooltip: 'Must contain uppercase, lowercase, and number',
}
```

### 5. OTP
One-time password input optimized for verification codes.

```tsx
{
  name: 'otp',
  label: 'Enter OTP',
  type: 'otp',
  placeholder: 'Enter 6-digit code',
  required: true,
  help: 'Code sent to your mobile',
}
```

### 6. Select
Dropdown selection with single or multiple options.

```tsx
{
  name: 'country',
  label: 'Country',
  type: 'select',
  placeholder: 'Select country',
  required: true,
  options: [
    { label: 'USA', value: 'us' },
    { label: 'UK', value: 'uk' },
    { label: 'India', value: 'in' },
  ],
}
```

Multi-select:
```tsx
{
  name: 'interests',
  label: 'Interests',
  type: 'select',
  mode: 'multiple',
  placeholder: 'Select interests',
  options: [
    { label: 'Technology', value: 'tech' },
    { label: 'Sports', value: 'sports' },
  ],
}
```

### 7. Textarea
Multi-line text input with character count.

```tsx
{
  name: 'message',
  label: 'Message',
  type: 'textarea',
  placeholder: 'Enter your message',
  rows: 6,
  maxLength: 500,
  showCount: true,
}
```

### 8. Number
Numeric input with min/max constraints.

```tsx
{
  name: 'age',
  label: 'Age',
  type: 'number',
  placeholder: 'Enter age',
  required: true,
  min: 18,
  max: 100,
}
```

### 9. Date
Date picker with format support.

```tsx
{
  name: 'dateOfBirth',
  label: 'Date of Birth',
  type: 'date',
  placeholder: 'Select date',
  required: true,
}
```

### 10. Checkbox
Single checkbox for boolean values.

```tsx
{
  name: 'terms',
  label: 'I agree to terms and conditions',
  type: 'checkbox',
  required: true,
}
```

### 11. Radio
Radio button group for single selection.

```tsx
{
  name: 'gender',
  label: 'Gender',
  type: 'radio',
  required: true,
  options: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ],
}
```

### 12. Switch
Toggle switch for boolean values.

```tsx
{
  name: 'notifications',
  label: 'Enable Notifications',
  type: 'switch',
  defaultValue: true,
}
```

### 13. Input (Basic)
Standard text input.

```tsx
{
  name: 'username',
  label: 'Username',
  type: 'input',
  placeholder: 'Enter username',
  required: true,
  prefix: 'UserOutlined',
  maxLength: 50,
  showCount: true,
}
```

## Layout Options

### Single Column Layout
```tsx
const config: FormConfig = {
  layout: 'vertical',
  columns: 1,
  fields: [...],
};
```

### Two Column Layout
```tsx
const config: FormConfig = {
  layout: 'vertical',
  columns: 2,
  fields: [
    { name: 'firstName', type: 'input', span: 12 },
    { name: 'lastName', type: 'input', span: 12 },
    { name: 'email', type: 'email', span: 24 }, // Full width
  ],
};
```

### Horizontal Layout
```tsx
const config: FormConfig = {
  layout: 'horizontal',
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  fields: [...],
};
```

### Inline Layout
```tsx
const config: FormConfig = {
  layout: 'inline',
  fields: [...],
};
```

## Validation

### Built-in Validation
```tsx
{
  name: 'email',
  type: 'email', // Auto email validation
  required: true, // Required field
  minLength: 5,   // Minimum length
  maxLength: 100, // Maximum length
}
```

### Custom Validation Rules
```tsx
{
  name: 'username',
  label: 'Username',
  type: 'input',
  rules: [
    { required: true, message: 'Username is required' },
    { min: 3, message: 'Minimum 3 characters' },
    { max: 20, message: 'Maximum 20 characters' },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Only letters, numbers and underscore'
    },
  ],
}
```

### Field Dependencies
```tsx
{
  name: 'confirmPassword',
  label: 'Confirm Password',
  type: 'password',
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
}
```

## Advanced Features

### Icons
```tsx
{
  name: 'email',
  type: 'email',
  prefix: 'MailOutlined', // Ant Design icon name as string
}

// Or use React component
import { MailOutlined } from '@ant-design/icons';

{
  name: 'email',
  type: 'email',
  prefix: <MailOutlined />,
}
```

### Tooltips
```tsx
{
  name: 'password',
  label: 'Password',
  type: 'password',
  tooltip: 'Password must be at least 8 characters with uppercase, lowercase and number',
}
```

### Help Text
```tsx
{
  name: 'otp',
  type: 'otp',
  help: 'Please enter the 6-digit code sent to your device',
}
```

### Initial Values
```tsx
<FormBuilder
  config={formConfig}
  onSubmit={handleSubmit}
  initialValues={{
    username: 'johndoe',
    email: 'john@example.com',
    notifications: true,
  }}
/>
```

### Loading State
```tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async (values: any) => {
  setLoading(true);
  try {
    await api.submit(values);
  } finally {
    setLoading(false);
  }
};

<FormBuilder
  config={formConfig}
  onSubmit={handleSubmit}
  loading={loading}
/>
```

### Value Change Listener
```tsx
<FormBuilder
  config={formConfig}
  onSubmit={handleSubmit}
  onValuesChange={(changed, all) => {
    console.log('Changed:', changed);
    console.log('All values:', all);
  }}
/>
```

### Custom Submit/Reset Buttons
```tsx
<FormBuilder
  config={formConfig}
  onSubmit={handleSubmit}
  submitText="Create Account"
  resetText="Clear Form"
  showReset={true}
/>
```

## Complete Examples

### Login Form
```tsx
const loginConfig: FormConfig = {
  layout: 'vertical',
  size: 'large',
  fields: [
    {
      name: 'emailOrMobile',
      label: 'Email or Mobile',
      type: 'emailOrMobile',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      minLength: 8,
    },
  ],
};

<FormBuilder
  config={loginConfig}
  onSubmit={handleLogin}
  submitText="Login"
  showReset={false}
/>
```

### Registration Form
```tsx
const registrationConfig: FormConfig = {
  layout: 'vertical',
  columns: 2,
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'input',
      required: true,
      prefix: 'UserOutlined',
      span: 12,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'input',
      required: true,
      prefix: 'UserOutlined',
      span: 12,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      span: 12,
    },
    {
      name: 'mobile',
      label: 'Mobile',
      type: 'mobile',
      required: true,
      span: 12,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      minLength: 8,
      span: 12,
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
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
  ],
};
```

### Contact Form
```tsx
const contactConfig: FormConfig = {
  layout: 'vertical',
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'input',
      required: true,
      prefix: 'UserOutlined',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'input',
      required: true,
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      rows: 6,
      maxLength: 1000,
      showCount: true,
    },
  ],
};
```

## API Reference

### FormConfig Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| fields | FieldConfig[] | required | Array of field configurations |
| layout | 'vertical' \| 'horizontal' \| 'inline' | 'vertical' | Form layout |
| columns | 1 \| 2 \| 3 \| 4 | 1 | Number of columns in grid |
| size | 'small' \| 'middle' \| 'large' | 'middle' | Form size |
| labelCol | { span: number } | - | Label column span (horizontal) |
| wrapperCol | { span: number } | - | Wrapper column span (horizontal) |
| className | string | - | Custom CSS class |
| style | CSSProperties | - | Custom inline styles |

### FieldConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| name | string | Field name (required) |
| type | FieldType | Field type (required) |
| label | string | Field label |
| placeholder | string | Placeholder text |
| required | boolean | Is required |
| disabled | boolean | Is disabled |
| hidden | boolean | Hide field |
| prefix | ReactNode \| string | Prefix icon |
| suffix | ReactNode \| string | Suffix icon |
| rules | Rule[] | Validation rules |
| options | SelectOption[] | Options for select/radio |
| span | number | Column span (1-24) |
| tooltip | string | Tooltip text |
| help | string | Help text below field |
| maxLength | number | Max character length |
| minLength | number | Min character length |
| min | number | Min value (number type) |
| max | number | Max value (number type) |
| rows | number | Rows for textarea |
| defaultValue | any | Default value |
| dependencies | string[] | Dependent field names |
| mode | 'multiple' \| 'tags' | Select mode |
| allowClear | boolean | Show clear button |
| showCount | boolean | Show character count |

### FormBuilderProps

| Property | Type | Description |
|----------|------|-------------|
| config | FormConfig | Form configuration (required) |
| onSubmit | (values) => void \| Promise<void> | Submit handler (required) |
| onValuesChange | (changed, all) => void | Value change handler |
| initialValues | Record<string, any> | Initial form values |
| submitText | string | Submit button text |
| resetText | string | Reset button text |
| showReset | boolean | Show reset button |
| loading | boolean | Loading state |
| disabled | boolean | Disable entire form |

## Tips and Best Practices

1. Use `emailOrMobile` for flexible login forms
2. Always set `required: true` for mandatory fields
3. Use `tooltip` for password requirements
4. Set `maxLength` and `showCount` for text inputs
5. Use `dependencies` for related fields (e.g., password confirmation)
6. Configure `span` for custom column layouts
7. Use `help` text for additional field guidance
8. Set appropriate `min` and `max` for number fields
9. Use `mode: 'multiple'` for multi-select dropdowns
10. Add custom `rules` for complex validation

## Demo

To see the FormBuilder in action, check out:
- `/src/pages/FormBuilderDemo.tsx` - Live demo with multiple form examples
- `/src/components/FormBuilder/examples.tsx` - Code examples
- `/src/components/FormBuilder/README.md` - Component documentation

## Files

- `src/components/FormBuilder/types.ts` - TypeScript types
- `src/components/FormBuilder/validators.ts` - Validation utilities
- `src/components/FormBuilder/FieldRenderer.tsx` - Field rendering logic
- `src/components/FormBuilder/FormBuilder.tsx` - Main component
- `src/components/FormBuilder/FormBuilder.css` - Styles
- `src/components/FormBuilder/examples.tsx` - Usage examples
