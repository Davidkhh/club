'use client';
import { useActionState } from 'react';
import { saveSettingsAction, type SettingsState } from './actions';

export default function SettingsForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(saveSettingsAction, {});
  return (
    <form className="adm-form" action={action}>
      <div className="adm-field"><label htmlFor="s-email">Контактная почта (показывается в подвале сайта)</label><input id="s-email" name="contactEmail" type="email" defaultValue={email} required maxLength={254} /></div>
      <p className={state.ok ? 'adm-ok' : 'adm-error'} role="status">{state.ok ? 'Сохранено.' : (state.error ?? '')}</p>
      <button className="adm-btn" type="submit" disabled={pending}>{pending ? 'Сохраняем…' : 'Сохранить'}</button>
    </form>
  );
}
