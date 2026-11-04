import { cx } from '@/lib/cx';
import layout from '@/styles/layout.module.css';
import t from '@/styles/type.module.css';
import respond from '@/motion/respond/hover.transition.module.css';
import { reveal } from '@/motion/reveal';
import { Section } from '@/components/layout/Section';
import { Eyebrow, Rule } from '@/components/ui/Eyebrow';
import { Button, ButtonRow } from '@/components/ui/Button';
import { Dock } from '@/components/companion/Dock';
import { companionClick } from '@/components/companion/reactions';
import { contact, profile } from '@/content/profile';
import s from './Contact.module.css';

/* ════════ 5 · CONTACT ════════ */
export function Contact() {
  return (
    <Section id="contact">
      <Eyebrow>contact</Eyebrow>
      <div className={layout.grid}>
        <div {...reveal('up', s.pitch)}>
          <h1>{contact.pitch}</h1>
          <p className={t.body}>{contact.body}</p>
          <ButtonRow className={s.cta}>
            <Button variant={1} href={`mailto:${profile.email}`}>email me</Button>
            <Button variant={2} href={profile.resumeHref} {...companionClick('cheer')}>
              download résumé
            </Button>
          </ButtonRow>
        </div>

        <div {...reveal('up', s.channels)}>
          <div className={s.chan}>
            {contact.channels.map((c) => (
              <a key={c.k} href={c.href} className={cx(respond.wash, respond.inkHost)}>
                <span className={cx(s.k, respond.ink)}>{c.k}</span>
                <span>{c.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div {...reveal('up', s.signoff)}>
        <Rule className={s.signoffRule} />
        {/* dock 5: the sign-off */}
        <Dock expr="content" className={s.footDock} />
        <p className={cx(t.micro, s.signoffText)}>{contact.signoff}</p>
      </div>
    </Section>
  );
}
