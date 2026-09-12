import { useState } from 'react';
import { Button, Drawer } from 'antd';
import { DesktopOutlined, MenuOutlined } from '@ant-design/icons';
import { brand } from '../brand';
import { PAGE_LINKS, type PageModule, type SitePage } from '../nav/modules';

export function SiteHeader({ page, modules }: { page: SitePage; modules: PageModule[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <a className="brand" href="/">
          <span className="brand-mark">
            <DesktopOutlined />
          </span>
          <span className="brand-name">{brand.name}</span>
        </a>

        {PAGE_LINKS.length > 0 ? (
          <nav className="nav-links">
            {PAGE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={link.page && link.page === page ? 'active' : undefined}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="header-actions">
          <Button
            className="menu-btn"
            type="text"
            aria-label="打开菜单"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      <Drawer title={brand.name} placement="right" open={open} onClose={() => setOpen(false)} width={280}>
        <nav className="drawer-links">
          {PAGE_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={link.page && link.page === page ? 'active' : undefined}
              onClick={() => setOpen(false)}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
          <p className="drawer-group">本页模块</p>
          {modules.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
