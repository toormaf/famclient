import { Card, Typography, Button, Tag } from 'antd';
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const mockNotes = [
  { id: 1, title: 'Family Reunion Planning', date: '2025-12-05', tags: ['event', 'family'] },
  { id: 2, title: 'Grandma\'s Recipe', date: '2025-12-03', tags: ['recipe', 'food'] },
  { id: 3, title: 'Birthday Gift Ideas', date: '2025-12-01', tags: ['birthday', 'gifts'] },
  { id: 4, title: 'Vacation Plans', date: '2025-11-28', tags: ['travel', 'vacation'] },
];

function Notes() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <Title level={2}>
          <FileTextOutlined className="mr-2" />
          Notes
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          New Note
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {mockNotes.map((note) => (
          <Card key={note.id} hoverable>
            <Title level={4}>{note.title}</Title>
            <Paragraph className="text-gray-500 text-sm mb-2">{note.date}</Paragraph>
            <div>
              {note.tags.map((tag) => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Notes;
