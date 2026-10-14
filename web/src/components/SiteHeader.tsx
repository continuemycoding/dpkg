import { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { ArrowRightOutlined, CloseOutlined, DownloadOutlined, ExportOutlined, MenuOutlined } from '@ant-design/icons';
import { brand } from '../brand';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { HEADER_LINKS, HOME_SECTIONS, type PageLink, type PageModule, type SitePage } from '../nav/modules';
import { BrandMark } from './BrandMark';

interface SiteHeaderProps {
  page: SitePage;
  /** 页面内目录，移动端抽屉里展示 */
  modules?: PageModule[];
}

function linkProps(link: PageLink) {
  return link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

export function SiteHeader({ page, modules = [] }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy(page === 'home' ? HOME_SECTIONS : []);

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 8);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, []);

  const isActive = (link: PageLink) =>
    (link.page && link.page === page) || (page === 'home' && link.section && link.section === activeSection);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header-inner">
        <a className="brand" href="/" aria-label={`${brand.name} 首页`}>
          <BrandMark />
          <span className="brand-name">{brand.name}</span>
        </a>

        <nav className="nav-links" aria-label="主导航">
          {HEADER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={isActive(link) ? 'active' : undefined}
              aria-current={isActive(link) ? 'page' : undefined}
              {...linkProps(link)}
            >
              {link.label}
              {link.external ? <ExportOutlined className="nav-ext" /> : null}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="btn btn-primary btn-sm header-cta" href="/#download">
            <DownloadOutlined />
            下载
          </a>
          <button type="button" className="icon-btn menu-btn" aria-label="打开菜单" onClick={() => setOpen(true)}>
            <MenuOutlined />
          </button>
        </div>
      </div>

      <Drawer
        className="site-drawer"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        width={300}
        closable={false}
        title={null}
      >
        <div className="drawer-head">
          <a className="brand" href="/">
            <BrandMark />
            <span className="brand-name">{brand.name}</span>
          </a>
          <button type="button" className="icon-btn" aria-label="关闭菜单" onClick={() => setOpen(false)}>
            <CloseOutlined />
          </button>
        </div>
        <nav className="drawer-links">
          {HEADER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={isActive(link) ? 'active' : undefined}
              onClick={() => setOpen(false)}
              {...linkProps(link)}
            >
              <span>{link.label}</span>
              {link.external ? <ExportOutlined /> : <ArrowRightOutlined />}
            </a>
          ))}
          {modules.length > 0 ? (
            <>
              <p className="drawer-group">本页目录</p>
              {modules.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="is-sub" onClick={() => setOpen(false)}>
                  <span>{item.label}</span>
                </a>
              ))}
            </>
          ) : null}
        </nav>
        <a className="btn btn-primary btn-block drawer-cta" href="/#download" onClick={() => setOpen(false)}>
          <DownloadOutlined />
          前往下载
        </a>
      </Drawer>
    </header>
  );
}
