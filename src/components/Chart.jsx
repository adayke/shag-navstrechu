import { useStore } from '../state/store.jsx';

const COLS = ['var(--brand)', 'var(--accent)', 'var(--violet)'];
const W = 640, H = 220, PL = 40, PR = 16, PT = 14, PB = 34;

// Линейный график динамики по целям ребёнка (шкала 0–3)
export default function Chart({ kid }) {
  const { t, obs, fmtDate, tx } = useStore();
  const series = kid.goals.map((g) => ({
    g,
    pts: obs.filter((o) => o.kid === kid.id && o.goal === g && o.score !== null).sort((a, b) => a.date.localeCompare(b.date)),
  }));
  const all = series.flatMap((s) => s.pts).map((o) => +new Date(o.date));
  if (!all.length) return <div className="empty">{t.chartEmpty}</div>;

  let x0 = Math.min(...all), x1 = Math.max(...all);
  if (x0 === x1) { x0 -= 864e5 * 15; x1 += 864e5 * 15; }
  const X = (d) => PL + ((+new Date(d) - x0) / (x1 - x0)) * (W - PL - PR);
  const Y = (s) => PT + ((3 - s) / 3) * (H - PT - PB);
  const ticks = [...new Set(all)].sort();
  const step = Math.max(1, Math.ceil(ticks.length / 6));

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={t.dyn}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line x1={PL} x2={W - PR} y1={Y(i)} y2={Y(i)} stroke="var(--line)" />
            <text x={PL - 10} y={Y(i) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{i}</text>
          </g>
        ))}
        {series.map((s, i) => s.pts.length > 0 && (
          <g key={s.g}>
            <polyline fill="none" stroke={COLS[i % 3]} strokeWidth="2.5" points={s.pts.map((o) => X(o.date) + ',' + Y(o.score)).join(' ')} />
            {s.pts.map((o) => (
              <circle key={o.id} cx={X(o.date)} cy={Y(o.score)} r="4.5" fill={COLS[i % 3]}>
                <title>{fmtDate(o.date)}: {o.score} — {tx(o.sit)}</title>
              </circle>
            ))}
          </g>
        ))}
        {ticks.filter((_, i) => i % step === 0).map((tk) => {
          const d = new Date(tk).toISOString().slice(0, 10);
          return <text key={tk} x={X(d)} y={H - 12} textAnchor="middle" fontSize="11" fill="var(--muted)">{fmtDate(d)}</text>;
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
        {series.map((s, i) => (
          <span className="small" key={s.g}>
            <span style={{ display: 'inline-block', width: 14, height: 4, borderRadius: 2, background: COLS[i % 3], verticalAlign: 'middle', marginRight: 6 }} />
            {t.GOALS[s.g]}
          </span>
        ))}
      </div>
    </>
  );
}
