import { useMemo, useState, type ReactNode } from 'react';
import { App, QRCode } from 'antd';
import {
  AndroidFilled,
  AppleFilled,
  ArrowRightOutlined,
  BookOutlined,
  CheckOutlined,
  CodeOutlined,
  CopyOutlined,
  DesktopOutlined,
  DownloadOutlined,
  ExportOutlined,
  HistoryOutlined,
  MobileOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  WindowsFilled,
} from '@ant-design/icons';
import { latestLabel, type PlatformState, type ReleasesMap } from '../api/releases';
import { brand } from '../brand';
import { canOpenJailbreakStore, copyText, detectPlatform, PLATFORM_LABEL, type ClientPlatform } from '../platform';

const SITE_REPO_URL = brand.siteUrl;
const SILEO_SOURCE_URL = `sileo://source/${SITE_REPO_URL}`;
const CYDIA_SOURCE_URL = `cydia://url/https://cydia.saurik.com/api/share#?source=${SITE_REPO_URL}`;

const PLATFORMS: { key: ClientPlatform; icon: ReactNode; req: string }[] = [
  { key: 'win', icon: <WindowsFilled />, req: 'Windows 10 (1809+) / 11' },
  { key: 'mac', icon: <AppleFilled />, req: 'macOS 13+，Intel 与 M 系列' },
  { key: 'android', icon: <AndroidFilled />, req: '安卓手机 / 平板' },
  { key: 'iphone', icon: <MobileOutlined />, req: 'iPhone / iPad，IPA 安装包' },
];

interface DownloadSectionProps {
  releases: ReleasesMap;
  onOpenHistory: () => void;
}

function PlatformTile({
  state,
  icon,
  label,
  req,
  recommended,
}: {
  state: PlatformState;
  icon: ReactNode;
  label: string;
  req: string;
  recommended: boolean;
}) {
  const href = state.latest?.url;
  const className = `platform-tile${recommended ? ' is-recommended' : ''}${href ? '' : ' is-disabled'}`;
  const inner = (
    <>
      {recommended ? <span className="platform-tile-badge">当前设备</span> : null}
      <span className="platform-tile-icon">{icon}</span>
      <span className="platform-tile-copy">
        <strong>{label}</strong>
        <small>{req}</small>
      </span>
      <span className="platform-tile-foot">
        <span className={`platform-tile-version${state.status === 'loading' ? ' is-loading' : ''}`}>
          {latestLabel(state)}
        </span>
        <span className="platform-tile-action">
          <DownloadOutlined />
        </span>
      </span>
    </>
  );

  if (!href) {
    return (
      <span className={className} aria-disabled="true">
        {inner}
      </span>
    );
  }

  return (
    <a className={className} href={href} aria-label={`下载 ${label} 版控制端`}>
      {inner}
    </a>
  );
}

function IphoneSource() {
  const { message } = App.useApp();
  const showOpenButton = useMemo(() => canOpenJailbreakStore(), []);
  const [store, setStore] = useState<'sileo' | 'cydia'>('sileo');
  const [copied, setCopied] = useState(false);
  const storeUrl = store === 'sileo' ? SILEO_SOURCE_URL : CYDIA_SOURCE_URL;
  const storeName = store === 'sileo' ? 'Sileo' : 'Cydia';

  const copyUrl = async () => {
    try {
      await copyText(SITE_REPO_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      message.success('软件源地址已复制');
    } catch {
      message.error('复制失败，请长按地址手动复制');
    }
  };

  return (
    <div className="client-option" id="zone-iphone-client">
      <div className="client-option-head">
        <span className="client-option-icon">
          <AppleFilled />
        </span>
        <div>
          <h4>越狱 iPhone</h4>
          <p>支持 iOS 13 – 26.0.1，任意越狱方式</p>
        </div>
      </div>
      <p className="client-option-desc">在 Sileo 或 Cydia 中添加下方软件源，安装被控端。iOS 18 及以上也可以免越狱直连，无需安装。</p>
      <div className="client-source">
        <div className="qr-frame">
          <QRCode value={storeUrl} size={112} bordered={false} color="#0b0c0c" bgColor="#ffffff" />
        </div>
        <div className="client-source-controls">
          <div className="segmented" role="tablist" aria-label="软件源类型">
            {(['sileo', 'cydia'] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={store === key}
                className={store === key ? 'is-active' : ''}
                onClick={() => setStore(key)}
              >
                {key === 'sileo' ? 'Sileo' : 'Cydia'}
              </button>
            ))}
          </div>
          <div className="command-bar">
            <code>{SITE_REPO_URL}</code>
            <button type="button" onClick={copyUrl} aria-label="复制软件源地址" className={copied ? 'is-done' : ''}>
              {copied ? <CheckOutlined /> : <CopyOutlined />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
          {showOpenButton ? (
            <a className="btn btn-primary btn-sm" href={storeUrl}>
              <ExportOutlined />
              用 {storeName} 打开
            </a>
          ) : (
            <p className="panel-hint">用 iPhone 相机扫码，即可在 {storeName} 中添加。</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AndroidClient({ state }: { state: PlatformState }) {
  const href = state.latest?.url;
  const qrValue = href ? new URL(href, window.location.href).href : '';
  // 已经在安卓手机上打开时直接下载即可，不需要扫码
  const onAndroid = useMemo(() => detectPlatform() === 'android', []);

  return (
    <div className="client-option" id="zone-android-client">
      <div className="client-option-head">
        <span className="client-option-icon">
          <AndroidFilled />
        </span>
        <div>
          <h4>
            Android <span className="tag-new">新</span>
          </h4>
          <p>免 Root 即可使用，Root 后功能更全</p>
        </div>
      </div>
      <p className="client-option-desc">在被控的安卓手机上安装 APK 并保持运行，即可通过 USB、局域网或广域网接入控制端。</p>
      <div className={`client-source${onAndroid ? ' is-plain' : ''}`}>
        {onAndroid ? null : (
          <div className={`qr-frame${href ? '' : ' is-empty'}`}>
            {href ? (
              <QRCode value={qrValue} size={112} bordered={false} color="#0b0c0c" bgColor="#ffffff" />
            ) : (
              <AndroidFilled />
            )}
          </div>
        )}
        <div className="client-source-controls">
          <ul className="conn-chips" aria-label="支持的连接方式">
            <li>USB</li>
            <li>局域网</li>
            <li>广域网</li>
          </ul>
          {href ? (
            <a className="btn btn-primary btn-sm" href={href}>
              <DownloadOutlined />
              下载被控端 APK
            </a>
          ) : (
            <span className="btn btn-primary btn-sm is-disabled">下载被控端 APK</span>
          )}
          <p className="panel-hint">
            {latestLabel(state)}
            {href && !onAndroid ? ' · 用安卓手机扫码直接下载' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

function ClientPanel({ androidClient }: { androidClient: PlatformState }) {
  return (
    <article className="panel panel-client" id="zone-client">
      <header className="panel-head panel-head-row">
        <div>
          <p className="panel-label">
            <MobileOutlined /> 被控端
          </p>
          <h3>装在被控手机上</h3>
        </div>
        <p>iOS 18 及以上免越狱无需安装。安卓手机和越狱 iPhone 安装被控端后，可通过 USB、局域网或广域网连接。</p>
      </header>
      <div className="client-options">
        <AndroidClient state={androidClient} />
        <IphoneSource />
      </div>
    </article>
  );
}

function DevCard({ vsix }: { vsix: PlatformState }) {
  const vsixHref = vsix.latest?.url;

  return (
    <article className="panel panel-dev" id="zone-vsix">
      <header className="panel-head panel-head-row">
        <div>
          <p className="panel-label">
            <CodeOutlined /> 脚本开发
          </p>
          <h3>在编辑器里写自动化</h3>
        </div>
        <p>支持 VS Code、Cursor、Trae、Qoder、CodeBuddy、Kiro。不会写代码也没关系，用中文告诉 AI 就能生成脚本。</p>
      </header>
      <ol className="dev-steps">
        <li>
          <span className="dev-step-index">1</span>
          <div className="dev-step-body">
            <strong>安装扩展</strong>
            <small>{latestLabel(vsix)}</small>
          </div>
          <div className="dev-step-actions">
            {vsixHref ? (
              <a className="btn btn-primary btn-sm" href={vsixHref}>
                <DownloadOutlined /> 下载 .vsix
              </a>
            ) : (
              <span className="btn btn-primary btn-sm is-disabled">下载 .vsix</span>
            )}
            <a className="btn btn-ghost btn-sm" href="/guide?ide=vscode#install">
              安装说明
            </a>
          </div>
        </li>
        <li>
          <span className="dev-step-index">2</span>
          <div className="dev-step-body">
            <strong>开始写脚本</strong>
            <small>连上手机，跟着教程跑通第一条脚本</small>
          </div>
          <div className="dev-step-actions">
            <a className="btn btn-ghost btn-sm" href="/guide">
              <BookOutlined /> 脚本教程
            </a>
            <a className="btn btn-ghost btn-sm" href="/guide#agent">
              <RobotOutlined /> 用 AI 写
            </a>
          </div>
        </li>
      </ol>
    </article>
  );
}

export function DownloadSection({ releases, onOpenHistory }: DownloadSectionProps) {
  const detected = useMemo(() => detectPlatform(), []);

  return (
    <section className="section" id="download">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">下载</p>
          <h2>选择你的平台</h2>
          <p>控制端装在电脑或手机上；被控的安卓手机和越狱 iPhone 再安装被控端。</p>
        </div>

        <article className="panel panel-control" id="zone-control">
          <header className="panel-head panel-head-row">
            <div>
              <p className="panel-label">
                <DesktopOutlined /> 控制端
              </p>
              <h3>连接并管理设备</h3>
            </div>
            <p>
              iOS 18 及以上免越狱，由控制端直接连接（USB / 局域网）；安卓与越狱 iPhone 配合被控端，还可使用广域网。
            </p>
          </header>
          <div className="platform-grid">
            {PLATFORMS.map((item) => (
              <PlatformTile
                key={item.key}
                state={releases[item.key]}
                icon={item.icon}
                label={PLATFORM_LABEL[item.key]}
                req={item.req}
                recommended={item.key === detected}
              />
            ))}
          </div>
        </article>

        <ClientPanel androidClient={releases.androidClient} />

        {brand.showScripts ? <DevCard vsix={releases.vsix} /> : null}

        <div className="download-foot">
          <p className="trust-line">
            <SafetyCertificateOutlined /> 安全纯净无广告 · 持续更新维护
          </p>
          {brand.showHistory ? (
            <button type="button" className="text-link" onClick={onOpenHistory}>
              <HistoryOutlined /> 历史版本下载 <ArrowRightOutlined />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
