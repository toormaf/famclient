import { useState } from 'react';
import { Card, Typography, Form, Button, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { EmailPhoneInput } from '../../components';

const { Title, Paragraph } = Typography;

function Home() {
  const [contactValue, setContactValue] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = () => {
    if (isValid) {
      message.success(`Contact information saved: ${contactValue}`);
    } else {
      message.error('Please enter a valid email or phone number');
    }
  };

  return (
    <div>
      <Title level={2}>
        <HomeOutlined className="mr-2" />
        Home
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card hoverable>
          <Title level={4}>Welcome to Famroot</Title>
          <Paragraph>
            Your family connection hub. Manage your family connections, chat with members,
            store important documents, and keep track of locations.
          </Paragraph>
        </Card>
        <Card hoverable>
          <Title level={4}>Quick Stats</Title>
          <Paragraph>
            View your family network statistics and recent activities.
          </Paragraph>
        </Card>
        <Card hoverable>
          <Title level={4}>Recent Updates</Title>
          <Paragraph>
            Stay updated with the latest from your family network.
          </Paragraph>
        </Card>
      </div>

      <Card className="mt-6" title="Contact Information Example">
        <Form layout="vertical">
          <Form.Item label="Email or Phone Number" required>
            <EmailPhoneInput
              value={contactValue}
              onChange={setContactValue}
              onValidationChange={setIsValid}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit} disabled={!isValid}>
              Save Contact
            </Button>
          </Form.Item>
        </Form>
        <Paragraph className="text-gray-500 text-sm">
          This component automatically detects input type based on your entry.
          Start with a letter for email or a number for phone. Country picker appears automatically for phone numbers.
        </Paragraph>
      </Card>
    </div>
  );
}

export default Home;
