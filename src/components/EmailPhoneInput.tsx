import { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import Select from './Select';

interface EmailPhoneInputProps {
  value?: string;
  prefix?: any;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹', ES: '🇪🇸',
  JP: '🇯🇵', CN: '🇨🇳', IN: '🇮🇳', BR: '🇧🇷', MX: '🇲🇽', RU: '🇷🇺', KR: '🇰🇷', NL: '🇳🇱',
  SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰', FI: '🇫🇮', PL: '🇵🇱', TR: '🇹🇷', SA: '🇸🇦', AE: '🇦🇪',
  SG: '🇸🇬', MY: '🇲🇾', TH: '🇹🇭', PH: '🇵🇭', ID: '🇮🇩', VN: '🇻🇳', PK: '🇵🇰', BD: '🇧🇩',
  NG: '🇳🇬', ZA: '🇿🇦', EG: '🇪🇬', AR: '🇦🇷', CL: '🇨🇱', CO: '🇨🇴', PE: '🇵🇪', VE: '🇻🇪',
};

function EmailPhoneInput({
  value = '',
  prefix = undefined,
  onChange,
  placeholder = 'Email or phone number',
  disabled = false,
  onValidationChange,
}: EmailPhoneInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [inputType, setInputType] = useState<'email' | 'phone' | 'unknown'>('unknown');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [isValid, setIsValid] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setInputValue(value);
    detectInputType(value);
  }, [value]);

  useEffect(() => {
    const valid = validateInput(inputValue, inputType);
    setIsValid(valid);
    if (onValidationChange) {
      onValidationChange(valid);
    }
  }, [inputValue, inputType, onValidationChange]);

  const detectInputType = (val: string) => {
    if (!val) {
      setInputType('unknown');
      setShowCountryPicker(false);
      return;
    }

    const firstChar = val.trim()[0];

    if (/[0-9+]/.test(firstChar)) {
      setInputType('phone');
      setShowCountryPicker(true);
    } else if (/[a-zA-Z]/.test(firstChar)) {
      setInputType('email');
      setShowCountryPicker(false);
    } else {
      setInputType('unknown');
      setShowCountryPicker(false);
    }
  };

  const validateInput = (val: string, type: 'email' | 'phone' | 'unknown'): boolean => {
    if (!val) return false;

    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val);
    } else if (type === 'phone') {
      try {
        const phoneWithCountry = val.startsWith('+') ? val : `+${getCountryCallingCode(selectedCountry as any)}${val}`;
        return isValidPhoneNumber(phoneWithCountry);
      } catch {
        return false;
      }
    }
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    detectInputType(val);
    if (onChange) {
      onChange(val);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);

    if (inputValue && !inputValue.startsWith('+')) {
      const callingCode = getCountryCallingCode(country as any);
      const newValue = `+${callingCode}${inputValue.replace(/^\+?\d+\s*/, '')}`;
      setInputValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };


  const getPlaceholder = () => {
    if (inputType === 'email') return 'Enter your email';
    if (inputType === 'phone') return 'Enter your phone number';
    return placeholder;
  };

  const countries = getCountries();

  return (
    <div className="email-phone-input-container">
      <div className={`flex items-center ${showCountryPicker ? 'gap-2' : ''} relative`}>
        <div
          className={`country-picker-wrapper ${showCountryPicker ? 'show' : ''}`}
          style={{
            width: showCountryPicker ? '100px' : '0px',
            opacity: showCountryPicker ? 1 : 0,
            overflow: 'hidden',
            transition: 'width 0.3s ease, opacity 0.3s ease',
          }}
        >
          {showCountryPicker && (
            <Select
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={disabled}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
            >
              {countries.map((country) => (
                <Select.Option key={country} value={country}>
                  <span style={{ marginRight: '8px' }}>
                    {COUNTRY_FLAGS[country] || '🌍'}
                  </span>
                  {country}
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
        <div className="flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            disabled={disabled}
            status={inputValue && !isValid ? 'error' : ''}
            prefix={prefix}
            style={{
              transition: 'all 0.3s ease',
            }}
          />
        </div>
      </div>
      <style>{`
        .email-phone-input-container .ant-input-status-error {
          border-color: #ff4d4f;
        }
        .country-picker-wrapper {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export default EmailPhoneInput;
