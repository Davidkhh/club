'use client';
import { useActionState, useState, type ChangeEvent } from 'react';
import Portrait from '@/components/Portrait';
import type { StoredTeacher } from '@/lib/cms';
import { saveTeacherAction, deleteTeacherAction, type FormState } from './actions';

async function toSquareJpeg(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(bmp.width, bmp.height);
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  c.getContext('2d')!.drawImage(bmp, (bmp.width - s) / 2, (bmp.height - s) * 0.3, s, s, 0, 0, 512, 512);
  return c.toDataURL('image/jpeg', 0.85);
}

export default function TeacherForm({ teacher, isNew }: { teacher: StoredTeacher; isNew: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveTeacherAction, {});
  const [name, setName] = useState(teacher.name);
  const [short, setShort] = useState(teacher.shortBio);
  const [photo, setPhoto] = useState(teacher.photo);
  const [photoData, setPhotoData] = useState('');
  const [removed, setRemoved] = useState(false);
  const [photoErr, setPhotoErr] = useState('');

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoErr('');
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 8_000_000) { setPhotoErr('Нужен JPEG, PNG или WebP до 8 МБ.'); return; }
    try { const d = await toSquareJpeg(file); setPhotoData(d); setPhoto(d); setRemoved(false); } catch { setPhotoErr('Не удалось обработать изображение.'); }
  }

  return (
    <div className="adm-edit">
      <form className="adm-form" action={action}>
        <input type="hidden" name="id" value={isNew ? 'new' : teacher.id} />
        <input type="hidden" name="photo" value={removed ? '' : teacher.photo} />
        <input type="hidden" name="photoData" value={photoData} />
        <input type="hidden" name="removePhoto" value={removed ? '1' : ''} />
        <div className="adm-field"><label htmlFor="t-name">Имя</label><input id="t-name" name="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} /></div>
        <div className="adm-field"><label htmlFor="t-spec">Специализация</label><input id="t-spec" name="specialization" defaultValue={teacher.specialization} maxLength={160} /></div>
        <div className="adm-field"><label htmlFor="t-short">Краткое описание</label><textarea id="t-short" name="shortBio" rows={3} value={short} onChange={(e) => setShort(e.target.value)} maxLength={300} /></div>
        <div className="adm-field"><label htmlFor="t-bio">Биография</label><textarea id="t-bio" name="bio" rows={8} defaultValue={teacher.bio} maxLength={5000} /></div>
        <div className="adm-field"><label htmlFor="t-photo">Фотография (будет обрезана до круга)</label><input id="t-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
          {photo && !removed && <button type="button" className="adm-btn adm-btn-ghost" onClick={() => { setRemoved(true); setPhoto(''); setPhotoData(''); }}>Удалить фото</button>}
          {photoErr && <p className="adm-error" role="alert">{photoErr}</p>}</div>
        <div className="adm-field"><label htmlFor="t-order">Порядок показа (меньше = выше)</label><input id="t-order" name="order" type="number" min={0} max={999} defaultValue={teacher.order} /></div>
        <label className="adm-check"><input type="checkbox" name="published" defaultChecked={teacher.published} /> Опубликовано на сайте</label>
        <p className="adm-error" role="alert">{state.error ?? ''}</p>
        <button className="adm-btn" type="submit" disabled={pending}>{pending ? 'Сохраняем…' : 'Сохранить'}</button>
      </form>
      <aside className="adm-preview" aria-label="Предпросмотр">
        <p className="adm-preview-label">Так профиль выглядит на сайте</p>
        <Portrait name={name || '?'} src={photo || undefined} alt={name} />
        <h2>{name || 'Имя преподавателя'}</h2>
        {short && <p>{short}</p>}
        {!isNew && (
          <form action={deleteTeacherAction} onSubmit={(e) => { if (!confirm('Удалить профиль? Это действие нельзя отменить.')) e.preventDefault(); }}>
            <input type="hidden" name="id" value={teacher.id} />
            <button className="adm-btn adm-btn-danger" type="submit">Удалить профиль</button>
          </form>
        )}
      </aside>
    </div>
  );
}
