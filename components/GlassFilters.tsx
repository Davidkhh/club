// SVG-фильтр «жидкого стекла» для линзы на арке.
// Карта смещения: красный канал растёт слева направо, зелёный — сверху вниз; в центре нейтральное серое
// пятно (128,128) — там картинка не искажается, а у краёв линзы фон «загибается», как в настоящем стекле.
// backdrop-filter: url(#…) поддерживают только Chromium-браузеры (Chrome, Edge, Яндекс);
// остальные получают обычное размытое стекло — см. .lg-refract в globals.css.

export const LENS_SIZE = 112;

const map = `<svg xmlns='http://www.w3.org/2000/svg' width='${LENS_SIZE}' height='${LENS_SIZE}'>
<defs>
<linearGradient id='r' x1='0' x2='1' y1='0' y2='0'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#f00'/></linearGradient>
<linearGradient id='g' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#0f0'/></linearGradient>
<filter id='b' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='7'/></filter>
</defs>
<rect width='100%' height='100%' fill='url(#r)'/>
<rect width='100%' height='100%' fill='url(#g)' style='mix-blend-mode:screen'/>
<circle cx='50%' cy='50%' r='32%' fill='rgb(128,128,0)' filter='url(#b)'/>
</svg>`;
const MAP = `data:image/svg+xml,${encodeURIComponent(map)}`;

export default function GlassFilters() {
  return <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
    <filter id="lg-lens" x="0" y="0" width={LENS_SIZE} height={LENS_SIZE} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feImage href={MAP} x="0" y="0" width={LENS_SIZE} height={LENS_SIZE} preserveAspectRatio="none" result="map" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale="38" xChannelSelector="R" yChannelSelector="G" result="refract" />
      <feGaussianBlur in="refract" stdDeviation="0.6" />
    </filter>

    {/* Та же линза + медленная «жидкая» рябь: турбулентность плавно дышит, край стекла колышется, как вода. */}
    <filter id="lg-lens-liquid" x="0" y="0" width={LENS_SIZE} height={LENS_SIZE} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feImage href={MAP} x="0" y="0" width={LENS_SIZE} height={LENS_SIZE} preserveAspectRatio="none" result="map" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale="38" xChannelSelector="R" yChannelSelector="G" result="refract" />
      <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="2" seed="4" result="noise">
        <animate attributeName="baseFrequency" dur="14s" values="0.015 0.02;0.021 0.014;0.015 0.02" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </feTurbulence>
      <feDisplacementMap in="refract" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" result="liquid" />
      <feGaussianBlur in="liquid" stdDeviation="0.5" />
    </filter>

    {/* Жидкая рябь для плоских стеклянных панелей (плашка эфира, карточки-герои практик). */}
    <filter id="lg-liquid" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.008 0.013" numOctaves="2" seed="9" result="noise">
        <animate attributeName="baseFrequency" dur="20s" values="0.008 0.013;0.013 0.009;0.008 0.013" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>;
}
