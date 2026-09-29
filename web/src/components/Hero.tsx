import { ApiOutlined, DesktopOutlined, DownloadOutlined, ThunderboltOutlined, WifiOutlined } from '@ant-design/icons';
import { brand } from '../brand';

export function Hero() {
  return (
    <section className="hero">
      <p className="hero-kicker">免越狱 iOS 18+ · 越狱 iOS 13 – 26.0.1</p>
      <h1>批量投屏与群控</h1>
      <p className="hero-lead">
        专业级 iOS 设备控制。iOS 18 及以上免越狱，电脑直接连接，无需被控端，支持 USB 与同一局域网。越狱设备安装被控端后，还可使用广域网远程控制。
      </p>
      <div className="hero-actions">
        <a className="hero-cta" href="#download">
          <DownloadOutlined />
          立即下载
        </a>
        {brand.docsUrl ? (
          <a className="hero-cta-ghost" href={brand.docsUrl} target="_blank" rel="noopener noreferrer">
            <ApiOutlined />
            API 文档
          </a>
        ) : null}
      </div>
      <div className="hero-stats">
        <div className="hero-stat">
          <WifiOutlined className="hero-stat-icon" />
          <strong>多种连接</strong>
          <span>USB / 局域网，越狱可广域网</span>
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
    </section>
  );
}
