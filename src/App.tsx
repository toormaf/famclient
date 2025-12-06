import { Button, Card, Space, Typography } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <Title level={1} className="!mb-2">
              <HeartOutlined className="text-red-500 mr-3" />
              Welcome to Famroot
            </Title>
            <Paragraph className="text-gray-600">
              A React application built with Vite, Tailwind CSS, and Ant Design
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card hoverable className="text-center">
              <HomeOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
              <Title level={4}>Vite</Title>
              <Paragraph>Lightning fast build tool</Paragraph>
            </Card>

            <Card hoverable className="text-center">
              <UserOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
              <Title level={4}>Ant Design</Title>
              <Paragraph>Beautiful UI components</Paragraph>
            </Card>

            <Card hoverable className="text-center">
              <SettingOutlined style={{ fontSize: '32px', color: '#722ed1' }} />
              <Title level={4}>Tailwind CSS</Title>
              <Paragraph>Utility-first styling</Paragraph>
            </Card>
          </div>

          <div className="flex justify-center">
            <Space size="middle">
              <Button type="primary" size="large" icon={<HomeOutlined />}>
                Get Started
              </Button>
              <Button size="large" icon={<SettingOutlined />}>
                Configure
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
