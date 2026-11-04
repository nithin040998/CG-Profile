import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/motion/guide/smooth-scroll.native.css';

import { Companion, CompanionProvider } from '@/components/companion';
import { Nav } from '@/components/nav/Nav';
import { RevealObserver } from '@/motion/reveal/RevealObserver';
import { NO_SCRIPT_CSS } from '@/motion/reveal';
import { site } from '@/content/profile';

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} data-scroll-behavior="smooth">
      <body>
        <noscript dangerouslySetInnerHTML={{ __html: `<style>${NO_SCRIPT_CSS}</style>` }} />
        <CompanionProvider>
          {/* ONE companion for the whole site, outside the page content so a
              route change never unmounts it */}
          <Companion />
          <Nav />
          {children}
        </CompanionProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
