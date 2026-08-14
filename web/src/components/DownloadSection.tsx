import type { ReactNode } from 'react';
import { App, Button, QRCode, Tabs, Typography } from 'antd';
import {
  AndroidOutlined,
  AppleOutlined,
  AppstoreOutlined,
  CodeOutlined,
  CopyOutlined,
  DesktopOutlined,
  ExportOutlined,
  HistoryOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  WindowsOutlined,
} from '@ant-design/icons';
import { latestLabel, type PlatformState, type ReleasesMap } from '../api/releases';

const SITE_REPO_URL = 'https://remotepro.cn';
const SILEO_SOURCE_URL = `sileo://source/${SITE_REPO_URL}`;
const CYDIA_SOURCE_URL = `cydia://url/https://cydia.saurik.com/api/share#?source=${SITE_REPO_URL}`;

interface DownloadSectionProps {
  releases: ReleasesMap;
  onOpenHistory: () => void;
}

function DownloadButton({
  state,
  icon,
  subtitle,
  className,
}: {
  state: PlatformState;
  icon: ReactNode;
  subtitle: string;
  className: string;
}) {
  const href = state.latest?.url;
  return (
    <Button
      className={`download-btn ${className}`}
      type="primary"
      size="large"
      href={href || undefined}
      disabled={!href}
      icon={icon}
    >
      <span className="download-btn-copy">
        <small>{subtitle}</small>
        <strong>{latestLabel(state)}</strong>
      </span>
    </Button>
  );
}

export function VsixZone({ state }: { state: PlatformState }) {
  return (
    <section className="zone zone-dev hero-vsix" id="zone-vsix">
      <div className="zone-head">
        <span className="zone-tag">
          <CodeOutlined /> 脚本开发扩展
        </span>
        <p>在 VS Code、Cursor、Trae、Qoder、Windsurf、Kiro 中安装，用于编写、调试与部署自动化脚本。</p>
      </div>
      <div className="vsix-wrap">
        <DownloadButton
          state={state}
          icon={<CodeOutlined />}
          subtitle="VS Code 及兼容编辑器 · 扩展"
          className="btn-vsix"
        />
        <a className="vsix-guide-link" href="/guide">
          不会装？看小白教程 →
        </a>
      </div>
    </section>
  );
}

function SourceRepo() {
  const { message } = App.useApp();

  const copyUrl = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SITE_REPO_URL);
      } else {
        const ta = document.createElement('textarea');
        ta.value = SITE_REPO_URL;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      message.success('地址已复制');
    } catch {
      message.error('复制失败，请长按手动复制');
    }
  };

  const panel = (openHref: string, qrValue: string, hint: string, openLabel: string) => (
    <div>
      <div className="repo-qr">
        <QRCode value={qrValue} size={168} bordered={false} />
      </div>
      <Typography.Text className="repo-hint" type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 8 }}>
        {hint}
      </Typography.Text>
      <Typography.Link className="repo-url" onClick={copyUrl}>
        {SITE_REPO_URL}
      </Typography.Link>
      <div className="repo-actions">
        <Button icon={<CopyOutlined />} onClick={copyUrl}>
          复制软件源地址
        </Button>
        <Button href={openHref} icon={<ExportOutlined />}>
          {openLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <Tabs
      centered
      items={[
        {
          key: 'sileo',
          label: 'Sileo',
          children: panel(SILEO_SOURCE_URL, SILEO_SOURCE_URL, '可用手机相机 APP 扫码，软件源地址：', '用 Sileo 打开'),
        },
        {
          key: 'cydia',
          label: 'Cydia',
          children: panel(CYDIA_SOURCE_URL, CYDIA_SOURCE_URL, '如不方便扫码，请手动输入软件源地址：', '用 Cydia 打开'),
        },
      ]}
    />
  );
}

export function DownloadSection({ releases, onOpenHistory }: DownloadSectionProps) {
  return (
    <div className="zones" id="download">
      <section className="zone zone-control" id="zone-control">
        <div className="zone-head">
          <span className="zone-tag">
            <DesktopOutlined /> 控制端
          </span>
          <p>在电脑或手机上安装，用于连接并管理已越狱的 iOS 设备。</p>
        </div>
        <div className="download-grid">
          <DownloadButton
            state={releases.win}
            icon={<WindowsOutlined />}
            subtitle="Windows · 控制端"
            className="btn-win"
          />
          <DownloadButton
            state={releases.mac}
            icon={<AppleOutlined />}
            subtitle="macOS · 控制端"
            className="btn-mac"
          />
          <DownloadButton
            state={releases.android}
            icon={<AndroidOutlined />}
            subtitle="Android · 控制端"
            className="btn-android"
          />
          <DownloadButton
            state={releases.iphone}
            icon={<AppstoreOutlined />}
            subtitle="iPhone · 控制端"
            className="btn-iphone"
          />
        </div>
      </section>

      <div className="history-row">
        <Button type="link" icon={<HistoryOutlined />} onClick={onOpenHistory}>
          查看历史版本下载
        </Button>
        <p className="trust-line">
          <SafetyCertificateOutlined /> 安全纯净无广告 · 持续更新维护
        </p>
      </div>

      <section className="zone zone-client" id="zone-client">
        <div className="zone-head">
          <span className="zone-tag">
            <MobileOutlined /> 被控端
          </span>
          <p>在被控的越狱 iPhone 上使用 Sileo 或 Cydia 添加源，安装被控端软件。</p>
        </div>
        <SourceRepo />
      </section>
    </div>
  );
}
