type Props = { name: string; src?: string; alt?: string; eager?: boolean };

// Единственное место, где задаётся форма портретов людей: круг 1:1, object-fit: cover.
// Стили: .portrait в globals.css. Без фото показывается инициал, не случайное изображение.
export default function Portrait({ name, src, alt, eager }: Props) {
  return <span className="portrait">{src
    ? <img src={src} alt={alt ?? name} width={400} height={400} loading={eager ? 'eager' : 'lazy'} />
    : <span className="teacher-initial" aria-hidden="true">{name[0]}</span>}</span>;
}
