import { Button } from 'antd';

export type LegalType = 'about' | 'terms' | 'privacy';

interface SiteFooterProps {
  onOpenLegal: (type: LegalType) => void;
}

export function SiteFooter({ onOpenLegal }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-links">
          <Button type="text" onClick={() => onOpenLegal('about')}>
            关于我们
          </Button>
          <Button type="text" onClick={() => onOpenLegal('terms')}>
            使用协议
          </Button>
          <Button type="text" onClick={() => onOpenLegal('privacy')}>
            隐私政策
          </Button>
        </div>
        <p className="copyright">Copyright © 2026 远控Pro All rights reserved.</p>
      </div>
    </footer>
  );
}
