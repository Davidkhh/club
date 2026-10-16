import type { Metadata, Viewport } from 'next';
import './globals.css';
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
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body><a className="skip-link" href="#top">Перейти к содержимому</a>{children}</body></html>; }
