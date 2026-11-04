import { cx } from '@/lib/cx';
import layout from '@/styles/layout.module.css';
import t from '@/styles/type.module.css';
import { reveal, staggerIndex } from '@/motion/reveal';
import { Section } from '@/components/layout/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Tile } from '@/components/ui/Tile';
import { Dock } from '@/components/companion/Dock';
import { companionHover } from '@/components/companion/reactions';
import { about } from '@/content/about';
import s from './About.module.css';

/* ════════ 2 · ABOUT ════════ */
export function About() {
  return (
    <Section id="about">
      <div className={layout.grid}>
        <div {...reveal('up', s.rail)}>
          <div>
            <Eyebrow>about</Eyebrow>
            <h1>
              {about.heading[0]}
              <br />
              {about.heading[1]}
            </h1>
          </div>
          {/* dock 2: under the heading it belongs to */}
          <Dock expr="content" className={s.railBot} />
        </div>

        <div {...reveal('up', s.main)}>
          <p className={cx(t.lead, s.lead)}>{about.lead}</p>
          <p className={t.body}>{about.body}</p>

          <div {...reveal('stagger', s.thru)}>
            {about.thru.map((x, i) => (
              <Tile key={x.label} style={staggerIndex(i)} {...companionHover('curious')}>
                <p className={t.label}>{x.label}</p>
                <p className={cx(t.body, s.tileBody)}>{x.body}</p>
              </Tile>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
