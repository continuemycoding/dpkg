import { brand } from '../brand';
import { BrandMark } from './BrandMark';

export type LegalType = 'about' | 'terms' | 'privacy';

interface SiteFooterProps {
  onOpenLegal: (type: LegalType) => void;
}

export function SiteFooter({ onOpenLegal }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className={`container footer-grid${brand.showScripts ? '' : ' is-compact'}`}>
        <div className="footer-brand-col">
          <a className="brand" href="/">
            <BrandMark />
            <span className="brand-name">{brand.name}</span>
          </a>
          <p className="footer-tagline">让每一台设备，都清晰可控</p>
          <p>集中管理远程连接、投屏操作与设备任务，让团队协作更高效。</p>
        </div>

        <nav className="footer-col" aria-label="产品">
          <h4>产品</h4>
          <a className="footer-link" href="/#download">
            下载
          </a>
          <a className="footer-link" href="/#features">
            产品功能
          </a>
          <a className="footer-link" href="/#faq">
            常见问题
          </a>
        </nav>

        {brand.showScripts ? (
          <nav className="footer-col" aria-label="资源">
            <h4>资源</h4>
            <a className="footer-link" href="/guide">
              脚本教程
            </a>
            {brand.docsUrl ? (
              <a className="footer-link" href={brand.docsUrl} target="_blank" rel="noopener noreferrer">
                API 文档
              </a>
            ) : null}
          </nav>
        ) : null}

        <nav className="footer-col" aria-label="关于">
          <h4>关于</h4>
          <button type="button" className="footer-link" onClick={() => onOpenLegal('about')}>
            关于我们
          </button>
          <button type="button" className="footer-link" onClick={() => onOpenLegal('terms')}>
            使用协议
          </button>
          <button type="button" className="footer-link" onClick={() => onOpenLegal('privacy')}>
            隐私政策
          </button>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>Copyright © 2026 {brand.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
