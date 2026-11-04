/* ---------------------------------------------------------
   EXPRESSIONS — eyes + mouth. Head and antennas never change.
   Ported verbatim from design/assets/robot-lib.js.
   --------------------------------------------------------- */

export const VIEWBOX = '0 -11 44 56'; // room above the head for the bolt
/** the svg's own height:width */
export const ASPECT = 56 / 44;

export const BOLT_PATH = 'M23.6 -9.4 L17.8 -2.4 L21.2 -2.4 L19.4 3.0 L26.0 -4.6 L22.4 -4.6 Z';

export const MOUTHS = {
  content:  'M18.0 34.9 q4.0 0.9 8.0 0',
  warm:     'M17.6 34.7 q4.4 2.2 8.8 0',
  tight:    'M18.2 34.9 q3.8 0.8 7.6 0',
  small:    'M18.6 34.9 q3.4 0.7 6.8 0',
  lopsided: 'M18.6 34.8 q3.4 1.7 6.8 .3',
  flat:     'M18.2 35.0 q3.8 0.2 7.6 0',
  open:     'M19.4 34.4 q2.6 0.4 5.2 0', // paired with the "o" ellipse
  down:     'M17.9 35.8 q4.2 -2.4 8.4 0',
} as const;

export type EyeKind =
  | 'round' | 'wide' | 'bars' | 'closed' | 'asym'
  | 'wink' | 'ring' | 'shifted' | 'droop';

export interface Expression {
  label: string;
  use: string;
  eyes: EyeKind;
  mouth: string;
  /** render the mouth as an "o" ellipse instead of a curve */
  mouthO?: boolean;
  /** resting head tilt, degrees */
  tilt?: number;
  /** show the thinking bolt */
  bolt?: boolean;
}

export const EXPRESSIONS = {
  neutral:   { label: 'neutral',   use: 'default / idle',            eyes: 'round',   mouth: MOUTHS.content },
  happy:     { label: 'happy',     use: 'success / sign-off',        eyes: 'round',   mouth: MOUTHS.warm },
  content:   { label: 'content',   use: 'resting warmly',            eyes: 'closed',  mouth: MOUTHS.warm },
  focused:   { label: 'focused',   use: 'reading / scroll-active',   eyes: 'bars',    mouth: MOUTHS.tight },
  curious:   { label: 'curious',   use: 'hover / hint open',         eyes: 'asym',    mouth: MOUTHS.lopsided, tilt: -6 },
  thinking:  { label: 'thinking',  use: 'processing',                eyes: 'bars',    mouth: MOUTHS.small, bolt: true },
  surprised: { label: 'surprised', use: 'new / unexpected / reveal', eyes: 'wide',    mouth: MOUTHS.open, mouthO: true },
  looking:   { label: 'looking',   use: 'points at content',         eyes: 'shifted', mouth: MOUTHS.content },
  wink:      { label: 'wink',      use: 'easter egg / playful',      eyes: 'wink',    mouth: MOUTHS.warm },
  alert:     { label: 'alert',     use: 'attention / notice',        eyes: 'ring',    mouth: MOUTHS.tight },
  resting:   { label: 'resting',   use: 'idle-long / asleep',        eyes: 'closed',  mouth: MOUTHS.content },
  sad:       { label: 'sad',       use: '404 / empty state',         eyes: 'droop',   mouth: MOUTHS.down },
} as const satisfies Record<string, Expression>;

export type ExpressionName = keyof typeof EXPRESSIONS;

export const isExpression = (v: unknown): v is ExpressionName =>
  typeof v === 'string' && v in EXPRESSIONS;

/** mouth stroke thickens proportionally so the curve survives small sizes */
export function sizeClass(px: number): 's56' | 's40' | 's30' | 's22' | 's17' {
  if (px >= 48) return 's56';
  if (px >= 36) return 's40';
  if (px >= 26) return 's30';
  if (px >= 20) return 's22';
  return 's17';
}
