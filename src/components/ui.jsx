import { ChevronLeft } from 'lucide-react';
import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';

export const STAGE_MIN = [[2, 3], [3, 5], [10, 12], [3, 5], [2, 3]];

export const KCOL = [
  ['var(--stop-soft)', 'var(--stop)'],
  ['var(--brand-soft)', 'var(--brand)'],
  ['var(--accent-soft)', 'var(--accent)'],
  ['var(--violet-soft)', 'var(--violet)'],
  ['var(--soft)', 'var(--ink)'],
  ['var(--soft)', 'var(--muted)'],
];

export function Chip({ on, children, ...rest }) {
  return <button className={'chip' + (on ? ' on' : '')} {...rest}>{children}</button>;
}

export function Back({ to, children }) {
  return <button className="back noprint" onClick={() => go(to)}><ChevronLeft size={18} aria-hidden="true" />{children}</button>;
}

export function ObsRow({ o }) {
  const { t, kidBy, kname, fmtDate, tx } = useStore();
  return (
    <div className="row" onClick={() => go('kid/' + o.kid)}>
      <Avatar kid={kidBy(o.kid)} size={34} />
      <div className="t">
        <b>{t.GOALS[o.goal]}</b>
        <span className="small muted">{kname(kidBy(o.kid))} · {fmtDate(o.date)} · {t.MODES[o.mode]} · {tx(o.sit)}</span>
      </div>
      <span className="tag">{o.score === null ? t.notRated : `${o.score} · ${t.SCALE[o.score]}`}</span>
    </div>
  );
}

export function Toast() {
  const { toastMsg } = useStore();
  return <div className={'toast' + (toastMsg ? ' show' : '')}>{toastMsg}</div>;
}

// Круглая аватарка с инициалами; цвет стабильный для каждого ребёнка
const AV_COLORS = ['#2f7d6d', '#c27a1a', '#5d4a91', '#b23b2e', '#3a78b5', '#7a8a2e'];
export function Avatar({ kid, size = 40 }) {
  const name = kid?.name || '?';
  const initials = name.replace(/[^\p{L} ]/gu, '').split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const color = AV_COLORS[[...(kid?.id || '')].reduce((s, c) => s + c.charCodeAt(0), 0) % AV_COLORS.length];
  return (
    <span className="avatar" aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.38, background: color }}>{initials}</span>
  );
}
