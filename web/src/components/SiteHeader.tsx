import { useState } from 'react';
import { Button, Drawer } from 'antd';
import { DesktopOutlined, DownloadOutlined, MenuOutlined } from '@ant-design/icons';

const links = [
  { href: '#', label: '首页' },
  { href: '#features', label: '核心功能' },
  { href: '#faq', label: '常见问题' },
  { href: 'https://docs.remotepro.cn/', label: 'API文档', external: true },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="#">
          <span className="brand-mark">
            <DesktopOutlined />
          </span>
          <span className="brand-name">远控Pro</span>
        </a>

        <nav className="nav-links">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <Button className="header-cta" type="primary" href="#download" icon={<DownloadOutlined />}>
            立即下载
          </Button>
          <Button
            className="menu-btn"
            type="text"
            aria-label="打开菜单"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      <Drawer title="远控Pro" placement="right" open={open} onClose={() => setOpen(false)} width={280}>
        <nav className="drawer-links">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
          <a className="drawer-cta" href="#download" onClick={() => setOpen(false)}>
            立即下载
          </a>
        </nav>
      </Drawer>
    </header>
  );
}
