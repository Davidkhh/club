import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { ViewTransitions } from 'next-view-transitions';
import GlassFilters from '@/components/GlassFilters';
import GlassFx from '@/components/GlassFx';
import './globals.css';

// Два семейства: Manrope — текст и заголовки, Cormorant Garamond — акцентные слова курсивом.
const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-cormorant', display: 'swap' });

export const metadata: Metadata = {
  title: 'Клуб Счастья — йога, цигун и практики заботы о себе',
  description: 'Онлайн-клуб йоги, цигун, медитаций и мягких практик для тела и внутреннего равновесия. Знакомьтесь с направлениями и форматом участия.',
  metadataBase: new URL('https://clubschastya-yoga.ru'),
  alternates: { canonical: '/' },
  robots: { index: false, follow: false },
  openGraph: { title: 'Клуб Счастья', description: 'Время для счастья — сейчас, место для счастья — здесь!', type: 'website', locale: 'ru_RU', url: '/', siteName: 'Клуб Счастья' },
  twitter: { card: 'summary', title: 'Клуб Счастья', description: 'Время для счастья — сейчас, место для счастья — здесь!' },
};
export const viewport: Viewport = { themeColor: '#f7f5f0' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // ViewTransitions — плавные переходы между страницами (карточка практики → страница практики)
  return <ViewTransitions>
    <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`}>
      <body>
        <a className="skip-link" href="#content">Перейти к содержимому</a>
        {children}
        <GlassFilters />
        <GlassFx />
      </body>
    </html>
  </ViewTransitions>;
}
