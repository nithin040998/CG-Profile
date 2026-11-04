'use client';

import {
  useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState,
  type Ref,
} from 'react';
import { cx } from '@/lib/cx';
import { idleClasses, strikeClass, type IdleName } from '@/motion/express/idle';
import { playGesture, type GestureName } from '@/motion/express/gesture';
import morph from '@/motion/express/morph.transition.module.css';
import type { Gazer } from '@/motion/respond/gaze.frame';
import { Eyes } from './Eyes';
import {
  ASPECT, BOLT_PATH, EXPRESSIONS, VIEWBOX, sizeClass,
  type Expression, type ExpressionName,
} from './expressions';
import s from './Robot.module.css';

/* ============================================================
   CG ROBOT — React port of design/assets/robot-lib.js.

   Expression is React state: changing it re-renders the eyes and morphs the
   mouth. Everything per-frame (gaze) or one-shot (gestures) is imperative,
   through the handle, so a moving cursor never re-renders the svg.
   ============================================================ */

export interface RobotHandle extends Gazer {
  setExpression(name: ExpressionName): void;
  readonly expression: ExpressionName;
  play(gesture: GestureName): void;
  /** jolt + wide eyes, then settle */
  surprise(settleTo?: ExpressionName, ms?: number): void;
}

export interface RobotProps {
  ref?: Ref<RobotHandle>;
  /** px width; also picks the mouth stroke weight */
  size?: number;
  expression?: ExpressionName;
  idle?: readonly IdleName[];
  /** hover response: an expression to wear and/or the springy −8° tilt */
  hover?: { expression?: ExpressionName; tilt?: boolean };
  /** accessible name; omitted => decorative (aria-hidden) */
  label?: string;
  /** render eyelids (needed for blink) */
  lid?: boolean;
  /** fill the container width instead of the fixed `size` */
  fluid?: boolean;
  onDark?: boolean;
  className?: string;
}

const DEFAULT_IDLE: readonly IdleName[] = ['breathe', 'blink'];

export function Robot({
  ref,
  size = 40,
  expression = 'neutral',
  idle = DEFAULT_IDLE,
  hover,
  label,
  lid = true,
  fluid = false,
  onDark = false,
  className,
}: RobotProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const url = (k: string) => `url(#${uid}-${k})`;

  // the prop is the declarative default; the handle can override it
  const [expr, setExpr] = useState<ExpressionName>(expression);
  const [prevProp, setPrevProp] = useState(expression);
  if (expression !== prevProp) {
    setPrevProp(expression);
    setExpr(expression);
  }

  const svgRef = useRef<SVGSVGElement>(null);
  const outerRef = useRef<SVGGElement>(null);
  const tiltRef = useRef<SVGGElement>(null);
  const mouthGRef = useRef<SVGGElement>(null);
  const exprRef = useRef<ExpressionName>(expr);
  const settleRef = useRef(0);
  const timers = useRef(new Set<number>());

  const e: Expression = EXPRESSIONS[expr] ?? EXPRESSIONS.neutral;

  // The head tilt is written imperatively, never through a style prop: gaze
  // writes the same transform every frame, and a React-managed style would
  // fight it on the next render.
  useLayoutEffect(() => {
    exprRef.current = expr;
    if (tiltRef.current) tiltRef.current.style.transform = e.tilt ? `rotate(${e.tilt}deg)` : '';
  }, [expr, e.tilt]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      clearTimeout(settleRef.current);
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  useImperativeHandle(ref, (): RobotHandle => {
    const setExpression = (name: ExpressionName) => {
      // an explicit change cancels a pending surprise settle, so a stale
      // timer can never overwrite the expression the caller just chose
      clearTimeout(settleRef.current);
      setExpr(name);
    };
    const play = (g: GestureName) => {
      const outer = outerRef.current;
      if (!outer) return;
      const id = playGesture(outer, g);
      timers.current.add(id);
    };
    return {
      setExpression,
      get expression() { return exprRef.current; },
      play,
      surprise(settleTo = 'neutral', ms = 1100) {
        setExpression('surprised');
        play('jolt');
        settleRef.current = window.setTimeout(() => setExpr(settleTo), ms);
      },
      gaze(dx, dy) {
        const svg = svgRef.current;
        if (!svg) return;
        const m = Math.hypot(dx, dy) || 1;
        if (m > 1) { dx /= m; dy /= m; }
        const MAX = 1.25, RATIO = 0.4;
        const t = `translate(${(dx * MAX).toFixed(2)}px, ${(dy * MAX).toFixed(2)}px)`;
        svg.querySelectorAll<SVGGElement>('[data-pupil]').forEach((p) => { p.style.transform = t; });
        if (mouthGRef.current) {
          mouthGRef.current.style.transform =
            `translate(${(dx * MAX * RATIO).toFixed(2)}px, ${(dy * MAX * RATIO * 0.6).toFixed(2)}px)`;
        }
        if (tiltRef.current) tiltRef.current.style.transform = `rotate(${(dx * 5).toFixed(2)}deg)`;
      },
      resetGaze() {
        svgRef.current?.querySelectorAll<SVGGElement>('[data-pupil]')
          .forEach((p) => { p.style.transform = ''; });
        if (mouthGRef.current) mouthGRef.current.style.transform = '';
        const tilt = (EXPRESSIONS[exprRef.current] as Expression).tilt;
        if (tiltRef.current) tiltRef.current.style.transform = tilt ? `rotate(${tilt}deg)` : '';
      },
    };
  }, []);

  const closed = e.eyes === 'closed';
  const lidStyle = {
    fill: 'var(--cg-lid,#E85A2C)',
    transform: 'translateY(-10px)',
    display: closed ? 'none' : undefined,
  };
  const dp = { fill: 'var(--cg-orange-dp,#C9481F)' };
  const hoverHandlers = hover?.expression
    ? {
        onMouseEnter: () => setExpr(hover.expression!),
        onMouseLeave: () => setExpr(expression),
      }
    : {};

  return (
    <svg
      ref={svgRef}
      className={cx(
        s.robot, s[sizeClass(size)], fluid && s.fluid, onDark && s.onDark,
        hover?.tilt && morph.hoverTilt, className,
      )}
      width={size}
      height={Math.round(size * ASPECT)}
      viewBox={VIEWBOX}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      {...hoverHandlers}
    >
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--cg-orange-hi,#F87A4B)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--cg-orange-lo,#E85A2C)' }} />
        </linearGradient>
        <linearGradient id={`${uid}-plate`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--cg-orange-dp,#C9481F)' }} />
          <stop offset="100%" stopColor="#E05C2A" />
        </linearGradient>
        <radialGradient id={`${uid}-lens`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#5B5049" />
          <stop offset="38%" stopColor="#2E2823" />
          <stop offset="100%" stopColor="#100E0C" />
        </radialGradient>
        <radialGradient id={`${uid}-socket`} cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="#8E3413" stopOpacity="0" />
          <stop offset="100%" stopColor="#7A2A0E" stopOpacity=".5" />
        </radialGradient>
        <clipPath id={`${uid}-clipL`}><circle cx="15.5" cy="23.5" r="4.2" /></clipPath>
        <clipPath id={`${uid}-clipR`}><circle cx="28.5" cy="23.5" r="4.2" /></clipPath>
      </defs>

      {/* outer: gestures · idle: body loops · tiltable: expression/gaze/hover tilt */}
      <g ref={outerRef} className={s.outer}>
        <g className={cx(s.idle, idleClasses(idle, 'body'))}>
          <g ref={tiltRef} className={cx(s.tiltable, morph.tilt)}>
            <g className={idleClasses(idle, 'antennas')}>
              <path d="M13.5 13 L10.5 3" style={{ stroke: dp.fill }} strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M30.5 13 L33.5 3" style={{ stroke: dp.fill }} strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="10.5" cy="2.4" r="1.9" style={{ fill: 'var(--cg-orange,#F2673A)' }} />
              <circle cx="33.5" cy="2.4" r="1.9" style={{ fill: 'var(--cg-orange,#F2673A)' }} />
            </g>
            <rect x="5" y="13" width="34" height="28" rx="5.5" fill={url('body')} />
            <rect x="8" y="16.5" width="28" height="14" rx="3" fill={url('plate')} />
            <rect x="2.2" y="22" width="3" height="9" rx="1.3" style={dp} />
            <rect x="38.8" y="22" width="3" height="9" rx="1.3" style={dp} />

            <g>
              <Eyes kind={e.eyes} lens={url('lens')} socket={url('socket')} pupilClass={morph.pupil} />
            </g>

            {lid && (
              <>
                <g clipPath={url('clipL')}>
                  <rect className={idleClasses(idle, 'lids')} x="10" y="18.3" width="11" height="9" style={lidStyle} />
                </g>
                <g clipPath={url('clipR')}>
                  <rect className={idleClasses(idle, 'lids')} x="23" y="18.3" width="11" height="9" style={lidStyle} />
                </g>
              </>
            )}

            <g ref={mouthGRef} className={morph.drift}>
              {e.mouthO ? (
                <ellipse cx="22" cy="35.2" rx="2.5" ry="1.9" fill="none"
                  style={{ stroke: 'var(--cg-mouth)' }} strokeWidth="1.6" />
              ) : (
                <path className={cx(s.mouth, morph.mouth)} d={e.mouth} />
              )}
            </g>

            <g>
              <path className={cx(s.bolt, e.bolt && strikeClass)} d={BOLT_PATH} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
