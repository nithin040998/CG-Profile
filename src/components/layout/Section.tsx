import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import layout from '@/styles/layout.module.css';

/** A page section with the standard rhythm. `dark` re-points the surface roles. */
export function Section({
  id,
  dark = false,
  className,
  children,
}: {
  id: string;
  dark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cx(layout.section, dark && layout.dark, className)}>
      <div className={layout.container}>{children}</div>
    </section>
  );
}
