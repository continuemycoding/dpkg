import { BookOutlined, DownloadOutlined } from '@ant-design/icons';
import { brand } from '../brand';

export function CtaBand() {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-band">
          <div>
            <h2>现在就把手机连起来</h2>
            <p>下载控制端，几分钟内完成第一次批量投屏。</p>
          </div>
          <div className="cta-band-actions">
            <a className="btn btn-primary btn-lg" href="#download">
              <DownloadOutlined />
              免费下载
            </a>
            {brand.showScripts ? (
              <a className="btn btn-ghost btn-lg" href="/guide">
                <BookOutlined />
                脚本教程
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
