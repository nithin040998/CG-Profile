import { cx } from '@/lib/cx';
import t from '@/styles/type.module.css';
import { reveal, staggerIndex } from '@/motion/reveal';
import { Section } from '@/components/layout/Section';
import { Eyebrow, Rule } from '@/components/ui/Eyebrow';
import { Tile } from '@/components/ui/Tile';
import { Dock } from '@/components/companion/Dock';
import { companionHover } from '@/components/companion/reactions';
import { impact } from '@/content/impact';
import s from './Impact.module.css';

/* ════════ 4 · IMPACT — the one dark section ════════ */
export function Impact() {
  return (
    <Section id="impact" dark>
      <div {...reveal('up', s.head)}>
        <div>
          <Eyebrow>impact</Eyebrow>
          <h1>{impact.heading}</h1>
        </div>
        {/* dock 4: surprised → thinking. surface=dark flips the bolt to cream,
            which the prototype missed (its bolt was ink on ink here). */}
        <Dock expr="surprised" surface="dark" className={s.dock} />
      </div>

      <div {...reveal('stagger', s.stats)}>
        {impact.stats.map((x, i) => (
          <Tile key={x.label} style={staggerIndex(i)} {...companionHover('curious')}>
            <p className={t.fig}>{x.fig}</p>
            <p className={cx(t.micro, s.statLabel)}>{x.label}</p>
          </Tile>
        ))}
      </div>

      <div {...reveal('up', s.skills)}>
        <Rule />
        <div className={s.skillGrid}>
          {impact.skills.map((g) => (
            <div key={g.title}>
              <h3>{g.title}</h3>
              <p>{g.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
