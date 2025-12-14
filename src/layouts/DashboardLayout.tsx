import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Tooltip } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  MessageOutlined,
  SafetyOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { GremlinGuide } from '../components';

const { Header, Sider, Content } = Layout;

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showTourGuide, setShowTourGuide] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard/home',
      icon: <HomeOutlined />,
      label: 'Home',
      className: 'home-section',
    },
    {
      key: '/dashboard/connects',
      icon: <TeamOutlined />,
      label: 'Connects',
      className: 'connects-section',
    },
    {
      key: '/dashboard/chat',
      icon: <MessageOutlined />,
      label: 'Chat',
      className: 'chat-section',
    },
    {
      key: '/dashboard/vault',
      icon: <SafetyOutlined />,
      label: 'Vault',
      className: 'vault-section',
    },
    {
      key: '/dashboard/notes',
      icon: <FileTextOutlined />,
      label: 'Notes',
      className: 'notes-section',
    },
    {
      key: '/dashboard/maps',
      icon: <EnvironmentOutlined />,
      label: 'Maps',
      className: 'maps-section',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex items-center justify-center py-4">
          <img
            src="/src/public/image/favicon.svg"
            alt="Famroot"
            className={collapsed ? "h-8 w-8" : "h-10 w-10"}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#2c3e50' }}>
            Famroot
          </h1>
          <Tooltip title="Start Tour Guide">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<QuestionCircleOutlined />}
              onClick={() => setShowTourGuide(true)}
              style={{
                background: '#7CB342',
                borderColor: '#7CB342',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </Tooltip>
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
      <GremlinGuide
        isVisible={showTourGuide}
        onClose={() => setShowTourGuide(false)}
      />
    </Layout>
  );
}

export default DashboardLayout;
