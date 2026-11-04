'use client';

import { useEffect, useState } from 'react';

/** true once the element `id` has scrolled up behind a bar `offset` px tall */
export function useScrolledPast(id: string, offset: number): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting), {
      rootMargin: `-${offset}px 0px 0px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [id, offset]);
  return past;
}

/** index of the section (by `#id` href) crossing the viewport midline, or -1 */
export function useActiveSection(hrefs: readonly string[]): number {
  const [active, setActive] = useState(-1);
  const key = hrefs.join('|');
  useEffect(() => {
    const secs = key.split('|').map((h) => document.querySelector(h));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(secs.indexOf(e.target));
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    secs.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, [key]);
  return active;
}
