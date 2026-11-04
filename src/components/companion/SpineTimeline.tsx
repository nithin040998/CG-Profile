'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { cascadeClass } from '@/motion/reveal';
import trail from '@/motion/guide/trail.frame.module.css';
import { useCompanionRegistry } from './registry';

/** The experience timeline the companion rides. Rows are its children and
    must carry data-xp-row (+ data-expr / data-note), with the spine dot's
    element marked data-spine-anchor. */
export function SpineTimeline({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const registry = useCompanionRegistry();

  useEffect(() => {
    const wrap = ref.current;
    if (!registry || !wrap) return;
    const rows = [...wrap.querySelectorAll<HTMLElement>('[data-xp-row]')];
    return registry.setTimeline({ wrap, rows, trail: trailRef.current });
  }, [registry]);

  return (
    <div ref={ref} className={cx(className, cascadeClass.track)}>
      {/* the descent trail: the controller sizes it and grows it down the spine */}
      <div ref={trailRef} className={trail.trail} aria-hidden="true" />
      {children}
      {/* spine end marker: where the companion stops riding */}
      <div style={{ height: 1 }} aria-hidden="true" />
    </div>
  );
}
