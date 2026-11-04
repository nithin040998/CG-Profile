'use client';

import { createContext, use, useState, type ReactNode } from 'react';
import type { DockEntry } from '@/motion/guide/dock.frame';
import type { ExpressionName } from '@/components/robot/expressions';

/* The companion's registry. Sections declare where it can be — docks and the
   experience timeline — by mounting <Dock>/<SpineTimeline>; the controller
   reads the registry live every frame. Nothing here re-renders: it is a plain
   mutable store behind a stable context value. */

export interface TimelineEntry {
  wrap: HTMLElement;
  rows: HTMLElement[];
  trail: HTMLElement | null;
}

export type CompanionDock = DockEntry<ExpressionName>;

export interface CompanionRegistry {
  addDock(dock: CompanionDock): () => void;
  setTimeline(t: TimelineEntry): () => void;
  docks(): Iterable<CompanionDock>;
  timeline(): TimelineEntry | null;
  /** the live controller, told when the registry changes */
  attach(ctl: { refresh(): void } | null): void;
}

function createRegistry(): CompanionRegistry {
  const docks = new Set<CompanionDock>();
  let timeline: TimelineEntry | null = null;
  let ctl: { refresh(): void } | null = null;
  const changed = () => ctl?.refresh();

  return {
    addDock(dock) {
      docks.add(dock);
      changed();
      return () => {
        docks.delete(dock);
        changed();
      };
    },
    setTimeline(t) {
      timeline = t;
      changed();
      return () => {
        if (timeline !== t) return;
        timeline = null;
        changed();
      };
    },
    docks: () => docks,
    timeline: () => timeline,
    attach(c) {
      ctl = c;
    },
  };
}

const RegistryContext = createContext<CompanionRegistry | null>(null);

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [registry] = useState(createRegistry);
  return <RegistryContext value={registry}>{children}</RegistryContext>;
}

/** null outside a provider — docks then simply do nothing */
export const useCompanionRegistry = (): CompanionRegistry | null => use(RegistryContext);
