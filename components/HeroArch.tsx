import Image from 'next/image';

// Двойная арка с изображением. Файл: /public/images/hero-yoga.jpg (сейчас нейтральный плейсхолдер — замените своим фото 3:4).
// Значок «Вернись к себе» — стеклянная линза: в Chrome/Edge она преломляет фото (фильтр #lg-lens),
// в остальных браузерах — размытое стекло.
export default function HeroArch() {
  return (
    <div className="arch">
      <div className="arch-outline" aria-hidden="true" />
      <div className="arch-frame">
        <Image
          src="/images/hero-yoga.jpg"
          alt="Девушка в позе йоги на рассвете у окна в светлой студии"
          fill
          priority
          sizes="(max-width: 700px) 88vw, (max-width: 1200px) 45vw, 560px"
          className="arch-img"
        />
        <div className="arch-shade" aria-hidden="true" />
        <p className="arch-caption">Путь к себе начинается с малого</p>
      </div>
      <div className="arch-lens" role="img" aria-label="Вернись к себе">
        <svg className="arch-lens-ring" viewBox="0 0 120 120" aria-hidden="true">
          <defs><path id="arch-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
          <text><textPath href="#arch-circle" textLength="270" lengthAdjust="spacing">ВЕРНИСЬ К СЕБЕ · ВЕРНИСЬ К СЕБЕ ·</textPath></text>
        </svg>
        <span className="arch-lens-star" aria-hidden="true">✳</span>
      </div>
    </div>
  );
}
