# EmailPhoneInput Component

A versatile React component that supports both email and phone number input with built-in validation.

## Features

- Toggle between email and phone input modes
- Real-time validation for both email and phone numbers
- International phone number support with country selection
- Integrates seamlessly with Ant Design
- TypeScript support
- Custom styling support

## Installation

The component uses the following dependencies:
- `react-phone-number-input` - For phone number input and formatting
- `libphonenumber-js` - For phone number validation
- `antd` - For UI components

## Usage

```tsx
import { useState } from 'react';
import { EmailPhoneInput } from '../components';

function MyComponent() {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  return (
    <EmailPhoneInput
      value={value}
      onChange={setValue}
      onValidationChange={setIsValid}
      defaultType="email"
      placeholder="Enter your contact information"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | The current value of the input |
| `onChange` | `(value: string) => void` | - | Callback fired when the value changes |
| `placeholder` | `string` | `'Enter your email'` or `'Enter your phone number'` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `defaultType` | `'email' \| 'phone'` | `'email'` | The default input type |
| `onValidationChange` | `(isValid: boolean) => void` | - | Callback fired when validation status changes |

## Validation

The component includes built-in validation:

### Email Validation
- Checks for valid email format using regex
- Pattern: `name@domain.extension`

### Phone Validation
- Uses `libphonenumber-js` for accurate international phone number validation
- Supports all country codes and formats
- Validates number format based on selected country

## Examples

### Basic Usage
```tsx
<EmailPhoneInput
  value={contactInfo}
  onChange={setContactInfo}
/>
```

### With Validation Feedback
```tsx
<EmailPhoneInput
  value={contactInfo}
  onChange={setContactInfo}
  onValidationChange={(valid) => {
    setIsValid(valid);
    console.log('Is valid:', valid);
  }}
/>
```

### With Form Integration
```tsx
<Form.Item label="Contact Information" required>
  <EmailPhoneInput
    value={contactValue}
    onChange={setContactValue}
    onValidationChange={setIsValid}
  />
</Form.Item>
```

### Phone Mode by Default
```tsx
<EmailPhoneInput
  value={phoneNumber}
  onChange={setPhoneNumber}
  defaultType="phone"
  placeholder="Enter your mobile number"
/>
```

## Styling

The component includes custom CSS for seamless integration with Ant Design. You can override styles by targeting these classes:

- `.email-phone-input` - Main container
- `.react-phone-number-input__input` - Phone input field
- `.react-phone-number-input__country` - Country selector
- `.ant-input-status-error` - Error state styling

## Notes

- The component automatically clears the input when switching between email and phone modes
- Phone numbers are stored in international E.164 format (e.g., +1234567890)
- Email validation is performed client-side using regex
- Phone validation uses industry-standard libphonenumber-js library
