import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import respond from '@/motion/respond/hover.transition.module.css';
import s from './Tile.module.css';

/** Card surface. H: hairline response on hover, NO transform. */
export function Tile({
  className,
  style,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={cx(s.tile, respond.hairline, className)} style={style} {...rest}>
      {children}
    </div>
  );
}
