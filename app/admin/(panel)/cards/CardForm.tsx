'use client';
import { useActionState, useState, type ChangeEvent } from 'react';
import type { StoredCard } from '@/lib/cards';
import { saveCardAction, deleteCardAction, type FormState } from './actions';

// Приводим картинку к карточному формату 2:3 (640×960), обрезая по центру.
async function toCardJpeg(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const W = 640, H = 960, target = W / H;
  const src = bmp.width / bmp.height;
  let sw = bmp.width, sh = bmp.height, sx = 0, sy = 0;
  if (src > target) { sw = bmp.height * target; sx = (bmp.width - sw) / 2; }
  else { sh = bmp.width / target; sy = (bmp.height - sh) / 2; }
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  c.getContext('2d')!.drawImage(bmp, sx, sy, sw, sh, 0, 0, W, H);
  return c.toDataURL('image/jpeg', 0.82);
}

export default function CardForm({ card, isNew }: { card: StoredCard; isNew: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCardAction, {});
  const [title, setTitle] = useState(card.title);
  const [meaning, setMeaning] = useState(card.meaning);
  const [image, setImage] = useState(card.image);
  const [imageData, setImageData] = useState('');
  const [removed, setRemoved] = useState(false);
  const [imgErr, setImgErr] = useState('');

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgErr('');
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 12_000_000) { setImgErr('Нужен JPEG, PNG или WebP до 12 МБ.'); return; }
    try { const d = await toCardJpeg(file); setImageData(d); setImage(d); setRemoved(false); } catch { setImgErr('Не удалось обработать изображение.'); }
  }

  return (
    <div className="adm-edit">
      <form className="adm-form" action={action}>
        <input type="hidden" name="id" value={isNew ? 'new' : card.id} />
        <input type="hidden" name="image" value={removed ? '' : card.image} />
        <input type="hidden" name="imageData" value={imageData} />
        <input type="hidden" name="removeImage" value={removed ? '1' : ''} />
        <div className="adm-field"><label htmlFor="c-title">Название (необязательно)</label><input id="c-title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="Например: Путь" /></div>
        <div className="adm-field"><label htmlFor="c-meaning">Текст карты (значение, вопрос для размышления)</label><textarea id="c-meaning" name="meaning" rows={6} value={meaning} onChange={(e) => setMeaning(e.target.value)} maxLength={1200} required placeholder="Что эта карта говорит вам сейчас? Напишите значение или вопрос, который увидит посетитель." /></div>
        <div className="adm-field"><label htmlFor="c-image">Картинка карты (будет обрезана в формат 2:3)</label><input id="c-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} />
          {image && !removed && <button type="button" className="adm-btn adm-btn-ghost" onClick={() => { setRemoved(true); setImage(''); setImageData(''); }}>Удалить картинку</button>}
          {imgErr && <p className="adm-error" role="alert">{imgErr}</p>}</div>
        <div className="adm-field"><label htmlFor="c-order">Порядок показа (меньше = раньше)</label><input id="c-order" name="order" type="number" min={0} max={999} defaultValue={card.order} /></div>
        <label className="adm-check"><input type="checkbox" name="published" defaultChecked={card.published} /> Опубликована на сайте</label>
        <p className="adm-error" role="alert">{state.error ?? ''}</p>
        <button className="adm-btn" type="submit" disabled={pending}>{pending ? 'Сохраняем…' : 'Сохранить'}</button>
      </form>
      <aside className="adm-preview" aria-label="Предпросмотр">
        <p className="adm-preview-label">Так карта выглядит на сайте</p>
        <div className="adm-card-preview">
          {image && !removed ? <img src={image} alt={title || 'Карта'} /> : <span className="adm-card-preview-empty">Нет картинки</span>}
        </div>
        {title && <h2>{title}</h2>}
        {meaning && <p>{meaning}</p>}
        {!isNew && (
          <form action={deleteCardAction} onSubmit={(e) => { if (!confirm('Удалить карту? Это действие нельзя отменить.')) e.preventDefault(); }}>
            <input type="hidden" name="id" value={card.id} />
            <button className="adm-btn adm-btn-danger" type="submit">Удалить карту</button>
          </form>
        )}
      </aside>
    </div>
  );
}
