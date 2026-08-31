import { ApiOutlined, DesktopOutlined, DownloadOutlined, ThunderboltOutlined, WifiOutlined } from '@ant-design/icons';

export function Hero() {
  return (
    <section className="hero">
      <p className="hero-kicker">支持 iOS 13 – 26.0.1 · 任意越狱方式</p>
      <h1>
        专业级 iOS 设备
        <br />
        <em>批量投屏与群控</em>
      </h1>
      <p className="hero-lead">
        通过 USB、局域网或广域网连接，实现低延迟、高帧率的 iPhone 批量控制。
      </p>
      <div className="hero-actions">
        <a className="hero-cta" href="#download">
          <DownloadOutlined />
          立即下载
        </a>
        <a
          className="hero-cta-ghost"
          href="https://docs.remotepro.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ApiOutlined />
          API 文档
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
    </section>
  );
}
