import Link from 'next/link';
import { site } from '@/lib/content';
import { getSettings } from '@/lib/cms';
export default async function Footer() {
  const email = (await getSettings()).contactEmail;
  return <footer className="footer section-shell"><div className="footer-top"><Link className="wordmark footer-wordmark" href="/"><span className="wordmark-mark">с.</span><span>КЛУБ<br/>СЧАСТЬЯ</span></Link><p>{site.tagline}</p><a className="footer-email" href={`mailto:${email}`}>{email} ↗</a></div><div className="footer-bottom"><span>© Клуб Счастья</span><span>ИП Кузнецова Татьяна Юрьевна · ОГРНИП 319774600667027 · ИНН 503001424957</span><div><a href={site.offerUrl}>Договор оферты</a><a href={site.privacyUrl}>Политика персональных данных</a></div></div></footer>;
}
