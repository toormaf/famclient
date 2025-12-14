# Dynamic Form Builder

A powerful, flexible form builder component for React that generates forms from JSON configuration with full validation support.

## Features

- Multiple field types: input, email, mobile, emailOrMobile, password, OTP, select, textarea, number, date, checkbox, radio, switch
- Built-in validation for common patterns
- Customizable layouts (vertical, horizontal, inline)
- Multi-column grid support
- Prefix/suffix icons
- Field dependencies
- Tooltips and help text
- Responsive design
- TypeScript support

## Installation

The component is already integrated into your project. Import it:

```tsx
import { FormBuilder, FormConfig } from '@/components/FormBuilder';
```

## Basic Usage

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

### Input
```tsx
{
  name: 'username',
  label: 'Username',
  type: 'input',
  placeholder: 'Enter username',
  required: true,
  prefix: 'UserOutlined',
  maxLength: 50,
}
```

### Email
```tsx
{
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true,
}
```

### Mobile
```tsx
{
  name: 'phone',
  label: 'Phone Number',
  type: 'mobile',
  required: true,
}
```

### Email or Mobile
```tsx
{
  name: 'emailOrMobile',
  label: 'Email or Mobile',
  type: 'emailOrMobile',
  required: true,
}
```

### Password
```tsx
{
  name: 'password',
  label: 'Password',
  type: 'password',
  required: true,
  minLength: 8,
  tooltip: 'Password must contain uppercase, lowercase and number',
}
```

### OTP
```tsx
{
  name: 'otp',
  label: 'Enter OTP',
  type: 'otp',
  required: true,
  help: 'Please enter the 6-digit code sent to your device',
}
```

### Select
```tsx
{
  name: 'country',
  label: 'Country',
  type: 'select',
  required: true,
  options: [
    { label: 'USA', value: 'us' },
    { label: 'UK', value: 'uk' },
    { label: 'India', value: 'in' },
  ],
}
```

### Multi-Select
```tsx
{
  name: 'interests',
  label: 'Interests',
  type: 'select',
  mode: 'multiple',
  options: [
    { label: 'Technology', value: 'tech' },
    { label: 'Sports', value: 'sports' },
  ],
}
```

### Textarea
```tsx
{
  name: 'message',
  label: 'Message',
  type: 'textarea',
  rows: 6,
  maxLength: 500,
  showCount: true,
}
```

### Number
```tsx
{
  name: 'age',
  label: 'Age',
  type: 'number',
  required: true,
  min: 18,
  max: 100,
}
```

### Date
```tsx
{
  name: 'dateOfBirth',
  label: 'Date of Birth',
  type: 'date',
  required: true,
}
```

### Checkbox
```tsx
{
  name: 'terms',
  label: 'I agree to terms and conditions',
  type: 'checkbox',
  required: true,
}
```

### Radio
```tsx
{
  name: 'gender',
  label: 'Gender',
  type: 'radio',
  required: true,
  options: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ],
}
```

### Switch
```tsx
{
  name: 'notifications',
  label: 'Enable Notifications',
  type: 'switch',
  defaultValue: true,
}
```

## Layout Options

### Single Column
```tsx
const config: FormConfig = {
  layout: 'vertical',
  columns: 1,
  fields: [...],
};
```

### Two Columns
```tsx
const config: FormConfig = {
  layout: 'vertical',
  columns: 2,
  fields: [
    { name: 'firstName', ..., span: 12 },
    { name: 'lastName', ..., span: 12 },
  ],
};
```

### Custom Spans
```tsx
{
  name: 'fullWidth',
  span: 24, // Full width
}
```

## Validation

### Built-in Validation
```tsx
{
  name: 'email',
  type: 'email', // Auto email validation
  required: true, // Required field
  minLength: 5,
  maxLength: 100,
}
```

### Custom Rules
```tsx
{
  name: 'username',
  label: 'Username',
  type: 'input',
  rules: [
    { required: true, message: 'Username is required' },
    { min: 3, message: 'Username must be at least 3 characters' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers and underscore' },
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
  prefix: 'MailOutlined', // Ant Design icon name
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
  help: 'Please enter the code sent to your device',
}
```

### Initial Values
```tsx
<FormBuilder
  config={formConfig}
  onSubmit={handleSubmit}
  initialValues={{
    username: 'johndoe',
    notifications: true,
  }}
/>
```

### Loading State
```tsx
<FormBuilder
  config={formConfig}
  onSubmit={handleSubmit}
  loading={isLoading}
/>
```

### Custom Submit Button
```tsx
<FormBuilder
  config={formConfig}
  onSubmit={handleSubmit}
  submitText="Create Account"
  showReset={false}
/>
```

### Value Changes
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

## Complete Examples

See `examples.tsx` for full working examples:
- Login Form
- Registration Form
- Profile Form
- Contact Form
- OTP Verification
- Payment Form

## TypeScript Support

All types are exported:

```tsx
import {
  FormBuilder,
  FormConfig,
  FieldConfig,
  FieldType,
  FormBuilderProps,
} from '@/components/FormBuilder';
```

## API Reference

### FormConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| fields | FieldConfig[] | required | Array of field configurations |
| layout | 'vertical' \| 'horizontal' \| 'inline' | 'vertical' | Form layout |
| columns | 1 \| 2 \| 3 \| 4 | 1 | Number of columns |
| size | 'small' \| 'middle' \| 'large' | 'middle' | Form size |
| labelCol | { span: number } | - | Label column span |
| wrapperCol | { span: number } | - | Wrapper column span |

### FieldConfig

| Property | Type | Description |
|----------|------|-------------|
| name | string | Field name (required) |
| label | string | Field label |
| type | FieldType | Field type (required) |
| placeholder | string | Placeholder text |
| required | boolean | Is field required |
| disabled | boolean | Is field disabled |
| hidden | boolean | Hide field |
| prefix | ReactNode \| string | Prefix icon |
| suffix | ReactNode \| string | Suffix icon |
| rules | Rule[] | Custom validation rules |
| options | SelectOption[] | Options for select/radio |
| span | number | Column span (out of 24) |
| tooltip | string | Tooltip text |
| help | string | Help text |
| maxLength | number | Maximum length |
| minLength | number | Minimum length |
| min | number | Minimum value (for number) |
| max | number | Maximum value (for number) |
| rows | number | Rows for textarea |
| defaultValue | any | Default value |
| dependencies | string[] | Dependent fields |
| mode | 'multiple' \| 'tags' | Select mode |
| allowClear | boolean | Show clear button |
| showCount | boolean | Show character count |

### FormBuilderProps

| Property | Type | Description |
|----------|------|-------------|
| config | FormConfig | Form configuration (required) |
| onSubmit | (values: any) => void \| Promise<void> | Submit handler (required) |
| onValuesChange | (changed: any, all: any) => void | Value change handler |
| initialValues | Record<string, any> | Initial form values |
| submitText | string | Submit button text |
| resetText | string | Reset button text |
| showReset | boolean | Show reset button |
| loading | boolean | Loading state |
| disabled | boolean | Disable entire form |
