import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './Eyebrow.module.css';

/** Section label with the orange dot hanging outside the column. */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cx(s.eyebrow, className)}>{children}</p>;
}

export function Rule({ className }: { className?: string }) {
  return <hr className={cx(s.rule, className)} />;
}
