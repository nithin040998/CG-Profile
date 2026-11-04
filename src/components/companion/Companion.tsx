'use client';

import { useEffect, useRef } from 'react';
import { cx } from '@/lib/cx';
import glide from '@/motion/guide/glide.transition.module.css';
import { Robot, type RobotHandle } from '@/components/robot/Robot';
import type { IdleName } from '@/motion/express/idle';
import { createCompanionController } from './controller';
import { useCompanionRegistry } from './registry';
import s from './Companion.module.css';

const IDLE: readonly IdleName[] = ['breathe', 'blink', 'sway'];

/** THE companion — mount once, in the root layout, so it never unmounts. */
export function Companion() {
  const elRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<RobotHandle>(null);
  const registry = useCompanionRegistry();

  useEffect(() => {
    const el = elRef.current;
    if (!registry || !el) return;
    const ctl = createCompanionController(el, () => robotRef.current, registry);
    registry.attach(ctl);
    return () => {
      registry.attach(null);
      ctl.destroy();
    };
  }, [registry]);

  return (
    <div ref={elRef} id="companion" className={cx(s.companion, glide.glide)} aria-hidden="true">
      {/* No local follow: gaze is driven page-wide by the controller, so the
          eyes track the cursor anywhere, not only over the robot's box. */}
      <Robot ref={robotRef} size={240} expression="neutral" idle={IDLE} fluid />
    </div>
  );
}
