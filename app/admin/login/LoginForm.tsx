'use client';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, type LoginState } from './actions';

function Submit() {
  const { pending } = useFormStatus();
  return <button className="adm-btn" type="submit" disabled={pending}>{pending ? 'Входим…' : 'Войти'}</button>;
}

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, action] = useActionState<LoginState, FormData>(loginAction, {});
  const [show, setShow] = useState(false);
  return (
    <form className="adm-form" action={action} noValidate>
      {!configured && <p className="adm-notice">Вход пока не настроен: задайте переменные окружения (см. README).</p>}
      <div className="adm-field">
        <label htmlFor="adm-user">Логин</label>
        <input id="adm-user" name="username" type="text" autoComplete="username" required maxLength={128} aria-invalid={Boolean(state.error)} aria-describedby={state.error ? 'adm-err' : undefined} />
      </div>
      <div className="adm-field">
        <label htmlFor="adm-pass">Пароль</label>
        <div className="adm-pass">
          <input id="adm-pass" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required maxLength={256} aria-invalid={Boolean(state.error)} aria-describedby={state.error ? 'adm-err' : undefined} />
          <button type="button" className="adm-toggle" onClick={() => setShow((v) => !v)} aria-pressed={show}>{show ? 'Скрыть' : 'Показать'}</button>
        </div>
      </div>
      <p id="adm-err" className="adm-error" role="alert">{state.error ?? ''}</p>
      <Submit />
    </form>
  );
}
