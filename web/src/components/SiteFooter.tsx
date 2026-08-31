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
          <p>专业级 iOS 设备批量投屏与群控。在电脑、手机与编辑器里，把每台已越狱的 iPhone 握在手里。</p>
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
