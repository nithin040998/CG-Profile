'use client';

import { cx } from '@/lib/cx';
import layout from '@/styles/layout.module.css';
import respond from '@/motion/respond/hover.transition.module.css';
import stick from '@/motion/respond/stick.transition.module.css';
import { Button } from '@/components/ui/Button';
import { companionClick } from '@/components/companion/reactions';
import { nav, profile } from '@/content/profile';
import { Wordmark } from './Wordmark';
import { useActiveSection, useScrolledPast } from './useScrollSpy';
import s from './Nav.module.css';

const HREFS = nav.map((l) => l.href);

export function Nav() {
  // opaque only past the hero
  const stuck = useScrolledPast('top', 64);
  const active = useActiveSection(HREFS);

  return (
    <header className={cx(s.nav, stick.stick)} data-stuck={stuck ? '' : undefined}>
      <div className={cx(layout.container, s.inner)}>
        <Wordmark />
        <nav aria-label="Sections">
          <ul className={s.links}>
            {nav.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cx(s.link, respond.ink, respond.underline, i === active && s.active)}
                  aria-current={i === active ? 'location' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.right}>
          {/* TODO: carried over from the prototype — no menu panel exists yet */}
          <button className={s.menu} aria-label="Open menu">menu</button>
          <Button variant={3} href={profile.resumeHref} {...companionClick('cheer')}>résumé</Button>
        </div>
      </div>
    </header>
  );
}
