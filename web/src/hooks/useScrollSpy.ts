import { useEffect, useState } from 'react';

/** 返回当前滚动位置所在的模块 id；还没滚到第一个模块时返回空字符串 */
export function useScrollSpy(ids: string[], offset = 140): string {
  const [active, setActive] = useState('');
  const key = ids.join('|');

  useEffect(() => {
    if (ids.length === 0) return;
    let frame = 0;

    const sync = () => {
      frame = 0;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = ids[ids.length - 1];
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [key, offset]);

  return active;
}
