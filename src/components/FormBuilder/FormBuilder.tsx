import { useState, useEffect } from 'react';
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
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

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
          validateFirst
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

  useEffect(() => {
    const formValues = form.getFieldsValue();
    const newVisibleFields = new Set<string>();

    fields.forEach((field) => {
      const isVisible = !field.hidden && (!field.visibleWhen || field.visibleWhen(formValues));
      if (isVisible) {
        newVisibleFields.add(field.name);
      }
    });

    const previouslyVisible = Array.from(visibleFields);
    const nowHidden = previouslyVisible.filter(name => !newVisibleFields.has(name));

    if (nowHidden.length > 0) {
      form.setFields(
        nowHidden.map(name => ({
          name,
          errors: [],
          warnings: [],
        }))
      );
    }

    setVisibleFields(newVisibleFields);
  }, [form.getFieldsValue()]);

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
      validateTrigger={['onChange', 'onBlur']}
    >
      <Form.Item noStyle shouldUpdate>
        {() => {
          const formValues = form.getFieldsValue();
          const newVisibleFields = new Set<string>();

          fields.forEach((field) => {
            const isVisible = !field.hidden && (!field.visibleWhen || field.visibleWhen(formValues));
            if (isVisible) {
              newVisibleFields.add(field.name);
            }
          });

          const previouslyVisible = Array.from(visibleFields);
          const nowHidden = previouslyVisible.filter(name => !newVisibleFields.has(name));

          if (nowHidden.length > 0) {
            setTimeout(() => {
              form.setFields(
                nowHidden.map(name => ({
                  name,
                  errors: [],
                }))
              );
            }, 0);
          }

          if (newVisibleFields.size !== visibleFields.size ||
              !Array.from(newVisibleFields).every(name => visibleFields.has(name))) {
            setVisibleFields(newVisibleFields);
          }

          return (
            <Row gutter={[16, 0]}>
              {fields.map((field) => renderField(field, formValues))}
            </Row>
          );
        }}
      </Form.Item>

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
