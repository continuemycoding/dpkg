import { useMemo, useState, type ReactNode } from 'react';
import { App, Button, QRCode } from 'antd';
import {
  AndroidOutlined,
  AppleOutlined,
  AppstoreOutlined,
  BookOutlined,
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
import { brand } from '../brand';

const SITE_REPO_URL = brand.siteUrl;
const SILEO_SOURCE_URL = `sileo://source/${SITE_REPO_URL}`;
const CYDIA_SOURCE_URL = `cydia://url/https://cydia.saurik.com/api/share#?source=${SITE_REPO_URL}`;

function canOpenJailbreakStore() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return true;
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

interface DownloadSectionProps {
  releases: ReleasesMap;
  onOpenHistory: () => void;
}

function PlatformChip({
  state,
  icon,
  label,
  variant,
}: {
  state: PlatformState;
  icon: ReactNode;
  label: string;
  variant: 'win' | 'mac' | 'android' | 'iphone';
}) {
  const href = state.latest?.url;
  const className = `platform-chip chip-${variant}${href ? '' : ' is-disabled'}`;
  const inner = (
    <>
      <span className="platform-chip-icon">{icon}</span>
      <span className="platform-chip-copy">
        <strong>{label}</strong>
        <small>{latestLabel(state)}</small>
      </span>
    </>
  );

  if (!href) {
    return <span className={className}>{inner}</span>;
  }

  return (
    <a className={className} href={href}>
      {inner}
    </a>
  );
}

function ClientCard() {
  const { message } = App.useApp();
  const showOpenButton = useMemo(() => canOpenJailbreakStore(), []);
  const [store, setStore] = useState<'sileo' | 'cydia'>('sileo');
  const openHref = store === 'sileo' ? SILEO_SOURCE_URL : CYDIA_SOURCE_URL;
  const qrValue = store === 'sileo' ? SILEO_SOURCE_URL : CYDIA_SOURCE_URL;
  const openLabel = store === 'sileo' ? '用 Sileo 打开' : '用 Cydia 打开';

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

  return (
    <article className="product-card tone-client" id="zone-client">
      <div className="product-body">
        <p className="product-label">
          <MobileOutlined /> 被控端
        </p>
        <h3>越狱设备软件源</h3>
        <p>在被控的越狱 iPhone 上使用 Sileo 或 Cydia 添加源，安装被控端软件。</p>
        <div className="client-source">
          <div className="product-qr-frame">
            <QRCode value={qrValue} size={112} bordered={false} color="#111111" bgColor="#ffffff" />
          </div>
          <div className="client-source-controls">
            <div className="store-switch" role="tablist" aria-label="软件源类型">
              <button
                type="button"
                role="tab"
                aria-selected={store === 'sileo'}
                className={store === 'sileo' ? 'is-active' : ''}
                onClick={() => setStore('sileo')}
              >
                Sileo
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={store === 'cydia'}
                className={store === 'cydia' ? 'is-active' : ''}
                onClick={() => setStore('cydia')}
              >
                Cydia
              </button>
            </div>
            <div className="command-bar">
              <code>{SITE_REPO_URL}</code>
              <button type="button" onClick={copyUrl} aria-label="复制软件源地址">
                <CopyOutlined />
                复制
              </button>
            </div>
            {showOpenButton ? (
              <a className="product-btn" href={openHref}>
                <ExportOutlined />
                {openLabel}
              </a>
            ) : (
              <p className="product-hint">手机相机扫码即可添加；不方便扫码时，复制地址手动输入。</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function DownloadSection({ releases, onOpenHistory }: DownloadSectionProps) {
  const vsixHref = releases.vsix.latest?.url;

  return (
    <>
      <div className="products" id="download">
        <article className="product-card tone-control" id="zone-control">
          <div className="product-body">
            <p className="product-label">
              <DesktopOutlined /> 控制端
            </p>
            <h3>连接并管理设备</h3>
            <p>在电脑或手机上安装，用于连接并管理已越狱的 iOS 设备。</p>
            <div className="platform-grid">
              <PlatformChip state={releases.win} icon={<WindowsOutlined />} label="Windows" variant="win" />
              <PlatformChip state={releases.mac} icon={<AppleOutlined />} label="macOS" variant="mac" />
              <PlatformChip state={releases.android} icon={<AndroidOutlined />} label="Android" variant="android" />
              <PlatformChip state={releases.iphone} icon={<AppstoreOutlined />} label="iPhone" variant="iphone" />
            </div>
          </div>
        </article>

        {brand.showScripts ? (
          <article className="product-card tone-dev" id="zone-vsix">
            <div className="product-body">
              <p className="product-label">
                <CodeOutlined /> 脚本扩展
              </p>
              <h3>在编辑器里写自动化</h3>
              <p>
                在 VS Code、Cursor、Trae、Qoder、CodeBuddy、Devin Desktop、Kiro 中安装，用于编写、调试与部署脚本。
              </p>
              <div className="product-actions">
                {vsixHref ? (
                  <a className="product-btn" href={vsixHref}>
                    下载 .vsix
                  </a>
                ) : (
                  <span className="product-btn is-disabled">下载 .vsix</span>
                )}
                <a className="product-btn-ghost" href="/guide">
                  安装说明
                </a>
              </div>
              <p className="product-hint">{latestLabel(releases.vsix)}</p>
            </div>
          </article>
        ) : null}

        <ClientCard />

        {brand.showScripts ? (
          <article className="product-card tone-guide">
            <div className="product-body">
              <p className="product-label">
                <BookOutlined /> 教程
              </p>
              <h3>零基础也能写脚本</h3>
              <p>按编辑器安装扩展，连上手机，再用 AI Agent 用中文写出第一条脚本。</p>
              <div className="product-actions">
                <a className="product-btn" href="/guide">
                  打开脚本教程
                </a>
                <a className="product-btn-ghost" href="/guide#agent">
                  用 AI 写脚本
                </a>
              </div>
            </div>
          </article>
        ) : null}
      </div>

      <div className="history-row">
        {brand.showHistory ? (
          <Button type="link" icon={<HistoryOutlined />} onClick={onOpenHistory}>
            查看历史版本下载
          </Button>
        ) : null}
        <p className="trust-line">
          <SafetyCertificateOutlined /> 安全纯净无广告 · 持续更新维护
        </p>
      </div>
    </>
  );
}
