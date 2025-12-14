import { useState, useEffect, useRef } from 'react';
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
  EyeInvisibleOutlined,
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  ClockCircleOutlined,
  ShareAltOutlined,
  WarningOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';
import ChatService, { Conversation, Message } from '../../services/Chat.service';
import moment from 'moment';

const { Search } = Input;
const { Text } = Typography;

function Chat() {
  const [activeTab, setActiveTab] = useState<'personal' | 'group' | 'public'>('personal');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [counts, setCounts] = useState({ personal: 0, group: 0, public: 0 });
  const [loading, setLoading] = useState(false);
  const [hideMuted, setHideMuted] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = 'current-user-id';

  useEffect(() => {
    loadConversations();
    loadCounts();
  }, [activeTab, hideMuted]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      loadPinnedMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const loadMessages = async (conversationId: string) => {
    const data = await ChatService.getMessages(conversationId);
    setMessages(data);
  };

  const loadPinnedMessages = async (conversationId: string) => {
    const data = await ChatService.getPinnedMessages(conversationId);
    setPinnedMessages(data);
  };

  const handleSearch = async (value: string) => {
    if (value.trim()) {
      const results = await ChatService.searchConversations(value, userId);
      setConversations(results);
    } else {
      loadConversations();
    }
  };

  const handleMessageSearch = async (value: string) => {
    if (selectedConversation && value.trim()) {
      const results = await ChatService.searchMessages(selectedConversation.id, value);
      setMessages(results);
    } else if (selectedConversation) {
      loadMessages(selectedConversation.id);
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
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
    }
    loadConversations();
    loadCounts();
  };

  const handlePinMessage = async (messageId: string, isPinned: boolean) => {
    await ChatService.pinMessage(messageId, !isPinned);
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      loadPinnedMessages(selectedConversation.id);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    await ChatService.deleteMessage(messageId);
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !messageInput.trim()) return;

    await ChatService.sendMessage(selectedConversation.id, userId, messageInput);
    setMessageInput('');
    loadMessages(selectedConversation.id);
    loadConversations();
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

  const formatMessageTime = (dateString: string) => {
    return moment(dateString).format('h:mm a');
  };

  const getConversationMenuItems = (conversation: Conversation) => [
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

  const getMessageMenuItems = (message: Message) => [
    {
      key: 'mark-unread',
      icon: <EyeOutlined />,
      label: 'Mark as unread',
      onClick: () => {},
    },
    {
      key: 'pin',
      icon: <PushpinOutlined />,
      label: message.is_pinned ? 'Unpin message' : 'Pin message',
      onClick: () => handlePinMessage(message.id, message.is_pinned),
    },
    {
      key: 'forward',
      icon: <ShareAltOutlined />,
      label: 'Forward',
      onClick: () => {},
    },
    {
      key: 'remind',
      icon: <ClockCircleOutlined />,
      label: 'Remind me',
      onClick: () => {},
    },
    {
      key: 'report',
      icon: <WarningOutlined />,
      label: 'Report spam',
      onClick: () => {},
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete message',
      danger: true,
      onClick: () => handleDeleteMessage(message.id),
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

  const renderDateSeparator = (date: string) => {
    const messageDate = moment(date);
    const today = moment();
    const yesterday = moment().subtract(1, 'day');

    let label = messageDate.format('MMMM DD, YYYY');
    if (messageDate.isSame(today, 'day')) {
      label = 'Today';
    } else if (messageDate.isSame(yesterday, 'day')) {
      label = 'Yesterday';
    }

    return (
      <div className="flex justify-center my-4">
        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs">
          {label}
        </span>
      </div>
    );
  };

  const renderMessage = (message: Message, index: number) => {
    const isOwnMessage = message.sender_id === userId;
    const showDateSeparator = index === 0 ||
      !moment(messages[index - 1].created_at).isSame(message.created_at, 'day');

    if (message.is_system_message) {
      return (
        <div key={message.id}>
          {showDateSeparator && renderDateSeparator(message.created_at)}
          <div className="flex justify-center my-3">
            <span className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm">
              {message.content}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id}>
        {showDateSeparator && renderDateSeparator(message.created_at)}
        <div className={`flex items-start gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
          {!isOwnMessage && (
            <Avatar size={40} src={selectedConversation?.avatar_url} className="flex-shrink-0">
              {selectedConversation?.name?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          )}

          <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
            <div
              className={`px-4 py-2 rounded-lg ${
                isOwnMessage
                  ? 'bg-teal-500 text-white'
                  : 'bg-orange-50 text-gray-800'
              }`}
            >
              <Text className={isOwnMessage ? 'text-white' : 'text-gray-800'}>
                {message.content}
              </Text>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Text className="text-xs text-gray-500">{formatMessageTime(message.created_at)}</Text>
              {isOwnMessage && (
                <CheckCircleTwoTone twoToneColor="#52c41a" className="text-xs" />
              )}
            </div>
          </div>

          <Dropdown
            menu={{ items: getMessageMenuItems(message) }}
            trigger={['click']}
            placement={isOwnMessage ? 'bottomLeft' : 'bottomRight'}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Dropdown>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex flex-col w-[400px] border-r border-gray-200">
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
                  className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
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
                    menu={{ items: getConversationMenuItems(conversation) }}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      icon={<MoreOutlined />}
                      className="ml-2 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
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

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <Avatar size={48} src={selectedConversation.avatar_url}>
                  {selectedConversation.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <div>
                  <Text strong className="text-lg block">
                    {selectedConversation.name || 'Unknown'}
                  </Text>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <Text className="text-sm text-gray-500">Online</Text>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Search
                  placeholder="Search here"
                  className="w-80"
                  onChange={(e) => handleMessageSearch(e.target.value)}
                  allowClear
                />
                <Dropdown
                  menu={{ items: getConversationMenuItems(selectedConversation) }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button type="text" icon={<MoreOutlined />} size="large" />
                </Dropdown>
              </div>
            </div>

            {pinnedMessages.length > 0 && (
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <PushpinOutlined className="text-gray-600" />
                  <Text strong className="text-sm">Pinned Message :</Text>
                  <Text className="text-sm text-gray-700">{pinnedMessages[0].content}</Text>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => (
                <div key={message.id} className="group">
                  {renderMessage(message, index)}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Button
                  type="text"
                  icon={<PaperClipOutlined className="text-gray-500 text-xl" />}
                  size="large"
                />
                <Input
                  placeholder="Enter your message here"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onPressEnter={handleSendMessage}
                  className="flex-1"
                  size="large"
                  suffix={<SmileOutlined className="text-gray-400" />}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  shape="circle"
                  size="large"
                  onClick={handleSendMessage}
                  className="bg-teal-500 hover:bg-teal-600"
                  style={{ width: 48, height: 48 }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Text className="text-gray-400 text-lg">Select a conversation to start chatting</Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
