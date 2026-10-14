import { useEffect, useMemo, useRef } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import type { PageModule } from '../nav/modules';

export function ModuleNav({ modules }: { modules: PageModule[] }) {
  const ids = useMemo(() => modules.map((item) => item.id), [modules]);
  const active = useScrollSpy(ids) || ids[0];
  const navRef = useRef<HTMLElement>(null);

  // 移动端横向目录：让高亮项保持在可视区域
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <nav className="module-nav" aria-label="本页目录" ref={navRef}>
      <p className="module-nav-label">本页目录</p>
      {modules.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={active === item.id ? 'active' : undefined}
          aria-current={active === item.id ? 'location' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
