'use client';
import { useState, type FormEvent } from 'react';

const messages: Record<string, string> = {
  invalid_email: 'Проверьте адрес электронной почты.',
  consent_required: 'Нужно согласие на обработку персональных данных.',
  not_configured: 'Подписка пока недоступна. Попробуйте позже или напишите нам на почту.',
};

export default function SubscribeForm({ privacyUrl, email, intent = 'trial' }: { privacyUrl: string; email: string; intent?: 'trial' | 'club' }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const f = new FormData(e.currentTarget);
    setState('sending'); setMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: f.get('email'), consent: f.get('consent') === 'on', company: f.get('company'), intent }),
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
    ? 'Спасибо! Заявка отправлена — мы напишем вам на почту. Если письма нет во входящих, проверьте папку «Спам».'
    : 'Спасибо! Мы отправили письмо на ваш адрес. Если его нет во входящих, проверьте папку «Спам».'}</p>;

  return (
    <form className="sub-form" onSubmit={onSubmit} noValidate={false}>
      <label htmlFor="sub-email">Адрес электронной почты</label>
      <div className="sub-row">
        <input id="sub-email" name="email" type="email" inputMode="email" autoComplete="email" required placeholder="name@example.com" maxLength={254} />
        <button className="button button-primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Отправляем…' : intent === 'club' ? 'Отправить заявку' : 'Получить пробный урок'}</button>
      </div>
      <label className="sub-consent"><input type="checkbox" name="consent" required /> <span>Согласен на обработку <a href={privacyUrl} target="_blank" rel="noopener noreferrer">персональных данных</a> и получение рассылки клуба</span></label>
      <input className="sub-trap" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="sub-error" role="alert" aria-live="assertive">{state === 'error' ? msg : ''}</p>
    </form>
  );
}
