import { useEffect, useState } from 'react';
import type { PageModule } from '../nav/modules';

export function ModuleNav({ modules }: { modules: PageModule[] }) {
  const [active, setActive] = useState(modules[0]?.id ?? '');

  useEffect(() => {
    const ids = modules.map((item) => item.id);

    const sync = () => {
      const offset = 120;
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive(current);
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, [modules]);

  return (
    <nav className="module-nav" aria-label="本页模块">
      <p className="module-nav-label">导航</p>
      {modules.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={active === item.id ? 'active' : undefined}
          onClick={() => setActive(item.id)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
