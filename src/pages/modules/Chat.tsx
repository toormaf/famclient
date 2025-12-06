import { Card, Typography, List, Avatar, Input, Button } from 'antd';
import { MessageOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const mockChats = [
  { id: 1, name: 'Family Group', lastMessage: 'Hello everyone!', time: '10:30 AM' },
  { id: 2, name: 'John Doe', lastMessage: 'How are you?', time: '9:15 AM' },
  { id: 3, name: 'Jane Doe', lastMessage: 'See you soon', time: 'Yesterday' },
];

function Chat() {
  return (
    <div>
      <Title level={2}>
        <MessageOutlined className="mr-2" />
        Chat
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card title="Conversations" className="md:col-span-1">
          <List
            itemLayout="horizontal"
            dataSource={mockChats}
            renderItem={(item) => (
              <List.Item style={{ cursor: 'pointer' }}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.name}
                  description={item.lastMessage}
                />
                <div className="text-xs text-gray-400">{item.time}</div>
              </List.Item>
            )}
          />
        </Card>
        <Card title="Messages" className="md:col-span-2">
          <div className="h-96 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4">
              <p className="text-center text-gray-400">Select a conversation to start chatting</p>
            </div>
            <div className="flex gap-2">
              <TextArea
                placeholder="Type a message..."
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
              <Button type="primary" icon={<SendOutlined />}>
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Chat;
