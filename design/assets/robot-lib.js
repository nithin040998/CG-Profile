/* ============================================================
   CG ROBOT — library
   Vanilla, zero dependencies. Pairs with robot-lib.css.

   Quick start:
     <div data-cg-robot data-size="40" data-expression="neutral"
          data-idle="breathe blink" data-hover="happy tilt"></div>
     <script src="robot-lib.js"></script>   // auto-mounts on DOMContentLoaded

   Or programmatically:
     const bot = CGRobot.create({ size:56, expression:'neutral',
                                  idle:['breathe','blink'], follow:true });
     document.body.append(bot.el);
     bot.setExpression('surprised');
     bot.jolt();

   The React port is a direct translation: EXPRESSIONS -> render props,
   the controller methods -> useEffect/handlers.
   ============================================================ */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const VIEWBOX = '0 -11 44 56';   // room above the head for the bolt

  /* ---------------------------------------------------------
     EXPRESSIONS — eyes + mouth. Head and antennas never change.
     Each entry: { eyes(), mouth, tilt?, bolt?, label, use }
     --------------------------------------------------------- */
  const MOUTHS = {
    content:   'M18.0 34.9 q4.0 0.9 8.0 0',
    warm:      'M17.6 34.7 q4.4 2.2 8.8 0',
    tight:     'M18.2 34.9 q3.8 0.8 7.6 0',
    small:     'M18.6 34.9 q3.4 0.7 6.8 0',
    lopsided:  'M18.6 34.8 q3.4 1.7 6.8 .3',
    flat:      'M18.2 35.0 q3.8 0.2 7.6 0',
    open:      'M19.4 34.4 q2.6 0.4 5.2 0',   // paired with the "o" ellipse
    down:      'M17.9 35.8 q4.2 -2.4 8.4 0',
  };

  const EXPRESSIONS = {
    neutral: {
      label: 'neutral', use: 'default / idle',
      eyes: 'round', mouth: MOUTHS.content,
    },
    happy: {
      label: 'happy', use: 'success / sign-off',
      eyes: 'round', mouth: MOUTHS.warm,
    },
    content: {
      label: 'content', use: 'resting warmly',
      eyes: 'closed', mouth: MOUTHS.warm,
    },
    focused: {
      label: 'focused', use: 'reading / scroll-active',
      eyes: 'bars', mouth: MOUTHS.tight,
    },
    curious: {
      label: 'curious', use: 'hover / hint open',
      eyes: 'asym', mouth: MOUTHS.lopsided, tilt: -6,
    },
    thinking: {
      label: 'thinking', use: 'processing',
      eyes: 'bars', mouth: MOUTHS.small, bolt: true,
    },
    surprised: {
      label: 'surprised', use: 'new / unexpected / reveal',
      eyes: 'wide', mouth: MOUTHS.open, mouthO: true,
    },
    looking: {
      label: 'looking', use: 'points at content',
      eyes: 'shifted', mouth: MOUTHS.content,
    },
    wink: {
      label: 'wink', use: 'easter egg / playful',
      eyes: 'wink', mouth: MOUTHS.warm,
    },
    alert: {
      label: 'alert', use: 'attention / notice',
      eyes: 'ring', mouth: MOUTHS.tight,
    },
    resting: {
      label: 'resting', use: 'idle-long / asleep',
      eyes: 'closed', mouth: MOUTHS.content,
    },
    sad: {
      label: 'sad', use: '404 / empty state',
      eyes: 'droop', mouth: MOUTHS.down,
    },
  };

  /* ---------------------------------------------------------
     ANIMATION CATALOG — name -> css class + kind
     --------------------------------------------------------- */
  const ANIMATIONS = {
    // idle (looping)
    breathe:      { cls:'cg-breathe',      kind:'idle',   desc:'slow inhale/exhale, 5.6s' },
    breatheDeep:  { cls:'cg-breathe-deep', kind:'idle',   desc:'deeper breath for hero, 5.2s' },
    float:        { cls:'cg-float',        kind:'idle',   desc:'vertical drift, 4.4s' },
    blink:        { cls:'cg-lid',          kind:'idle',   desc:'lid down from top, 5.2s' },
    blinkSlow:    { cls:'cg-lid--slow',    kind:'idle',   desc:'sleepy blink, 7.4s' },
    blinkDouble:  { cls:'cg-lid--double',  kind:'idle',   desc:'two quick blinks, 6s' },
    sway:         { cls:'cg-antennas',     kind:'idle',   desc:'antenna sway, 6.8s' },
    // one-shot events
    wobble:       { cls:'cg-wobble',       kind:'event',  ms:900,  desc:'damped tilt, on click' },
    nod:          { cls:'cg-nod',          kind:'event',  ms:700,  desc:'agreement' },
    shake:        { cls:'cg-shake',        kind:'event',  ms:500,  desc:'no / error' },
    jolt:         { cls:'cg-jolt',         kind:'event',  ms:620,  desc:'surprise pop' },
    pop:          { cls:'cg-pop',          kind:'event',  ms:500,  desc:'mount / reveal' },
    // interaction-driven
    tilt:         { cls:'cg-hover-tilt',   kind:'hover',  desc:'−8° springy on hover' },
    follow:       { cls:null,              kind:'cursor', desc:'pupils + mouth track cursor' },
    lean:         { cls:'cg-lean',         kind:'scroll', desc:'leans into scroll direction' },
    travel:       { cls:'cg-travel',       kind:'scroll', desc:'rides the timeline spine' },
  };

  /* --------------------------------------------------------- */
  function el(name, attrs) {
    const n = document.createElementNS(NS, name);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  let defsInjected = false;
  function injectDefs() {
    if (defsInjected) return;
    defsInjected = true;
    const svg = el('svg', { width: 0, height: 0, 'aria-hidden': 'true',
      style: 'position:absolute;width:0;height:0;overflow:hidden' });
    svg.innerHTML = `
      <defs>
        <linearGradient id="cgBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="var(--cg-orange-hi,#F87A4B)"/>
          <stop offset="100%" stop-color="var(--cg-orange-lo,#E85A2C)"/>
        </linearGradient>
        <linearGradient id="cgPlate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="var(--cg-orange-dp,#C9481F)"/>
          <stop offset="100%" stop-color="#E05C2A"/>
        </linearGradient>
        <radialGradient id="cgLens" cx="34%" cy="28%" r="78%">
          <stop offset="0%"  stop-color="#5B5049"/>
          <stop offset="38%" stop-color="#2E2823"/>
          <stop offset="100%" stop-color="#100E0C"/>
        </radialGradient>
        <radialGradient id="cgSocket" cx="50%" cy="50%" r="50%">
          <stop offset="62%"  stop-color="#8E3413" stop-opacity="0"/>
          <stop offset="100%" stop-color="#7A2A0E" stop-opacity=".5"/>
        </radialGradient>
        <clipPath id="cgClipL"><circle cx="15.5" cy="23.5" r="4.2"/></clipPath>
        <clipPath id="cgClipR"><circle cx="28.5" cy="23.5" r="4.2"/></clipPath>
      </defs>`;
    document.body.insertBefore(svg, document.body.firstChild);
  }

  /* ---------------------------------------------------------
     EYE RENDERERS
     --------------------------------------------------------- */
  function eyesMarkup(kind) {
    const lens = 'fill="url(#cgLens)"';
    const sock = 'fill="url(#cgSocket)"';
    const hi   = 'fill="#FFF4EC" opacity=".92"';

    switch (kind) {
      case 'round':
        return `
          <circle cx="15.5" cy="23.5" r="4.2" fill="#120F0D"/>
          <g class="cg-pupil cg-pupil--l">
            <circle cx="15.5" cy="23.5" r="2.9" ${lens}/>
            <circle cx="14.4" cy="22.4" r="1.15" ${hi}/>
          </g>
          <circle cx="15.5" cy="23.5" r="4.2" ${sock}/>
          <circle cx="28.5" cy="23.5" r="4.2" fill="#120F0D"/>
          <g class="cg-pupil cg-pupil--r">
            <circle cx="28.5" cy="23.5" r="2.9" ${lens}/>
            <circle cx="27.4" cy="22.4" r="1.15" ${hi}/>
          </g>
          <circle cx="28.5" cy="23.5" r="4.2" ${sock}/>`;
      case 'wide':   // surprised — bigger sockets, small high pupils
        return `
          <circle cx="15.3" cy="23.3" r="5.3" fill="#120F0D"/>
          <g class="cg-pupil cg-pupil--l">
            <circle cx="15.3" cy="23.3" r="3.1" ${lens}/>
            <circle cx="13.9" cy="21.8" r="1.3" fill="#FFF4EC"/>
          </g>
          <circle cx="15.3" cy="23.3" r="5.3" ${sock}/>
          <circle cx="28.7" cy="23.3" r="5.3" fill="#120F0D"/>
          <g class="cg-pupil cg-pupil--r">
            <circle cx="28.7" cy="23.3" r="3.1" ${lens}/>
            <circle cx="27.3" cy="21.8" r="1.3" fill="#FFF4EC"/>
          </g>
          <circle cx="28.7" cy="23.3" r="5.3" ${sock}/>`;
      case 'bars':
        return `
          <rect x="11.4" y="22" width="8.4" height="3.4" rx="1.7" ${lens}/>
          <rect x="24.4" y="22" width="8.4" height="3.4" rx="1.7" ${lens}/>
          <rect x="12.2" y="22.6" width="3.4" height=".9" rx=".45" fill="#FFF4EC" opacity=".5"/>
          <rect x="25.2" y="22.6" width="3.4" height=".9" rx=".45" fill="#FFF4EC" opacity=".5"/>`;
      case 'closed':
        return `
          <path d="M11.9 23.7 h7.6" stroke="#191512" stroke-width="3.2" stroke-linecap="round"/>
          <path d="M24.9 23.7 h7.6" stroke="#191512" stroke-width="3.2" stroke-linecap="round"/>`;
      case 'asym':
        return `
          <circle cx="15.3" cy="23.3" r="5" ${lens}/>
          <circle cx="13.4" cy="21.4" r="1.45" fill="#FFF4EC"/>
          <rect x="24.9" y="22.1" width="7.6" height="3.2" rx="1.6" fill="#191512"/>`;
      case 'wink':
        return `
          <path d="M11.9 23.7 h7.6" stroke="#191512" stroke-width="3.2" stroke-linecap="round"/>
          <circle cx="28.5" cy="23.5" r="4.2" ${lens}/>
          <circle cx="27.1" cy="22.1" r="1.25" ${hi}/>`;
      case 'ring':
        return `
          <circle cx="15.5" cy="23.5" r="5.2" fill="none" stroke="#191512" stroke-width="1.3" opacity=".45"/>
          <circle cx="28.5" cy="23.5" r="5.2" fill="none" stroke="#191512" stroke-width="1.3" opacity=".45"/>
          <circle cx="15.5" cy="23.5" r="3.5" ${lens}/><circle cx="14.3" cy="22.3" r="1.1" fill="#FFF4EC"/>
          <circle cx="28.5" cy="23.5" r="3.5" ${lens}/><circle cx="27.3" cy="22.3" r="1.1" fill="#FFF4EC"/>`;
      case 'shifted':   // looking — sockets fixed, pupils pushed hard to one side
        return `
          <circle cx="15.5" cy="23.5" r="4.2" fill="#120F0D"/>
          <circle cx="17.3" cy="23.5" r="2.9" ${lens}/><circle cx="18.4" cy="22.5" r="1.15" ${hi}/>
          <circle cx="15.5" cy="23.5" r="4.2" ${sock}/>
          <circle cx="28.5" cy="23.5" r="4.2" fill="#120F0D"/>
          <circle cx="30.3" cy="23.5" r="2.9" ${lens}/><circle cx="31.4" cy="22.5" r="1.15" ${hi}/>
          <circle cx="28.5" cy="23.5" r="4.2" ${sock}/>`;
      case 'droop':   // sad — pupils sunk low + a heavy lid edge across the top
        return `
          <circle cx="15.5" cy="23.5" r="4.2" fill="#120F0D"/>
          <circle cx="15.5" cy="25.0" r="2.7" ${lens}/><circle cx="14.5" cy="24.2" r="1.0" ${hi}/>
          <circle cx="15.5" cy="23.5" r="4.2" ${sock}/>
          <circle cx="28.5" cy="23.5" r="4.2" fill="#120F0D"/>
          <circle cx="28.5" cy="25.0" r="2.7" ${lens}/><circle cx="27.5" cy="24.2" r="1.0" ${hi}/>
          <circle cx="28.5" cy="23.5" r="4.2" ${sock}/>
          <path d="M11.9 20.9 q3.6 1.5 7.2 .5" stroke="var(--cg-lid,#E85A2C)" stroke-width="2.1"
                stroke-linecap="round" fill="none"/>
          <path d="M24.9 21.4 q3.6 -1.0 7.2 -.5" stroke="var(--cg-lid,#E85A2C)" stroke-width="2.1"
                stroke-linecap="round" fill="none"/>`;
      default:
        return eyesMarkup('round');
    }
  }

  const BOLT_PATH = 'M23.6 -9.4 L17.8 -2.4 L21.2 -2.4 L19.4 3.0 L26.0 -4.6 L22.4 -4.6 Z';

  function sizeClass(px) {
    if (px >= 48) return 'cg-s56';
    if (px >= 36) return 'cg-s40';
    if (px >= 26) return 'cg-s30';
    if (px >= 20) return 'cg-s22';
    return 'cg-s17';
  }

  /* ---------------------------------------------------------
     CONTROLLER
     --------------------------------------------------------- */
  function create(opts) {
    injectDefs();
    const o = Object.assign({
      size: 40,
      expression: 'neutral',
      idle: ['breathe', 'blink'],
      hover: null,        // e.g. ['happy','tilt']
      follow: false,
      hint: null,
      label: null,        // aria-label; null => aria-hidden
      lid: true,
    }, opts || {});

    const wrap = document.createElement('span');
    wrap.className = 'cg-robot-wrap';
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:12px';

    const svg = el('svg', {
      class: 'cg-robot ' + sizeClass(o.size),
      width: o.size, height: Math.round(o.size * 56 / 44),
      viewBox: VIEWBOX,
    });
    if (o.label) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', o.label); }
    else svg.setAttribute('aria-hidden', 'true');

    const outer = el('g', { class: 'cg-outer' });   // events: wobble/jolt/nod
    const idle  = el('g', { class: 'cg-idle' });    // idle loops
    const tiltG = el('g', { class: 'cg-tiltable' });// hover tilt / cursor rotate
    svg.append(outer); outer.append(idle); idle.append(tiltG);

    const ex = EXPRESSIONS[o.expression] || EXPRESSIONS.neutral;

    tiltG.innerHTML = `
      <g class="cg-antennas-g">
        <path d="M13.5 13 L10.5 3" stroke="var(--cg-orange-dp,#C9481F)" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M30.5 13 L33.5 3" stroke="var(--cg-orange-dp,#C9481F)" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="10.5" cy="2.4" r="1.9" fill="var(--cg-orange,#F2673A)"/>
        <circle cx="33.5" cy="2.4" r="1.9" fill="var(--cg-orange,#F2673A)"/>
      </g>
      <rect x="5" y="13" width="34" height="28" rx="5.5" fill="url(#cgBody)"/>
      <rect x="8" y="16.5" width="28" height="14" rx="3" fill="url(#cgPlate)"/>
      <rect x="2.2" y="22" width="3" height="9" rx="1.3" fill="var(--cg-orange-dp,#C9481F)"/>
      <rect x="38.8" y="22" width="3" height="9" rx="1.3" fill="var(--cg-orange-dp,#C9481F)"/>
      <g class="cg-eyes">${eyesMarkup(ex.eyes)}</g>
      ${o.lid && ex.eyes !== 'closed' ? `
        <g clip-path="url(#cgClipL)"><rect class="cg-lid-l" x="10" y="18.3" width="11" height="9" fill="var(--cg-lid,#E85A2C)" style="transform:translateY(-10px)"/></g>
        <g clip-path="url(#cgClipR)"><rect class="cg-lid-r" x="23" y="18.3" width="11" height="9" fill="var(--cg-lid,#E85A2C)" style="transform:translateY(-10px)"/></g>` : ''}
      <g class="cg-mouthG">
        ${ex.mouthO ? '<ellipse cx="22" cy="35.2" rx="2.5" ry="1.9" fill="none" stroke="var(--cg-mouth)" stroke-width="1.6"/>' :
          `<path class="cg-mouth" d="${ex.mouth}"/>`}
      </g>
      <g class="cg-boltG"><path class="cg-bolt" d="${BOLT_PATH}"/></g>
    `;

    if (ex.tilt) tiltG.style.transform = `rotate(${ex.tilt}deg)`;

    // apply idle animations
    const idleNames = [].concat(o.idle || []);
    idleNames.forEach(n => {
      const a = ANIMATIONS[n]; if (!a || !a.cls) return;
      if (n.startsWith('blink')) {
        svg.querySelectorAll('.cg-lid-l,.cg-lid-r').forEach(l => l.classList.add(a.cls));
      } else if (n === 'sway') {
        const g = svg.querySelector('.cg-antennas-g'); if (g) g.classList.add(a.cls);
      } else {
        idle.classList.add(a.cls);
      }
    });

    const boltEl = svg.querySelector('.cg-bolt');
    if (ex.bolt) boltEl.classList.add('cg-bolt--on');

    wrap.append(svg);

    let hintEl = null;
    if (o.hint) {
      hintEl = document.createElement('span');
      hintEl.className = 'cg-hint';
      hintEl.textContent = o.hint;
      wrap.append(hintEl);
    }

    /* ---- API ---- */
    const api = {
      el: wrap, svg,
      expression: o.expression,

      setExpression(name) {
        const e = EXPRESSIONS[name]; if (!e) return api;
        api.expression = name;
        svg.querySelector('.cg-eyes').innerHTML = eyesMarkup(e.eyes);
        const mg = svg.querySelector('.cg-mouthG');
        mg.innerHTML = e.mouthO
          ? '<ellipse cx="22" cy="35.2" rx="2.5" ry="1.9" fill="none" stroke="var(--cg-mouth)" stroke-width="1.6"/>'
          : `<path class="cg-mouth" d="${e.mouth}"/>`;
        tiltG.style.transform = e.tilt ? `rotate(${e.tilt}deg)` : '';
        boltEl.classList.toggle('cg-bolt--on', !!e.bolt);
        // re-apply blink if the new expression has open eyes
        const lids = svg.querySelectorAll('.cg-lid-l,.cg-lid-r');
        lids.forEach(l => l.style.display = (e.eyes === 'closed') ? 'none' : '');
        return api;
      },

      setMouth(key) {
        const p = svg.querySelector('.cg-mouth');
        if (p && MOUTHS[key]) p.setAttribute('d', MOUTHS[key]);
        return api;
      },

      play(name) {
        const a = ANIMATIONS[name];
        if (!a || a.kind !== 'event') return api;
        outer.classList.remove(a.cls);
        void outer.getBoundingClientRect();
        outer.classList.add(a.cls);
        setTimeout(() => outer.classList.remove(a.cls), a.ms + 40);
        return api;
      },
      wobble(){ return api.play('wobble') },
      nod(){ return api.play('nod') },
      shake(){ return api.play('shake') },
      pop(){ return api.play('pop') },
      jolt(){ return api.play('jolt') },

      /** surprise = jolt + wide eyes, then settle back */
      surprise(settleTo = 'neutral', ms = 1100) {
        api.setExpression('surprised').jolt();
        setTimeout(() => api.setExpression(settleTo), ms);
        return api;
      },

      think(on = true) {
        boltEl.classList.toggle('cg-bolt--on', on);
        if (on) api.setExpression('thinking');
        return api;
      },

      showHint(on = true) {
        if (hintEl) hintEl.classList.toggle('cg-hint--on', on);
        return api;
      },

      /** gaze: dx,dy in −1..1 */
      gaze(dx, dy) {
        const m = Math.hypot(dx, dy) || 1;
        if (m > 1) { dx /= m; dy /= m; }
        const MAX = 1.25, RATIO = .4;
        const t = `translate(${(dx*MAX).toFixed(2)}px, ${(dy*MAX).toFixed(2)}px)`;
        svg.querySelectorAll('.cg-pupil').forEach(p => p.style.transform = t);
        const mg = svg.querySelector('.cg-mouthG');
        if (mg) mg.style.transform =
          `translate(${(dx*MAX*RATIO).toFixed(2)}px, ${(dy*MAX*RATIO*.6).toFixed(2)}px)`;
        tiltG.style.transform = `rotate(${(dx*5).toFixed(2)}deg)`;
        return api;
      },
      resetGaze() {
        svg.querySelectorAll('.cg-pupil').forEach(p => p.style.transform = '');
        const mg = svg.querySelector('.cg-mouthG'); if (mg) mg.style.transform = '';
        const e = EXPRESSIONS[api.expression];
        tiltG.style.transform = e && e.tilt ? `rotate(${e.tilt}deg)` : '';
        return api;
      },
      lean(deg){ tiltG.style.transform = `rotate(${deg}deg)`; return api },
    };

    /* ---- wire behaviours ---- */
    if (o.hover) {
      const hovers = [].concat(o.hover);
      const expr = hovers.find(h => EXPRESSIONS[h]);
      const wantsTilt = hovers.includes('tilt');
      if (wantsTilt) wrap.classList.add('cg-hover-tilt');
      const base = o.expression;
      wrap.addEventListener('mouseenter', () => {
        if (expr) api.setExpression(expr);
        api.showHint(true);
      });
      wrap.addEventListener('mouseleave', () => {
        if (expr) api.setExpression(base);
        api.showHint(false);
      });
    }

    if (o.follow) {
      const host = o.followTarget || wrap;
      const onMove = (e) => {
        const r = svg.getBoundingClientRect();
        api.gaze((e.clientX - (r.left + r.width/2)) / (r.width/2),
                 (e.clientY - (r.top  + r.height/2)) / (r.height/2));
      };
      host.addEventListener('mousemove', onMove);
      host.addEventListener('mouseleave', () => api.resetGaze());
    }

    return api;
  }

  /* ---------------------------------------------------------
     AUTO-MOUNT  <div data-cg-robot ...>
     --------------------------------------------------------- */
  function mountAll(root) {
    (root || document).querySelectorAll('[data-cg-robot]:not([data-cg-mounted])')
      .forEach(node => {
        node.setAttribute('data-cg-mounted', '');
        const d = node.dataset;
        const bot = create({
          size: parseInt(d.size || 40, 10),
          expression: d.expression || 'neutral',
          idle: (d.idle || 'breathe blink').split(/\s+/).filter(Boolean),
          hover: d.hover ? d.hover.split(/\s+/).filter(Boolean) : null,
          follow: d.follow === 'true' || d.follow === '',
          hint: d.hint || null,
          label: d.label || null,
        });
        node.append(bot.el);
        node.__cgRobot = bot;
      });
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', () => mountAll());
  else mountAll();

  global.CGRobot = { create, mountAll, EXPRESSIONS, ANIMATIONS, MOUTHS, BOLT_PATH, VIEWBOX };
})(window);
