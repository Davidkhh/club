'use client';
import { useState, type FormEvent } from 'react';

const messages: Record<string, string> = {
  invalid_name: 'Пожалуйста, укажите имя.',
  invalid_email: 'Проверьте адрес электронной почты.',
  invalid_phone: 'Проверьте номер телефона (не меньше 10 цифр).',
  consent_required: 'Нужно согласие на обработку персональных данных.',
  not_configured: 'Регистрация пока недоступна. Попробуйте позже или напишите нам на почту.',
};

// Телефон: + и 10–15 цифр, допускаются пробелы, скобки и дефисы.
const PHONE_RE = /^\+?[\d\s()-]{10,}$/;

export default function SubscribeForm({ privacyUrl, email, intent = 'trial' }: { privacyUrl: string; email: string; intent?: 'trial' | 'club' }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') ?? '').trim();
    const phone = String(f.get('phone') ?? '').trim();

    // Быстрая проверка на клиенте — чтобы не ходить на сервер зря.
    if (!name) { setMsg(messages.invalid_name); setState('error'); return; }
    if (!PHONE_RE.test(phone) || (phone.match(/\d/g)?.length ?? 0) < 10) { setMsg(messages.invalid_phone); setState('error'); return; }

    setState('sending'); setMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: f.get('email'), phone, consent: f.get('consent') === 'on', company: f.get('company'), intent }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) { setState('ok'); return; }
      setMsg(messages[data.error ?? ''] ?? `Не удалось отправить. Попробуйте ещё раз или напишите на ${email}.`);
    } catch {
      setMsg(`Нет связи с сервером. Попробуйте ещё раз или напишите на ${email}.`);
    }
    setState('error');
  }

  if (state === 'ok') return <p className="sub-ok" role="status">{intent === 'club'
    ? 'Спасибо! Заявка отправлена — мы свяжемся с вами по почте или телефону. Если письма нет во входящих, проверьте папку «Спам».'
    : 'Спасибо! Мы отправили письмо на ваш адрес. Если его нет во входящих, проверьте папку «Спам».'}</p>;

  return (
    <form className="sub-form" onSubmit={onSubmit} noValidate={false}>
      <div className="sub-field">
        <label htmlFor="sub-name">Имя</label>
        <input id="sub-name" name="name" type="text" autoComplete="name" required placeholder="Как к вам обращаться" maxLength={80} />
      </div>
      <div className="sub-field">
        <label htmlFor="sub-email">Электронная почта</label>
        <input id="sub-email" name="email" type="email" inputMode="email" autoComplete="email" required placeholder="name@example.com" maxLength={254} />
      </div>
      <div className="sub-field">
        <label htmlFor="sub-phone">Телефон</label>
        <input id="sub-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+7 900 000-00-00" maxLength={32} />
      </div>
      <button className="button button-primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Отправляем…' : intent === 'club' ? 'Отправить заявку' : 'Получить пробный урок'}</button>
      <label className="sub-consent"><input type="checkbox" name="consent" required /> <span>Согласен на обработку <a href={privacyUrl} target="_blank" rel="noopener noreferrer">персональных данных</a> и получение рассылки клуба</span></label>
      <input className="sub-trap" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="sub-error" role="alert" aria-live="assertive">{state === 'error' ? msg : ''}</p>
    </form>
  );
}
