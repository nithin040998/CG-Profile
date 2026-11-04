import { cx } from '@/lib/cx';
import layout from '@/styles/layout.module.css';
import t from '@/styles/type.module.css';
import cue from '@/motion/guide/cue.keyframes.module.css';
import { loadIn } from '@/motion/reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button, ButtonRow } from '@/components/ui/Button';
import { Dock } from '@/components/companion/Dock';
import { companionClick } from '@/components/companion/reactions';
import { profile } from '@/content/profile';
import s from './Hero.module.css';

/* ════════ 1 · HERO ════════
   The composition (I): the giant name, with the companion standing in the
   pocket to the right of "Gowda". Load beats: 1 name · 3 lead · 4 meta ·
   5 CTA (2 is the robot's fade-in, 6 its glance — both in the companion). */
export function Hero() {
  return (
    <section className={s.hero} id="top">
      <div className={layout.container}>
        <div className={cx(layout.grid, s.grid)}>
          <div className={s.name}>
            <Eyebrow className={loadIn(1)}>{profile.role}</Eyebrow>
            <h1 className={loadIn(1, cx(t.display, s.display))}>
              {profile.firstName}
              <br />
              {profile.lastName}
            </h1>
            {/* dock 1: the single companion lands here */}
            <Dock expr="neutral" className={s.bot} />
          </div>

          <div className={s.copy}>
            <p className={loadIn(3, cx(t.lead, s.lead))}>
              {profile.lead.before}
              <span className={t.mark}>{profile.lead.mark}</span>
              {profile.lead.after}
            </p>
            <ButtonRow className={loadIn(5)}>
              <Button variant={1} href="#experience">view experience</Button>
              <Button variant={2} href={profile.resumeHref} {...companionClick('cheer')}>
                download résumé
              </Button>
            </ButtonRow>
            <p className={loadIn(4, cx(t.label, s.meta))}>
              {profile.meta.map((m) => <span key={m}>{m}</span>)}
            </p>
          </div>
        </div>
      </div>
      <p className={cx(t.micro, s.cue, cue.cue)}>scroll ↓</p>
    </section>
  );
}
