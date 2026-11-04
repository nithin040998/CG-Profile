import gesture from './gesture.keyframes.module.css';

/* The gesture catalogue (robot-lib.js ANIMATIONS, kind:'event'). `ms` is how
   long the class stays on before it is removed so it can replay. */
export const GESTURES = {
  wobble: { cls: gesture.wobble, ms: 900, desc: 'damped tilt, on click' },
  nod:    { cls: gesture.nod,    ms: 700, desc: 'agreement' },
  shake:  { cls: gesture.shake,  ms: 500, desc: 'no / error' },
  jolt:   { cls: gesture.jolt,   ms: 620, desc: 'surprise pop' },
  pop:    { cls: gesture.pop,    ms: 500, desc: 'mount / reveal' },
} as const;

export type GestureName = keyof typeof GESTURES;

/** Restart a one-shot CSS animation on `el`: remove, force a reflow, re-add,
    then clean up. Returns the cleanup timer id. */
export function playGesture(el: Element, name: GestureName): number {
  const { cls, ms } = GESTURES[name];
  el.classList.remove(cls);
  void el.getBoundingClientRect();
  el.classList.add(cls);
  return window.setTimeout(() => el.classList.remove(cls), ms + 40);
}
