import { cx } from '@/lib/cx';
import respond from '@/motion/respond/hover.transition.module.css';
import { companionClick } from '@/components/companion/reactions';
import s from './Wordmark.module.css';

/* Outlined Outfit 800 (design/assets/wordmark.svg). Inline so the letters
   inherit currentColor and the dot keeps the accent. Height-driven: set the
   height, width follows the 1607:732 ink ratio. Click = the wink easter egg. */
export function Wordmark() {
  return (
    <a className={cx(s.wm, respond.tintHost)} href="#top" aria-label="CG — back to top" {...companionClick('wink')}>
      <svg viewBox="0 0 1607 732" aria-hidden="true" focusable="false">
        <g fill="currentColor">
          <path d="M379 732Q298 732 229 704.5Q160 677 108.5 627.5Q57 578 28.5 511Q0 444 0 366Q0 287 28.5 220.5Q57 154 108.5 105Q160 56 228.5 28Q297 0 377 0Q461 0 528 26.5Q595 53 646 100L526 220Q501 192 464 176Q427 160 377 160Q334 160 298.5 174Q263 188 237 215.5Q211 243 196.5 281Q182 319 182 366Q182 413 196.5 451Q211 489 237 516.5Q263 544 298.5 558.5Q334 573 377 573Q427 573 465 557.5Q503 542 530 513L650 633Q598 680 532.5 706Q467 732 379 732Z" />
          <path d="M1020 732Q939 732 870.5 704.5Q802 677 750.5 627Q699 577 670.5 510.5Q642 444 642 366Q642 287 671.5 220.5Q701 154 754 104.5Q807 55 877.5 27.5Q948 0 1028 0Q1123 0 1200 33.5Q1277 67 1325 126L1205 246Q1169 203 1126 181.5Q1083 160 1026 160Q968 160 922.5 185.5Q877 211 850 257Q823 303 823 365Q823 427 848.5 474Q874 521 918.5 547Q963 573 1021 573Q1079 573 1119.5 551Q1160 529 1181.5 487Q1203 445 1203 387L1324 465L1001 457V311H1383V338Q1383 465 1337 553Q1291 641 1209.5 686.5Q1128 732 1020 732Z" />
        </g>
        <path className={cx(s.dot, respond.tint)} d="M1508 732Q1464 732 1436 703Q1408 674 1408 631Q1408 588 1436 559Q1464 530 1508 530Q1551 530 1579 559Q1607 588 1607 631Q1607 674 1579 703Q1551 732 1508 732Z" />
      </svg>
    </a>
  );
}
