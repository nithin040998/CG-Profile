'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { cx } from '@/lib/cx';
import type { Surface } from '@/motion/guide/dock.frame';
import type { ExpressionName } from '@/components/robot/expressions';
import { useCompanionRegistry } from './registry';
import s from './Dock.module.css';

export interface DockProps {
  /** what the companion wears while docked here */
  expr: ExpressionName;
  surface?: Surface;
  /** size + position come from the section: the dock's box IS the slot */
  className?: string;
  style?: CSSProperties;
}

/** An invisible anchor. Layout holds the space; the companion lands in it. */
export function Dock({ expr, surface, className, style }: DockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const registry = useCompanionRegistry();

  useEffect(() => {
    const el = ref.current;
    if (!registry || !el) return;
    return registry.addDock({ el, expr, surface });
  }, [registry, expr, surface]);

  return <div ref={ref} className={cx(s.dock, className)} style={style} aria-hidden="true" data-dock={expr} />;
}
