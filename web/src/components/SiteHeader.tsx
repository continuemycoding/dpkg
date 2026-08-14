import { useState } from 'react';
import { Button, Drawer } from 'antd';
import { DesktopOutlined, MenuOutlined } from '@ant-design/icons';

const links = [
  { href: '#', label: '首页' },
  { href: '#features', label: '核心功能' },
  { href: '#faq', label: '常见问题' },
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
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          className="menu-btn"
          type="text"
          aria-label="打开菜单"
          icon={<MenuOutlined />}
          onClick={() => setOpen(true)}
        />
      </div>

      <Drawer title="远控Pro" placement="right" open={open} onClose={() => setOpen(false)} width={280}>
        <nav className="drawer-links">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
