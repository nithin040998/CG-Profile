/* Where an element will sit once its entrance has finished.

   Reveals rise 14px and experience rows are dealt from 18px below, both as
   transforms on an ancestor. Anything that measures a box in order to LAND on
   it — the docks, the spine dots — must measure the resting box: measured
   mid-entrance, the companion lands 14–18px low and stays there, because
   nothing repaints when an entrance ends. (The prototype had both drifts.) */
const ENTERING = '[data-reveal], [data-xp-row]';

export function restingRect(el: Element): DOMRect {
  const r = el.getBoundingClientRect();
  const host = el.closest(ENTERING);
  if (!host) return r;
  const t = getComputedStyle(host).transform;
  if (t === 'none') return r;
  const m = new DOMMatrixReadOnly(t);
  return new DOMRect(r.x - m.m41, r.y - m.m42, r.width, r.height);
}
