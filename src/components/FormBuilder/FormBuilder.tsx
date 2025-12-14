import { useState } from 'react';
import { Form, Button, Row, Col, Space, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FormBuilderProps } from './types';
import { FieldRenderer, getFieldRules } from './FieldRenderer';
import './FormBuilder.css';

export const FormBuilder: React.FC<FormBuilderProps> = ({
  config,
  onSubmit,
  onValuesChange,
  initialValues,
  submitText = 'Submit',
  resetText = 'Reset',
  showReset = true,
  loading = false,
  disabled = false,
  children,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const {
    fields,
    layout = 'vertical',
    columns = 1,
    labelCol,
    wrapperCol,
    size = 'middle',
    className,
    style,
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

  const renderField = (field: any) => {
    if (field.hidden) return null;

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

    return (
      <Col key={field.name} span={colSpan}>
        <Form.Item
          name={field.name}
          label={label}
          rules={rules}
          dependencies={field.dependencies}
          help={field.help}
          className={field.className}
          style={field.style}
          initialValue={field.defaultValue}
          valuePropName={field.type === 'checkbox' || field.type === 'switch' ? 'checked' : 'value'}
          validateFirst
        >
          <FieldRenderer config={field} />
        </Form.Item>
      </Col>
    );
  };

  return (
    <Form
      form={form}
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      size={size}
      onFinish={handleSubmit}
      onValuesChange={onValuesChange}
      initialValues={initialValues}
      disabled={disabled}
      className={`form-builder ${className || ''}`}
      style={style}
      scrollToFirstError
    >
      <Row gutter={[16, 0]}>
        {fields.map((field) => renderField(field))}
      </Row>

      {children}

      <Form.Item className="form-actions">
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
