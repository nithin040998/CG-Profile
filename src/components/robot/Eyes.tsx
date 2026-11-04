import type { EyeKind } from './expressions';

/* EYE RENDERERS — one per EyeKind, ported from robot-lib.js eyesMarkup().
   Pupil groups carry data-pupil so gaze can move them without React. */

interface EyesProps {
  kind: EyeKind;
  /** url(#…) of the lens gradient */
  lens: string;
  /** url(#…) of the socket shadow gradient */
  socket: string;
  /** class for the pupil groups (the gaze drift transition) */
  pupilClass: string;
}

const HI = '#FFF4EC';
const DARK = '#120F0D';
const LINE = '#191512';

export function Eyes({ kind, lens, socket, pupilClass }: EyesProps) {
  switch (kind) {
    case 'wide': // surprised — bigger sockets, small high pupils
      return (
        <>
          <circle cx="15.3" cy="23.3" r="5.3" fill={DARK} />
          <g className={pupilClass} data-pupil="">
            <circle cx="15.3" cy="23.3" r="3.1" fill={lens} />
            <circle cx="13.9" cy="21.8" r="1.3" fill={HI} />
          </g>
          <circle cx="15.3" cy="23.3" r="5.3" fill={socket} />
          <circle cx="28.7" cy="23.3" r="5.3" fill={DARK} />
          <g className={pupilClass} data-pupil="">
            <circle cx="28.7" cy="23.3" r="3.1" fill={lens} />
            <circle cx="27.3" cy="21.8" r="1.3" fill={HI} />
          </g>
          <circle cx="28.7" cy="23.3" r="5.3" fill={socket} />
        </>
      );
    case 'bars':
      return (
        <>
          <rect x="11.4" y="22" width="8.4" height="3.4" rx="1.7" fill={lens} />
          <rect x="24.4" y="22" width="8.4" height="3.4" rx="1.7" fill={lens} />
          <rect x="12.2" y="22.6" width="3.4" height=".9" rx=".45" fill={HI} opacity=".5" />
          <rect x="25.2" y="22.6" width="3.4" height=".9" rx=".45" fill={HI} opacity=".5" />
        </>
      );
    case 'closed':
      return (
        <>
          <path d="M11.9 23.7 h7.6" stroke={LINE} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M24.9 23.7 h7.6" stroke={LINE} strokeWidth="3.2" strokeLinecap="round" />
        </>
      );
    case 'asym':
      return (
        <>
          <circle cx="15.3" cy="23.3" r="5" fill={lens} />
          <circle cx="13.4" cy="21.4" r="1.45" fill={HI} />
          <rect x="24.9" y="22.1" width="7.6" height="3.2" rx="1.6" fill={LINE} />
        </>
      );
    case 'wink':
      return (
        <>
          <path d="M11.9 23.7 h7.6" stroke={LINE} strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="28.5" cy="23.5" r="4.2" fill={lens} />
          <circle cx="27.1" cy="22.1" r="1.25" fill={HI} opacity=".92" />
        </>
      );
    case 'ring':
      return (
        <>
          <circle cx="15.5" cy="23.5" r="5.2" fill="none" stroke={LINE} strokeWidth="1.3" opacity=".45" />
          <circle cx="28.5" cy="23.5" r="5.2" fill="none" stroke={LINE} strokeWidth="1.3" opacity=".45" />
          <circle cx="15.5" cy="23.5" r="3.5" fill={lens} />
          <circle cx="14.3" cy="22.3" r="1.1" fill={HI} />
          <circle cx="28.5" cy="23.5" r="3.5" fill={lens} />
          <circle cx="27.3" cy="22.3" r="1.1" fill={HI} />
        </>
      );
    case 'shifted': // looking — sockets fixed, pupils pushed hard to one side
      return (
        <>
          <circle cx="15.5" cy="23.5" r="4.2" fill={DARK} />
          <circle cx="17.3" cy="23.5" r="2.9" fill={lens} />
          <circle cx="18.4" cy="22.5" r="1.15" fill={HI} opacity=".92" />
          <circle cx="15.5" cy="23.5" r="4.2" fill={socket} />
          <circle cx="28.5" cy="23.5" r="4.2" fill={DARK} />
          <circle cx="30.3" cy="23.5" r="2.9" fill={lens} />
          <circle cx="31.4" cy="22.5" r="1.15" fill={HI} opacity=".92" />
          <circle cx="28.5" cy="23.5" r="4.2" fill={socket} />
        </>
      );
    case 'droop': // sad — pupils sunk low + a heavy lid edge across the top
      return (
        <>
          <circle cx="15.5" cy="23.5" r="4.2" fill={DARK} />
          <circle cx="15.5" cy="25.0" r="2.7" fill={lens} />
          <circle cx="14.5" cy="24.2" r="1.0" fill={HI} opacity=".92" />
          <circle cx="15.5" cy="23.5" r="4.2" fill={socket} />
          <circle cx="28.5" cy="23.5" r="4.2" fill={DARK} />
          <circle cx="28.5" cy="25.0" r="2.7" fill={lens} />
          <circle cx="27.5" cy="24.2" r="1.0" fill={HI} opacity=".92" />
          <circle cx="28.5" cy="23.5" r="4.2" fill={socket} />
          <path d="M11.9 20.9 q3.6 1.5 7.2 .5" style={{ stroke: 'var(--cg-lid,#E85A2C)' }}
            strokeWidth="2.1" strokeLinecap="round" fill="none" />
          <path d="M24.9 21.4 q3.6 -1.0 7.2 -.5" style={{ stroke: 'var(--cg-lid,#E85A2C)' }}
            strokeWidth="2.1" strokeLinecap="round" fill="none" />
        </>
      );
    case 'round':
    default:
      return (
        <>
          <circle cx="15.5" cy="23.5" r="4.2" fill={DARK} />
          <g className={pupilClass} data-pupil="">
            <circle cx="15.5" cy="23.5" r="2.9" fill={lens} />
            <circle cx="14.4" cy="22.4" r="1.15" fill={HI} opacity=".92" />
          </g>
          <circle cx="15.5" cy="23.5" r="4.2" fill={socket} />
          <circle cx="28.5" cy="23.5" r="4.2" fill={DARK} />
          <g className={pupilClass} data-pupil="">
            <circle cx="28.5" cy="23.5" r="2.9" fill={lens} />
            <circle cx="27.4" cy="22.4" r="1.15" fill={HI} opacity=".92" />
          </g>
          <circle cx="28.5" cy="23.5" r="4.2" fill={socket} />
        </>
      );
  }
}
