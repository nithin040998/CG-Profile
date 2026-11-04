import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import respond from '@/motion/respond/hover.transition.module.css';
import s from './Button.module.css';

export interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 1 orange · 2 ink · 3 outline */
  variant: 1 | 2 | 3;
  href: string;
}

/* Buttons respond with colour only — fill for 1/2, hairline for 3. */
export function Button({ variant, className, ...rest }: ButtonProps) {
  return (
    <a
      className={cx(s.btn, s[`v${variant}`], variant === 3 ? respond.hairline : respond.fill, className)}
      {...rest}
    />
  );
}

/** The CTA row: wraps, and stacks full-width on a phone. */
export function ButtonRow({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx(s.row, className)}>{children}</div>;
}
