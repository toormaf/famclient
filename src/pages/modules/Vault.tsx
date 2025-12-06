import { Card, Typography, List, Button } from 'antd';
import { SafetyOutlined, FileOutlined, FolderOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const mockDocuments = [
  { id: 1, name: 'Birth Certificates', type: 'folder', items: 3 },
  { id: 2, name: 'Medical Records', type: 'folder', items: 5 },
  { id: 3, name: 'Property Documents', type: 'folder', items: 2 },
  { id: 4, name: 'Family Photos', type: 'folder', items: 120 },
];

function Vault() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Title level={2}>
          <SafetyOutlined className="mr-2" />
          Vault
        </Title>
        <Button type="primary" icon={<UploadOutlined />}>
          Upload
        </Button>
      </div>
      <Card className="mt-6">
        <List
          itemLayout="horizontal"
          dataSource={mockDocuments}
          renderItem={(item) => (
            <List.Item style={{ cursor: 'pointer' }}>
              <List.Item.Meta
                avatar={item.type === 'folder' ? <FolderOutlined style={{ fontSize: '24px', color: '#faad14' }} /> : <FileOutlined style={{ fontSize: '24px' }} />}
                title={item.name}
                description={`${item.items} items`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default Vault;
