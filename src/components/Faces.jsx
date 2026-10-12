// SVG-лица эмоций. Подключаются один раз в App, дальше используются через <Face id="joy" />.

export const EMO_IDS = ['joy', 'sad', 'anger', 'fear', 'calm', 'unk'];

export function FaceSprites() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="f-joy" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#f6c445" /><circle cx="14" cy="16" r="2.2" fill="#3a2e12" /><circle cx="26" cy="16" r="2.2" fill="#3a2e12" /><path d="M12 23 Q20 31 28 23" stroke="#3a2e12" strokeWidth="2.2" fill="none" strokeLinecap="round" /></symbol>
        <symbol id="f-sad" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#6fa3d8" /><circle cx="14" cy="16" r="2.2" fill="#13263a" /><circle cx="26" cy="16" r="2.2" fill="#13263a" /><path d="M13 28 Q20 22 27 28" stroke="#13263a" strokeWidth="2.2" fill="none" strokeLinecap="round" /></symbol>
        <symbol id="f-anger" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#e0675a" /><path d="M10 12 L17 15 M30 12 L23 15" stroke="#3a1410" strokeWidth="2.2" strokeLinecap="round" /><circle cx="14" cy="18" r="2.2" fill="#3a1410" /><circle cx="26" cy="18" r="2.2" fill="#3a1410" /><path d="M13 28 L27 28" stroke="#3a1410" strokeWidth="2.2" strokeLinecap="round" /></symbol>
        <symbol id="f-fear" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#9b86c9" /><circle cx="14" cy="16" r="3" fill="#fff" /><circle cx="26" cy="16" r="3" fill="#fff" /><circle cx="14" cy="16" r="1.5" fill="#211a33" /><circle cx="26" cy="16" r="1.5" fill="#211a33" /><ellipse cx="20" cy="27" rx="4" ry="3" fill="#211a33" /></symbol>
        <symbol id="f-calm" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#7cc3a5" /><path d="M11 17 Q14 19 17 17 M23 17 Q26 19 29 17" stroke="#14302a" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M15 25 Q20 28 25 25" stroke="#14302a" strokeWidth="2" fill="none" strokeLinecap="round" /></symbol>
        <symbol id="f-unk" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#d9dde4" /><text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="700" fill="#5b6675" fontFamily="Arial">?</text></symbol>
      </defs>
    </svg>
  );
}

export function Face({ id, size, style }) {
  return (
    <svg style={{ width: size, height: size, display: 'block', ...style }} viewBox="0 0 40 40">
      <use href={`#f-${id}`} />
    </svg>
  );
}
