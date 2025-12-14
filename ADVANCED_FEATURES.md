# FormBuilder Advanced Features Guide

This guide covers all the advanced features added to the FormBuilder component.

## Table of Contents

1. [Default Values](#default-values)
2. [Disabled Fields](#disabled-fields)
3. [Custom Fields & Components](#custom-fields--components)
4. [Submit Button Alignment](#submit-button-alignment)
5. [Conditional Field Visibility](#conditional-field-visibility)
6. [Complete Examples](#complete-examples)

---

## 1. Default Values

### Overview
Set default values directly in the field configuration. These values will automatically populate when the form loads.

### Implementation
```tsx
{
  name: 'country',
  label: 'Country',
  type: 'select',
  defaultValue: 'US',  // Default value
  options: [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'GB' },
  ],
}
```

### Features
- Works with all field types
- Can be combined with `initialValues` prop
- Field-level defaults override form-level initialValues
- Useful for pre-filling forms with common values

### Example: Pre-filled Profile Form
```tsx
const profileConfig: FormConfig = {
  fields: [
    {
      name: 'username',
      type: 'input',
      defaultValue: 'johndoe',
      disabled: true,  // Can't change username
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'dark',  // Default theme
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    {
      name: 'notifications',
      type: 'switch',
      defaultValue: true,  // Notifications enabled by default
    },
  ],
};
```

---

## 2. Disabled Fields

### Overview
Individual fields can be disabled to prevent user modification while still displaying the value.

### Implementation
```tsx
{
  name: 'userId',
  label: 'User ID',
  type: 'input',
  defaultValue: 'USER-12345',
  disabled: true,  // Field is read-only
  help: 'This field cannot be modified',
}
```

### Features
- Works with all field types
- Field value is still included in form submission
- Can be combined with default values
- Visual indication (grayed out)
- Useful for showing non-editable information

### Use Cases

**System-Generated Fields**
```tsx
{
  name: 'createdAt',
  label: 'Created On',
  type: 'input',
  defaultValue: new Date().toISOString(),
  disabled: true,
}
```

**Locked Email After Verification**
```tsx
{
  name: 'email',
  label: 'Email Address',
  type: 'email',
  defaultValue: 'user@example.com',
  disabled: true,
  help: 'Contact support to change your verified email',
}
```

**Display-Only Fields**
```tsx
{
  name: 'accountType',
  label: 'Account Type',
  type: 'select',
  defaultValue: 'premium',
  disabled: true,
  help: 'Upgrade or downgrade through billing settings',
  options: [
    { label: 'Free', value: 'free' },
    { label: 'Premium', value: 'premium' },
    { label: 'Enterprise', value: 'enterprise' },
  ],
}
```

---

## 3. Custom Fields & Components

### Overview
The `custom` field type allows you to insert any React component into the form layout, with full access to the form instance.

### Implementation
```tsx
{
  name: 'customField',
  type: 'custom',
  label: 'Custom Action',  // Optional
  render: (config, form) => {
    // Return any React component
    return <YourCustomComponent />;
  },
}
```

### Features
- Full access to form instance via second parameter
- Can read and write form values
- Can trigger form actions
- Perfect for custom interactions within forms
- No validation applied (unless you add it manually)

### Example 1: Action Button
```tsx
{
  name: 'verifyEmail',
  label: ' ',
  type: 'custom',
  render: (_config, form) => (
    <Button
      type="link"
      onClick={() => {
        const email = form.getFieldValue('email');
        if (email) {
          sendVerification(email);
          message.success(`Verification sent to ${email}`);
        } else {
          message.warning('Please enter an email first');
        }
      }}
    >
      Send Verification Email
    </Button>
  ),
}
```

### Example 2: Real-time Validation Feedback
```tsx
{
  name: 'passwordStrength',
  label: ' ',
  type: 'custom',
  render: (_config, form) => {
    const password = form.getFieldValue('password');
    const strength = calculateStrength(password);

    return (
      <div>
        <Progress
          percent={strength}
          status={strength > 70 ? 'success' : 'normal'}
        />
        <Typography.Text type="secondary">
          Password strength: {strength > 70 ? 'Strong' : 'Weak'}
        </Typography.Text>
      </div>
    );
  },
}
```

### Example 3: External Links
```tsx
{
  name: 'termsLink',
  label: ' ',
  type: 'custom',
  render: () => (
    <div style={{ marginTop: -16 }}>
      <Typography.Link href="/terms" target="_blank">
        Read Terms and Conditions
      </Typography.Link>
    </div>
  ),
}
```

### Example 4: Dynamic Form Updates
```tsx
{
  name: 'addressLookup',
  label: ' ',
  type: 'custom',
  render: (_config, form) => (
    <Button
      onClick={async () => {
        const zipCode = form.getFieldValue('zipCode');
        const address = await fetchAddressByZip(zipCode);

        // Update multiple form fields
        form.setFieldsValue({
          street: address.street,
          city: address.city,
          state: address.state,
        });
      }}
    >
      Auto-fill Address
    </Button>
  ),
}
```

### Example 5: File Upload Preview
```tsx
{
  name: 'avatarPreview',
  type: 'custom',
  render: (_config, form) => {
    const avatarUrl = form.getFieldValue('avatar');
    return avatarUrl ? (
      <Avatar size={64} src={avatarUrl} />
    ) : (
      <Typography.Text type="secondary">
        No avatar selected
      </Typography.Text>
    );
  },
}
```

---

## 4. Submit Button Alignment

### Overview
Control the horizontal alignment of the submit button container.

### Implementation
```tsx
const config: FormConfig = {
  submitButtonAlign: 'center',  // 'left' | 'center' | 'right'
  fields: [...],
};
```

### Options

**Left Alignment (Default)**
```tsx
submitButtonAlign: 'left'
```
- Buttons align to the left
- Standard for most forms
- Good for vertical forms

**Center Alignment**
```tsx
submitButtonAlign: 'center'
```
- Buttons centered horizontally
- Good for login/signup forms
- Creates a balanced appearance
- Professional look for standalone forms

**Right Alignment**
```tsx
submitButtonAlign: 'right'
```
- Buttons align to the right
- Common in settings/profile forms
- Follows the reading flow
- Standard for wizard-style forms

### Visual Examples

**Left (Default)**
```
[Input Field         ]

[Submit] [Reset]
```

**Center**
```
[Input Field         ]

    [Submit] [Reset]
```

**Right**
```
[Input Field         ]

         [Submit] [Reset]
```

### Use Cases

**Login Form - Center**
```tsx
const loginConfig: FormConfig = {
  layout: 'vertical',
  submitButtonAlign: 'center',
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'password', type: 'password', required: true },
  ],
};
```

**Settings Form - Right**
```tsx
const settingsConfig: FormConfig = {
  layout: 'horizontal',
  submitButtonAlign: 'right',
  fields: [
    { name: 'theme', type: 'select', options: [...] },
    { name: 'language', type: 'select', options: [...] },
  ],
};
```

---

## 5. Conditional Field Visibility

### Overview
Show or hide fields dynamically based on other field values using the `visibleWhen` function.

### Implementation
```tsx
{
  name: 'businessName',
  label: 'Business Name',
  type: 'input',
  required: true,
  visibleWhen: (formValues) => formValues.accountType === 'business',
}
```

### Features
- Fields are completely removed from DOM when hidden
- Validation only runs when field is visible
- Re-renders automatically when dependencies change
- Supports complex conditions
- Works with all field types

### Example 1: Show/Hide Based on Selection
```tsx
const config: FormConfig = {
  fields: [
    {
      name: 'accountType',
      label: 'Account Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'businessName',
      label: 'Business Name',
      type: 'input',
      required: true,
      visibleWhen: (values) => values.accountType === 'business',
    },
    {
      name: 'taxId',
      label: 'Tax ID',
      type: 'input',
      required: true,
      visibleWhen: (values) => values.accountType === 'business',
    },
  ],
};
```

### Example 2: Show Based on Switch/Checkbox
```tsx
{
  name: 'enableNotifications',
  label: 'Enable Notifications',
  type: 'switch',
  defaultValue: false,
},
{
  name: 'notificationEmail',
  label: 'Notification Email',
  type: 'email',
  required: true,
  visibleWhen: (values) => values.enableNotifications === true,
},
```

### Example 3: Payment Method Selection
```tsx
const paymentConfig: FormConfig = {
  fields: [
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'radio',
      required: true,
      options: [
        { label: 'Credit Card', value: 'card' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Bank Transfer', value: 'bank' },
      ],
    },
    {
      name: 'cardNumber',
      label: 'Card Number',
      type: 'input',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'card',
    },
    {
      name: 'cardExpiry',
      label: 'Expiry Date',
      type: 'input',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'card',
    },
    {
      name: 'paypalEmail',
      label: 'PayPal Email',
      type: 'email',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'paypal',
    },
    {
      name: 'bankAccount',
      label: 'Bank Account',
      type: 'input',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'bank',
    },
  ],
};
```

### Example 4: Complex Conditions
```tsx
{
  name: 'discountCode',
  label: 'Discount Code',
  type: 'input',
  visibleWhen: (values) => {
    // Show only if total is over $100 AND user is not premium
    return values.total > 100 && values.membership !== 'premium';
  },
}
```

### Example 5: Multiple Dependencies
```tsx
{
  name: 'internationalShipping',
  label: 'International Shipping Details',
  type: 'textarea',
  required: true,
  visibleWhen: (values) => {
    // Show if shipping is enabled AND country is not US
    return values.shippingRequired === true && values.country !== 'US';
  },
}
```

### Performance Tips
- Keep `visibleWhen` functions simple and fast
- Avoid expensive computations
- Don't call APIs or async functions
- The function is called on every form value change

---

## 6. Complete Examples

### Example A: Advanced Registration Form

```tsx
import { FormBuilder, FormConfig } from '@/components/FormBuilder';
import { message, Typography } from 'antd';

const { Link } = Typography;

const registrationConfig: FormConfig = {
  layout: 'vertical',
  columns: 2,
  submitButtonAlign: 'center',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'input',
      placeholder: 'Enter first name',
      required: true,
      prefix: 'UserOutlined',
      span: 12,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'input',
      placeholder: 'Enter last name',
      required: true,
      prefix: 'UserOutlined',
      span: 12,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email',
      required: true,
      span: 24,
    },
    {
      name: 'verifyButton',
      label: ' ',
      type: 'custom',
      span: 24,
      render: (_config, form) => (
        <Button
          type="link"
          onClick={() => {
            const email = form.getFieldValue('email');
            if (email) {
              message.info(`Verification sent to ${email}`);
            } else {
              message.warning('Please enter email first');
            }
          }}
        >
          Send Verification Email
        </Button>
      ),
    },
    {
      name: 'accountType',
      label: 'Account Type',
      type: 'select',
      required: true,
      defaultValue: 'personal',
      span: 24,
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'businessName',
      label: 'Business Name',
      type: 'input',
      placeholder: 'Enter business name',
      required: true,
      span: 12,
      visibleWhen: (values) => values.accountType === 'business',
    },
    {
      name: 'taxId',
      label: 'Tax ID',
      type: 'input',
      placeholder: 'Enter tax ID',
      required: true,
      span: 12,
      visibleWhen: (values) => values.accountType === 'business',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Create password',
      required: true,
      minLength: 8,
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

function RegistrationForm() {
  const handleSubmit = async (values: any) => {
    console.log('Registration:', values);
    message.success('Account created successfully!');
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h1>Create Your Account</h1>
      <FormBuilder
        config={registrationConfig}
        onSubmit={handleSubmit}
        submitText="Create Account"
      />
    </div>
  );
}

export default RegistrationForm;
```

### Example B: Profile Settings with Disabled Fields

```tsx
const profileConfig: FormConfig = {
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
      help: 'This is your unique identifier',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      defaultValue: 'user@example.com',
      disabled: true,
      help: 'Contact support to change your verified email',
    },
    {
      name: 'displayName',
      label: 'Display Name',
      type: 'input',
      placeholder: 'Enter display name',
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
    {
      name: 'theme',
      label: 'Theme',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Auto', value: 'auto' },
      ],
    },
  ],
};
```

### Example C: Conditional Shipping Form

```tsx
const checkoutConfig: FormConfig = {
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
      placeholder: 'Enter full address',
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
        { label: 'Standard (5-7 days) - Free', value: 'standard' },
        { label: 'Express (2-3 days) - $9.99', value: 'express' },
        { label: 'Overnight - $24.99', value: 'overnight' },
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
      placeholder: 'your@email.com',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'paypal',
    },
    {
      name: 'bankAccount',
      label: 'Bank Account',
      type: 'input',
      placeholder: 'Enter account number',
      required: true,
      visibleWhen: (values) => values.paymentMethod === 'bank',
    },
  ],
};
```

---

## Summary

### All Advanced Features

| Feature | Purpose | Configuration |
|---------|---------|---------------|
| **Default Values** | Pre-fill fields | `defaultValue` in field config |
| **Disabled Fields** | Read-only display | `disabled: true` in field config |
| **Custom Fields** | Insert components | `type: 'custom'` with `render` function |
| **Button Alignment** | Position submit buttons | `submitButtonAlign` in form config |
| **Conditional Visibility** | Show/hide fields | `visibleWhen` function in field config |

### Best Practices

1. **Default Values**: Use for common selections and pre-filled data
2. **Disabled Fields**: Show non-editable info, add help text explaining why
3. **Custom Fields**: Keep render functions lightweight and fast
4. **Button Alignment**: Center for standalone forms, right for settings
5. **Conditional Visibility**: Keep logic simple, avoid expensive operations

### Quick Reference

```tsx
const advancedConfig: FormConfig = {
  // Button alignment
  submitButtonAlign: 'center',

  fields: [
    // Default value
    {
      name: 'country',
      type: 'select',
      defaultValue: 'US',
      options: [...],
    },

    // Disabled field
    {
      name: 'userId',
      type: 'input',
      defaultValue: 'USER-123',
      disabled: true,
    },

    // Custom field
    {
      name: 'action',
      type: 'custom',
      render: (_config, form) => <Button>Click Me</Button>,
    },

    // Conditional visibility
    {
      name: 'details',
      type: 'textarea',
      visibleWhen: (values) => values.needsDetails === true,
    },
  ],
};
```

---

## Need Help?

Check out the complete examples in:
- `src/components/FormBuilder/examples.tsx`
- `src/components/FormBuilder/README.md`
- `FORMBUILDER_GUIDE.md`

For more information about basic features, see the main FormBuilder documentation.
