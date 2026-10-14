import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

/** 与 App.css 中 :root 变量保持一致 */
const ACCENT = '#3ddcb8';
const ACCENT_INK = '#04241e';

export const FONT_SANS =
  '-apple-system, BlinkMacSystemFont, "PingFang SC", "HarmonyOS Sans SC", "MiSans", "Microsoft YaHei UI", "Microsoft YaHei", "Segoe UI", system-ui, sans-serif';

export const appTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: ACCENT,
    colorInfo: ACCENT,
    colorLink: ACCENT,
    colorTextLightSolid: ACCENT_INK,
    colorSuccess: '#5fd39a',
    colorWarning: '#f0c35b',
    colorBgBase: '#0b0c0c',
    colorBgLayout: '#0b0c0c',
    colorBgContainer: '#141616',
    colorBgElevated: '#181a1a',
    colorBorder: 'rgba(236, 240, 238, 0.12)',
    colorBorderSecondary: 'rgba(236, 240, 238, 0.07)',
    colorText: '#eceeed',
    colorTextSecondary: '#a0a7a4',
    colorTextTertiary: '#7c8380',
    borderRadius: 10,
    fontFamily: FONT_SANS,
    fontSize: 15,
    motionDurationMid: '0.18s',
  },
  components: {
    Button: {
      controlHeight: 38,
      controlHeightLG: 46,
      fontWeight: 600,
      primaryShadow: 'none',
      defaultShadow: 'none',
      defaultBg: 'transparent',
      defaultBorderColor: 'rgba(236, 240, 238, 0.16)',
      defaultHoverBg: 'rgba(236, 240, 238, 0.06)',
      defaultHoverBorderColor: 'rgba(236, 240, 238, 0.28)',
      defaultHoverColor: '#ffffff',
    },
    Modal: {
      contentBg: '#141616',
      headerBg: '#141616',
      footerBg: '#141616',
    },
    Collapse: {
      colorBgContainer: 'transparent',
      headerBg: 'transparent',
    },
    Tabs: {
      itemColor: '#a0a7a4',
      itemHoverColor: '#eceeed',
    },
    Drawer: {
      colorBgElevated: '#111313',
    },
  },
};
