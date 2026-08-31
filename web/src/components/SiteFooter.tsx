import { DesktopOutlined } from '@ant-design/icons';

export type LegalType = 'about' | 'terms' | 'privacy';

interface SiteFooterProps {
  onOpenLegal: (type: LegalType) => void;
}

export function SiteFooter({ onOpenLegal }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <a className="brand" href="/">
            <span className="brand-mark">
              <DesktopOutlined />
            </span>
            <span className="brand-name">远控Pro</span>
          </a>
          <p className="footer-tagline">让每一台设备，都清晰可控</p>
          <p>集中管理远程连接、投屏操作与设备任务，让团队协作更高效。</p>
        </div>

        <div className="footer-col">
          <h4>产品</h4>
          <a className="footer-link" href="/#download">
            下载
          </a>
          <a className="footer-link" href="/#features">
            核心功能
          </a>
          <a className="footer-link" href="/#faq">
            常见问题
          </a>
        </div>

        <div className="footer-col">
          <h4>资源</h4>
          <a className="footer-link" href="/guide">
            脚本教程
          </a>
          <a className="footer-link" href="https://docs.remotepro.cn/" target="_blank" rel="noopener noreferrer">
            API 文档
          </a>
        </div>

        <div className="footer-col">
          <h4>法律</h4>
          <button type="button" className="footer-link" onClick={() => onOpenLegal('about')}>
            关于我们
          </button>
          <button type="button" className="footer-link" onClick={() => onOpenLegal('terms')}>
            使用协议
          </button>
          <button type="button" className="footer-link" onClick={() => onOpenLegal('privacy')}>
            隐私政策
          </button>
        </div>
      </div>
      <p className="copyright">Copyright © 2026 远控Pro All rights reserved.</p>
    </footer>
  );
}
