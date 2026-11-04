import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import respond from '@/motion/respond/hover.transition.module.css';
import s from './Chip.module.css';

/** Mono tag. Hover warms the hairline and lifts the text to ink. */
export function Chip({
  as: Tag = 'span',
  className,
  children,
}: {
  as?: 'span' | 'p';
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cx(s.chip, respond.hairline, respond.ink, className)}>{children}</Tag>;
}

export function ChipList({ items }: { items: readonly string[] }) {
  return (
    <div className={s.list}>
      {items.map((c) => <Chip key={c}>{c}</Chip>)}
    </div>
  );
}
