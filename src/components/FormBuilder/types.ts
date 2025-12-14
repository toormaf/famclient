import { Rule } from 'antd/es/form';
import { ReactNode } from 'react';

export type FieldType =
  | 'input'
  | 'email'
  | 'mobile'
  | 'emailOrMobile'
  | 'password'
  | 'otp'
  | 'select'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'custom';

export type LayoutType = 'vertical' | 'horizontal' | 'inline';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FieldConfig {
  name: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  visibleWhen?: (formValues: any) => boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  icon?: ReactNode;
  rules?: Rule[];
  options?: SelectOption[];
  rows?: number;
  min?: number;
  max?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  dependencies?: string[];
  tooltip?: string;
  help?: string;
  className?: string;
  style?: React.CSSProperties;
  addonBefore?: ReactNode;
  addonAfter?: ReactNode;
  size?: 'small' | 'middle' | 'large';
  allowClear?: boolean;
  showCount?: boolean;
  autoComplete?: string;
  mode?: 'multiple' | 'tags';
  span?: number;
  format?: string;
  formatValue?: string;
  change?: (value: any) => void;
  render?: (config: FieldConfig, formInstance: any) => ReactNode;
}

export interface FormConfig {
  fields: FieldConfig[];
  layout?: LayoutType;
  columns?: 1 | 2 | 3 | 4;
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  size?: 'small' | 'middle' | 'large';
  className?: string;
  style?: React.CSSProperties;
  submitButtonAlign?: 'left' | 'center' | 'right';
}

export interface FormBuilderProps {
  config: FormConfig;
  onSubmit: (values: any) => void | Promise<void>;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  initialValues?: Record<string, any>;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}
