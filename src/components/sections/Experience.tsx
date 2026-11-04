import { cx } from '@/lib/cx';
import layout from '@/styles/layout.module.css';
import t from '@/styles/type.module.css';
import { cascadeClass } from '@/motion/reveal';
import { Section } from '@/components/layout/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Chip, ChipList } from '@/components/ui/Chip';
import { SpineTimeline } from '@/components/companion/SpineTimeline';
import { experience } from '@/content/experience';
import s from './Experience.module.css';

/* ════════ 3 · EXPERIENCE ════════
   The companion rides the spine here. Each row is dealt (motion/reveal
   cascade) when the companion arrives at its dot (motion/guide descent). */
export function Experience() {
  return (
    <Section id="experience">
      <Eyebrow>experience</Eyebrow>
      <h1>{experience.heading}</h1>

      <SpineTimeline className={s.xp}>
        {experience.roles.map((role) => (
          <article
            key={role.period}
            className={cx(layout.grid, s.row, cascadeClass.row)}
            data-xp-row=""
            data-expr={role.expr}
            data-note={role.note}
          >
            <div className={s.meta}>
              <p className={t.label}>{role.period}</p>
              {role.own && <Chip as="p" className={s.own}>{role.own}</Chip>}
            </div>
            <div className={cx(s.main, cascadeClass.dot)} data-spine-anchor="">
              {role.minor ? <h3>{role.title}</h3> : <h2>{role.title}</h2>}
              <p className={cx(s.co, role.minor && s.coMinor)}>{role.company}</p>
              {role.bullets && (
                <ul>
                  {role.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
              {role.chips && <ChipList items={role.chips} />}
            </div>
          </article>
        ))}
      </SpineTimeline>
    </Section>
  );
}
