import { Card, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function Home() {
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
    </div>
  );
}

export default Home;
