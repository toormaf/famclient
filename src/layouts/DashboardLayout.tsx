import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  MessageOutlined,
  SafetyOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard/home',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/dashboard/connects',
      icon: <TeamOutlined />,
      label: 'Connects',
    },
    {
      key: '/dashboard/chat',
      icon: <MessageOutlined />,
      label: 'Chat',
    },
    {
      key: '/dashboard/vault',
      icon: <SafetyOutlined />,
      label: 'Vault',
    },
    {
      key: '/dashboard/notes',
      icon: <FileTextOutlined />,
      label: 'Notes',
    },
    {
      key: '/dashboard/maps',
      icon: <EnvironmentOutlined />,
      label: 'Maps',
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
        <Content style={{ margin: '24px', background: '#fff', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
