# EmailPhoneInput Component

A smart React component that automatically detects and validates both email and phone number input with a dynamically sliding country picker.

## Features

- Automatic detection of input type based on first character
  - Starts with letter → Email mode
  - Starts with number → Phone mode
- Dynamic country picker that slides in automatically for phone numbers
- Real-time validation for both email and phone numbers
- International phone number support with country flags
- Integrates seamlessly with Ant Design
- TypeScript support
- Smooth animations and transitions

## Installation

The component uses the following dependencies:
- `libphonenumber-js` - For phone number validation and country data
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
      placeholder="Email or phone number"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | The current value of the input |
| `onChange` | `(value: string) => void` | - | Callback fired when the value changes |
| `placeholder` | `string` | `'Email or phone number'` | Placeholder text |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `onValidationChange` | `(isValid: boolean) => void` | - | Callback fired when validation status changes |

## How It Works

### Automatic Type Detection

The component intelligently detects the input type based on the first character:

- **Email Mode**: Triggered when first character is a letter (a-z, A-Z)
  - Shows email icon
  - Validates against email format
  - No country picker visible

- **Phone Mode**: Triggered when first character is a number (0-9) or plus sign (+)
  - Shows phone icon
  - Country picker slides in smoothly
  - Validates against international phone format

### Country Picker

- Appears automatically when phone mode is activated
- Includes country flags for easy identification
- Searchable dropdown for quick country selection
- Supports all countries with calling codes
- Updates phone number format based on selected country

## Validation

The component includes built-in validation:

### Email Validation
- Checks for valid email format using regex
- Pattern: `name@domain.extension`

### Phone Validation
- Uses `libphonenumber-js` for accurate international phone number validation
- Validates number format based on selected country
- Automatically adds country calling code

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

### In a Login Form
```tsx
<Form.Item label="Email or Phone Number" required>
  <EmailPhoneInput
    value={contactValue}
    onChange={setContactValue}
    onValidationChange={setIsValid}
  />
</Form.Item>

<Form.Item label="Password" required>
  <Input.Password
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
</Form.Item>

<Button
  type="primary"
  htmlType="submit"
  disabled={!isValid || !password}
>
  Login Now
</Button>
```

## Custom Select Component

The component uses a custom Select wrapper (`src/components/Select.tsx`) that extends Ant Design's Select component. This wrapper can be customized and reused throughout your project.

```tsx
import { Select } from '../components';

<Select value={country} onChange={setCountry}>
  <Select.Option value="US">United States</Select.Option>
  <Select.Option value="GB">United Kingdom</Select.Option>
</Select>
```

## Styling

The component includes custom CSS for smooth animations and transitions:

- Country picker slides in/out with 0.3s ease transition
- Icon changes dynamically based on input type
- Error states with red border for invalid input
- Fully responsive design

You can override styles by targeting these classes:

- `.email-phone-input-container` - Main container
- `.country-picker-wrapper` - Country picker wrapper with slide animation
- `.ant-input-status-error` - Error state styling

## Country Flags

The component includes a comprehensive set of country flags for major countries. Flags are implemented using Unicode emoji characters for lightweight and consistent rendering across platforms.

## Notes

- The component automatically maintains input state
- Phone numbers are validated using the libphonenumber-js library
- Email validation is performed client-side using regex
- Country picker only appears when needed (phone mode)
- Smooth transitions enhance user experience
- Component is fully accessible and keyboard-friendly
