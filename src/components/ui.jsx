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
  return <button className="back noprint" onClick={() => go(to)}>{children}</button>;
}

export function ObsRow({ o }) {
  const { t, kidBy, kname, fmtDate, tx } = useStore();
  return (
    <div className="row" onClick={() => go('kid/' + o.kid)}>
      <div className="n">{o.score === null ? '—' : o.score}</div>
      <div className="t">
        <b>{t.GOALS[o.goal]}</b>
        <span className="small muted">{kname(kidBy(o.kid))} · {fmtDate(o.date)} · {t.MODES[o.mode]} · {tx(o.sit)}</span>
      </div>
      <span className="tag">{o.score === null ? t.notRated : t.SCALE[o.score]}</span>
    </div>
  );
}

export function Toast() {
  const { toastMsg } = useStore();
  return <div className={'toast' + (toastMsg ? ' show' : '')}>{toastMsg}</div>;
}
