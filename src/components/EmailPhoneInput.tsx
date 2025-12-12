import { useState, useEffect } from 'react';
import { Input, Select, Space } from 'antd';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface EmailPhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  defaultType?: 'email' | 'phone';
  onValidationChange?: (isValid: boolean) => void;
}

function EmailPhoneInput({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  defaultType = 'email',
  onValidationChange,
}: EmailPhoneInputProps) {
  const [inputType, setInputType] = useState<'email' | 'phone'>(defaultType);
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const valid = validateInput(inputValue, inputType);
    setIsValid(valid);
    if (onValidationChange) {
      onValidationChange(valid);
    }
  }, [inputValue, inputType, onValidationChange]);

  const validateInput = (val: string, type: 'email' | 'phone'): boolean => {
    if (!val) return false;

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val);
    } else {
      try {
        return isValidPhoneNumber(val);
      } catch {
        return false;
      }
    }
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  const handleTypeChange = (type: 'email' | 'phone') => {
    setInputType(type);
    setInputValue('');
    if (onChange) {
      onChange('');
    }
  };

  const selectBefore = (
    <Select
      value={inputType}
      onChange={handleTypeChange}
      disabled={disabled}
      style={{ width: 100 }}
    >
      <Select.Option value="email">
        <Space>
          <MailOutlined />
          Email
        </Space>
      </Select.Option>
      <Select.Option value="phone">
        <Space>
          <PhoneOutlined />
          Phone
        </Space>
      </Select.Option>
    </Select>
  );

  return (
    <div className="email-phone-input">
      {inputType === 'email' ? (
        <Input
          addonBefore={selectBefore}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder || 'Enter your email'}
          disabled={disabled}
          status={inputValue && !isValid ? 'error' : ''}
          prefix={<MailOutlined />}
        />
      ) : (
        <div className="flex gap-2">
          <div className="flex-shrink-0">{selectBefore}</div>
          <div className="flex-1">
            <PhoneInput
              international
              defaultCountry="US"
              value={inputValue}
              onChange={(val) => handleInputChange(val || '')}
              disabled={disabled}
              placeholder={placeholder || 'Enter your phone number'}
              className={`ant-input ${inputValue && !isValid ? 'ant-input-status-error' : ''}`}
              style={{
                width: '100%',
                height: '32px',
                padding: '4px 11px',
                fontSize: '14px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
              }}
            />
          </div>
        </div>
      )}
      <style>{`
        .email-phone-input .react-phone-number-input__input {
          border: none !important;
          outline: none !important;
          padding: 0 !important;
          background: transparent !important;
        }
        .email-phone-input .react-phone-number-input__country {
          margin-right: 8px;
        }
        .email-phone-input .ant-input-status-error {
          border-color: #ff4d4f;
        }
      `}</style>
    </div>
  );
}

export default EmailPhoneInput;
