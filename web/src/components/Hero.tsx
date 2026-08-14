import { DesktopOutlined, ThunderboltOutlined, WifiOutlined } from '@ant-design/icons';
import type { PlatformState } from '../api/releases';
import { VsixZone } from './DownloadSection';

export function Hero({ vsix }: { vsix: PlatformState }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          支持 iOS 13 - 26.0.1 任何方式越狱的手机
        </div>
        <h1>
          专业级 iOS 设备
          <br />
          <span className="gradient-text">批量投屏与群控</span>
        </h1>
        <p className="hero-lead">
          通过 USB、局域网或广域网连接，实现低延迟、高帧率的 iPhone 批量控制。
        </p>
        <div className="hero-actions">
          <a className="hero-cta" href="#download">
            立即下载
          </a>
          <a className="hero-cta-ghost" href="https://docs.remotepro.cn/" target="_blank" rel="noopener noreferrer">
            API文档
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <WifiOutlined className="hero-stat-icon" />
            <strong>多种连接</strong>
            <span>USB / Wi‑Fi / 广域网</span>
          </div>
          <div className="hero-stat">
            <ThunderboltOutlined className="hero-stat-icon" />
            <strong>毫秒响应</strong>
            <span>低延迟实时投屏</span>
          </div>
          <div className="hero-stat">
            <DesktopOutlined className="hero-stat-icon" />
            <strong>多端控制</strong>
            <span>Win / Mac / 手机</span>
          </div>
        </div>
      </div>

      <VsixZone state={vsix} />
    </section>
  );
}
