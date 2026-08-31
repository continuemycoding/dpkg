import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const appTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#ffffff',
    colorPrimaryHover: '#f4f4f5',
    colorPrimaryActive: '#e4e4e7',
    colorTextLightSolid: '#111111',
    colorInfo: '#8ea0b8',
    colorSuccess: '#8fbf9a',
    colorWarning: '#d4a574',
    colorBgBase: '#0c0c0b',
    colorBgLayout: '#0c0c0b',
    colorBgContainer: '#161513',
    colorBgElevated: '#1c1a17',
    colorBorder: 'rgba(243, 239, 230, 0.12)',
    colorBorderSecondary: 'rgba(243, 239, 230, 0.08)',
    colorText: '#f3efe6',
    colorTextSecondary: '#9a9488',
    borderRadius: 10,
    fontFamily:
      '"DM Sans", "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, sans-serif',
    fontSize: 15,
  },
  components: {
    Layout: {
      headerBg: 'transparent',
      bodyBg: 'transparent',
      footerBg: 'transparent',
      headerPadding: '0 24px',
    },
    Button: {
      controlHeightLG: 48,
      fontWeight: 600,
      primaryColor: '#111111',
      borderRadius: 10,
      primaryShadow: 'none',
    },
    Card: {
      colorBgContainer: 'rgba(22, 21, 19, 0.86)',
    },
    Modal: {
      contentBg: '#161513',
      headerBg: '#161513',
      footerBg: '#161513',
    },
    Collapse: {
      colorBgContainer: 'transparent',
      headerBg: 'transparent',
    },
  },
};
