import {
  Input,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Switch,
  InputNumber,
  Space,
} from 'antd';
import { FieldConfig } from './types';
import { buildFieldRules } from './validators';
import * as Icons from '@ant-design/icons';
import EmailPhoneInput from '../EmailPhoneInput';

const { TextArea, Password } = Input;
const { Option } = Select;

interface FieldRendererProps {
  config: FieldConfig;
  form?: any;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ config, form }) => {
  const {
    type,
    placeholder,
    disabled,
    prefix,
    suffix,
    options,
    rows = 4,
    maxLength,
    allowClear = true,
    showCount,
    size,
    mode,
    addonBefore,
    addonAfter,
  } = config;

  const commonProps = {
    placeholder,
    disabled,
    size,
    allowClear,
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const renderPrefix = prefix
    ? typeof prefix === 'string'
      ? getIcon(prefix)
      : prefix
    : undefined;

  const renderSuffix = suffix
    ? typeof suffix === 'string'
      ? getIcon(suffix)
      : suffix
    : undefined;

  switch (type) {
    case 'input':
      return (
        <Input
          {...commonProps}
          prefix={renderPrefix}
          suffix={renderSuffix}
          maxLength={maxLength}
          showCount={showCount}
          addonBefore={addonBefore}
          addonAfter={addonAfter}
        />
      );

    case 'email':
      return (
        <Input
          {...commonProps}
          type="email"
          prefix={renderPrefix || <Icons.MailOutlined />}
          suffix={renderSuffix}
          maxLength={maxLength}
          autoComplete="email"
        />
      );

    case 'mobile':
      return (
        <Input
          {...commonProps}
          type="tel"
          prefix={renderPrefix || <Icons.PhoneOutlined />}
          suffix={renderSuffix}
          maxLength={maxLength}
          autoComplete="tel"
        />
      );

    case 'emailOrMobile':
      return (
        <EmailPhoneInput
          {...commonProps}
          prefix={renderPrefix || <Icons.UserOutlined />}
          placeholder={placeholder || 'Email or Mobile Number'}
        />
      );

    case 'password':
      return (
        <Password
          {...commonProps}
          prefix={renderPrefix || <Icons.LockOutlined />}
          suffix={renderSuffix}
          maxLength={maxLength}
          autoComplete="new-password"
        />
      );

    case 'otp':
      return (
        <Input
          {...commonProps}
          type="text"
          prefix={renderPrefix || <Icons.SafetyOutlined />}
          suffix={renderSuffix}
          maxLength={6}
          placeholder={placeholder || 'Enter OTP'}
          style={{ letterSpacing: '0.5em', fontSize: '18px', textAlign: 'center' }}
        />
      );

    case 'textarea':
      return (
        <TextArea
          {...commonProps}
          rows={rows}
          maxLength={maxLength}
          showCount={showCount}
        />
      );

    case 'number':
      return (
        <InputNumber
          {...commonProps}
          style={{ width: '100%' }}
          prefix={renderPrefix}
          min={config.min}
          max={config.max}
        />
      );

    case 'select':
      return (
        <Select
          {...commonProps}
          mode={mode}
          showSearch
          optionFilterProp="children"
          suffixIcon={renderSuffix}
        >
          {options?.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </Option>
          ))}
        </Select>
      );

    case 'date':
      return (
        <DatePicker
          {...commonProps}
          style={{ width: '100%' }}
          format="YYYY-MM-DD"
        />
      );

    case 'datetime':
      return (
        <DatePicker
          {...commonProps}
          showTime={{ format: 'HH:mm:ss' }}
          style={{ width: '100%' }}
          format={config.format || 'YYYY-MM-DD HH:mm:ss'}
        />
      );

    case 'checkbox':
      return <Checkbox disabled={disabled}>{config.label}</Checkbox>;

    case 'radio':
      return (
        <Radio.Group disabled={disabled}>
          <Space direction="vertical">
            {options?.map((option) => (
              <Radio key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      );

    case 'switch':
      return <Switch disabled={disabled} />;

    case 'custom':
      if (config.render && form) {
        return config.render(config, form);
      }
      return null;

    default:
      return <Input {...commonProps} />;
  }
};

export const getFieldRules = (config: FieldConfig) => {
  if (config.rules) {
    return config.rules;
  }

  return buildFieldRules({
    required: config.required,
    label: config.label,
    type: config.type,
    minLength: config.minLength,
    maxLength: config.maxLength,
    pattern: config.pattern,
    min: config.min,
    max: config.max,
  });
};
