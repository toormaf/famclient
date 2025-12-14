import { useState, useEffect } from 'react';
import { Input, Tabs, Badge, Avatar, Dropdown, Typography, Button, Switch, Spin } from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  BellOutlined,
  InboxOutlined,
  PushpinOutlined,
  DeleteOutlined,
  CheckOutlined,
  UsergroupAddOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import ChatService, { Conversation } from '../../services/Chat.service';
import moment from 'moment';

const { Search } = Input;
const { Text } = Typography;

function Chat() {
  const [activeTab, setActiveTab] = useState<'personal' | 'group' | 'public'>('personal');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [counts, setCounts] = useState({ personal: 0, group: 0, public: 0 });
  const [loading, setLoading] = useState(false);
  const [hideMuted, setHideMuted] = useState(false);
  const userId = 'current-user-id';

  useEffect(() => {
    loadConversations();
    loadCounts();
  }, [activeTab, hideMuted]);

  const loadConversations = async () => {
    setLoading(true);
    const data = await ChatService.getConversations(activeTab, userId, !hideMuted);
    setConversations(data);
    setLoading(false);
  };

  const loadCounts = async () => {
    const countsData = await ChatService.getConversationCounts(userId);
    setCounts(countsData);
  };

  const handleSearch = async (value: string) => {
    if (value.trim()) {
      const results = await ChatService.searchConversations(value, userId);
      setConversations(results);
    } else {
      loadConversations();
    }
  };

  const handleMarkAsRead = async (conversationId: string) => {
    await ChatService.markAsRead(conversationId, userId);
    loadConversations();
  };

  const handleMuteChat = async (conversationId: string, isMuted: boolean) => {
    await ChatService.muteConversation(conversationId, userId, !isMuted);
    loadConversations();
  };

  const handleArchiveChat = async (conversationId: string) => {
    await ChatService.archiveConversation(conversationId, userId, true);
    loadConversations();
    loadCounts();
  };

  const handlePinChat = async (conversationId: string, isPinned: boolean) => {
    await ChatService.pinConversation(conversationId, userId, !isPinned);
    loadConversations();
  };

  const handleDeleteChat = async (conversationId: string) => {
    await ChatService.deleteConversation(conversationId, userId);
    loadConversations();
    loadCounts();
  };

  const formatTime = (dateString: string) => {
    const date = moment(dateString);
    const now = moment();

    if (date.isSame(now, 'day')) {
      return date.format('h:mm a');
    } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
      return 'yesterday';
    } else {
      return date.format('MMM D');
    }
  };

  const getMenuItems = (conversation: Conversation) => [
    {
      key: 'mark-read',
      icon: <EyeOutlined />,
      label: 'Mark as read',
      onClick: () => handleMarkAsRead(conversation.id),
    },
    {
      key: 'mute',
      icon: <BellOutlined />,
      label: conversation.participant_settings?.is_muted ? 'Unmute chat' : 'Mute chat',
      onClick: () => handleMuteChat(conversation.id, conversation.participant_settings?.is_muted || false),
    },
    {
      key: 'archive',
      icon: <InboxOutlined />,
      label: 'Archive chat',
      onClick: () => handleArchiveChat(conversation.id),
    },
    {
      key: 'pin',
      icon: <PushpinOutlined />,
      label: conversation.participant_settings?.is_pinned ? 'Unpin chat' : 'Pin chat',
      onClick: () => handlePinChat(conversation.id, conversation.participant_settings?.is_pinned || false),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete chat',
      danger: true,
      onClick: () => handleDeleteChat(conversation.id),
    },
  ];

  const tabItems = [
    {
      key: 'personal',
      label: (
        <span className="text-sm font-medium">
          Personal <span className="text-gray-500">({counts.personal})</span>
        </span>
      ),
    },
    {
      key: 'group',
      label: (
        <span className="text-sm font-medium">
          Groups <span className="text-gray-500">({counts.group})</span>
        </span>
      ),
    },
    {
      key: 'public',
      label: (
        <span className="text-sm font-medium">
          Public <span className="text-gray-500">({counts.public})</span>
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 border-b border-gray-200">
        <Search
          placeholder="Search chat or conversation here"
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
          size="large"
          allowClear
        />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'personal' | 'group' | 'public')}
        items={tabItems}
        className="px-4"
      />

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Avatar
                  size={48}
                  src={conversation.avatar_url}
                  className="flex-shrink-0"
                  style={{ backgroundColor: '#f0f0f0' }}
                >
                  {conversation.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>

                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <Text strong className="text-base truncate">
                      {conversation.name || 'Unknown'}
                    </Text>
                    <Text className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {conversation.last_message?.created_at
                        ? formatTime(conversation.last_message.created_at)
                        : ''}
                    </Text>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      {conversation.participant_settings?.is_pinned && (
                        <CheckOutlined className="text-blue-500 mr-1 flex-shrink-0" />
                      )}
                      <Text className="text-sm text-gray-600 truncate">
                        {conversation.last_message?.content || 'No messages yet'}
                      </Text>
                    </div>
                    {conversation.unread_count && conversation.unread_count > 0 ? (
                      <Badge
                        count={conversation.unread_count}
                        className="ml-2 flex-shrink-0"
                        style={{ backgroundColor: '#5b8ff9' }}
                      />
                    ) : null}
                  </div>
                </div>

                <Dropdown
                  menu={{ items: getMenuItems(conversation) }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    className="ml-2 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Dropdown>
              </div>
            ))}

            {!loading && conversations.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 p-4 space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {hideMuted ? <EyeInvisibleOutlined className="mr-2" /> : <EyeOutlined className="mr-2" />}
            <Text className="text-sm">Hide muted conversations</Text>
          </div>
          <Switch
            checked={hideMuted}
            onChange={setHideMuted}
            size="small"
          />
        </div>

        <Button
          type="default"
          icon={<UsergroupAddOutlined />}
          className="w-full flex items-center justify-center"
          size="large"
        >
          Create new chat or group
        </Button>
      </div>
    </div>
  );
}

export default Chat;
