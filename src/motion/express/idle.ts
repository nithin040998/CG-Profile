import idle from './idle.keyframes.module.css';

/** Which part of the robot an idle loop runs on. */
export type IdlePart = 'body' | 'lids' | 'antennas';

/* The idle catalogue (robot-lib.js ANIMATIONS, kind:'idle'). */
export const IDLE = {
  breathe:     { cls: idle.breathe,     part: 'body',     desc: 'slow inhale/exhale, 5.6s' },
  breatheDeep: { cls: idle.breatheDeep, part: 'body',     desc: 'deeper breath for hero, 5.2s' },
  float:       { cls: idle.float,       part: 'body',     desc: 'vertical drift, 4.4s' },
  blink:       { cls: idle.blink,       part: 'lids',     desc: 'lid down from top, 5.2s' },
  blinkSlow:   { cls: idle.blinkSlow,   part: 'lids',     desc: 'sleepy blink, 7.4s' },
  blinkDouble: { cls: idle.blinkDouble, part: 'lids',     desc: 'two quick blinks, 6s' },
  sway:        { cls: idle.sway,        part: 'antennas', desc: 'antenna sway, 6.8s' },
} as const satisfies Record<string, { cls: string; part: IdlePart; desc: string }>;

export type IdleName = keyof typeof IDLE;

/** Classes for the idle loops in `names` that run on `part`. */
export const idleClasses = (names: readonly IdleName[], part: IdlePart): string =>
  names.filter((n) => IDLE[n].part === part).map((n) => IDLE[n].cls).join(' ');

/** The thinking bolt's strike loop. */
export const strikeClass = idle.strike;
