import { Card, Typography, List, Avatar } from 'antd';
import { EnvironmentOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const mockLocations = [
  { id: 1, name: 'John Doe', location: 'New York, USA', distance: '0 mi' },
  { id: 2, name: 'Jane Doe', location: 'Los Angeles, USA', distance: '2,789 mi' },
  { id: 3, name: 'Alice Doe', location: 'Chicago, USA', distance: '790 mi' },
  { id: 4, name: 'Bob Doe', location: 'Miami, USA', distance: '1,280 mi' },
];

function Maps() {
  return (
    <div>
      <Title level={2}>
        <EnvironmentOutlined className="mr-2" />
        Maps
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="md:col-span-2" style={{ minHeight: '400px' }}>
          <div className="h-full flex items-center justify-center bg-gray-100 rounded">
            <Paragraph className="text-gray-400">Map view will be displayed here</Paragraph>
          </div>
        </Card>
        <Card title="Family Locations" className="md:col-span-1">
          <List
            itemLayout="horizontal"
            dataSource={mockLocations}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.name}
                  description={
                    <div>
                      <div>{item.location}</div>
                      <div className="text-xs text-gray-400">{item.distance}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}

export default Maps;
