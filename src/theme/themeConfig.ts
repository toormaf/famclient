import type { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',

    fontSize: 14,
    borderRadius: 6,

    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgElevated: '#ffffff',

    fontFamily: 'Roboto, Lato, "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      controlHeight: 36,
      fontWeight: 500,
    },
    Input: {
      controlHeight: 36,
    },
    Select: {
      controlHeight: 36,
    },
    Card: {
      borderRadiusLG: 8,
    },
  },
};

export default themeConfig;
