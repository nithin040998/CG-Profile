'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ═══ REVEAL · trigger ═══
   ONE IntersectionObserver for the whole page (not one per component). It
   marks [data-reveal] elements with data-revealed the first time they enter,
   then stops watching them — reveals fire once. Re-scans on route change. */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute('data-revealed', '');
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    document
      .querySelectorAll('[data-reveal]:not([data-revealed])')
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
