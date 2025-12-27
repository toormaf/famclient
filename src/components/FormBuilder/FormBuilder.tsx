import { useState, useRef } from 'react';
import { Form, Button, Row, Col, Space, Tooltip, Input } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormBuilderProps } from './types';
import { FieldRenderer, getFieldRules } from './FieldRenderer';
import './FormBuilder.css';
import Password from 'antd/es/input/Password';

export const FormBuilder: React.FC<FormBuilderProps> = ({
  config,
  onSubmit,
  onValuesChange,
  initialValues,
  submitText = 'Submit',
  resetText = 'Reset',
  showReset = false,
  loading = false,
  disabled = false,
  children,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const visibleFieldsRef = useRef<Set<string>>(new Set());

  const {
    fields,
    layout = 'vertical',
    columns = 1,
    labelCol,
    wrapperCol,
    size = 'middle',
    className,
    style,
    submitButtonAlign = 'left',
  } = config;

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const getColSpan = (fieldSpan?: number) => {
    if (fieldSpan) return fieldSpan;
    return 24 / columns;
  };

  const renderField = (field: any, formValues: any) => {
    if (field.hidden) return null;

    if (field.visibleWhen && !field.visibleWhen(formValues)) {
      return null;
    }

    const rules = getFieldRules(field);
    const colSpan = getColSpan(field.span);

    const label = field.label ? (
      <span>
        {field.label}
        {field.tooltip && (
          <Tooltip title={field.tooltip}>
            <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
          </Tooltip>
        )}
      </span>
    ) : undefined;

    const itemClassName = field.className
      ? `form-builder-field ${field.className}`
      : 'form-builder-field';

    return (
      <Col key={field.name} span={colSpan}>
        <Form.Item
          name={field.name}
          label={label}
          rules={rules}
          dependencies={field.dependencies}
          help={field.help}
          className={itemClassName}
          style={field.style}
          initialValue={field.defaultValue}
          valuePropName={field.type === 'checkbox' || field.type === 'switch' ? 'checked' : 'value'}
          validateTrigger={['onBlur']}
        >
          <FieldRenderer config={field} form={form} />
        </Form.Item>
      </Col>
    );
  };

  const getSubmitButtonStyle = () => {
    switch (submitButtonAlign) {
      case 'center':
        return { justifyContent: 'center', display: 'flex' };
      case 'right':
        return { justifyContent: 'flex-end', display: 'flex' };
      default:
        return {};
    }
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    // Call user's onValuesChange if provided
    if (onValuesChange) {
      onValuesChange(changedValues, allValues);
    }
  };

  return (
    <Form
      form={form}
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      size={size}
      onFinish={handleSubmit}
      onValuesChange={handleValuesChange}
      initialValues={initialValues}
      disabled={disabled}
      className={`form-builder ${className || ''}`}
      style={style}
      scrollToFirstError
    >
      <Row gutter={[16, 0]}>
        {fields.map((field) => renderField(field, form.getFieldsValue()))}
      </Row>

      {children}

      <Form.Item className="form-actions" style={getSubmitButtonStyle()}>
        <Space size="middle">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || submitting}
            size={size}
          >
            {submitText}
          </Button>
          {showReset && (
            <Button
              htmlType="button"
              onClick={handleReset}
              disabled={loading || submitting}
              size={size}
            >
              {resetText}
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default FormBuilder;
