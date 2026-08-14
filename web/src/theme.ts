import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

export const appTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#3b82f6',
    colorInfo: '#3b82f6',
    colorSuccess: '#34d399',
    colorWarning: '#f59e0b',
    colorBgBase: '#070b14',
    colorBgLayout: '#070b14',
    colorBgContainer: '#111827',
    colorBgElevated: '#1a2332',
    colorBorder: 'rgba(148, 163, 184, 0.18)',
    colorBorderSecondary: 'rgba(148, 163, 184, 0.1)',
    colorText: '#e8eefc',
    colorTextSecondary: '#94a3b8',
    borderRadius: 12,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
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
      controlHeightLG: 52,
      fontWeight: 600,
    },
    Card: {
      colorBgContainer: 'rgba(17, 24, 39, 0.72)',
    },
    Modal: {
      contentBg: '#111827',
      headerBg: '#111827',
      footerBg: '#111827',
    },
    Collapse: {
      colorBgContainer: 'rgba(17, 24, 39, 0.7)',
      headerBg: 'transparent',
    },
  },
};
