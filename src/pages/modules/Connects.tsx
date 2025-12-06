import { Card, Typography, Avatar, List } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const mockConnections = [
  { id: 1, name: 'John Doe', relation: 'Father' },
  { id: 2, name: 'Jane Doe', relation: 'Mother' },
  { id: 3, name: 'Alice Doe', relation: 'Sister' },
  { id: 4, name: 'Bob Doe', relation: 'Brother' },
];

function Connects() {
  return (
    <div>
      <Title level={2}>
        <TeamOutlined className="mr-2" />
        Connects
      </Title>
      <Card className="mt-6">
        <List
          itemLayout="horizontal"
          dataSource={mockConnections}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.name}
                description={item.relation}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default Connects;
