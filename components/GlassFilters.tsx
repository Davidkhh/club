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
  </svg>;
}
