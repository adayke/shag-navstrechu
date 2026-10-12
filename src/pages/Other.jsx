import { useStore, today } from '../state/store.jsx';
import { useOpenKid } from '../components/KidMode.jsx';
import Chart from '../components/Chart.jsx';
import { Back, KCOL } from '../components/ui.jsx';

export function Cards() {
  const { t } = useStore();
  const openKid = useOpenKid();
  return (
    <>
      <h1>{t.nav.cards}</h1>
      <p className="sub">{t.cardsSub}</p>
      <div className="grid g3">
        {t.KCARDS.map((c, i) => (
          <button key={i} className="card click" onClick={() => openKid('cards', i)}
            style={{ background: KCOL[i][0], border: 0, textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: KCOL[i][1] }}>{c[0]}</div>
            <div className="small" style={{ color: KCOL[i][1], opacity: 0.85 }}>{c[1]}</div>
          </button>
        ))}
      </div>
      <div className="toolbar noprint" style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => openKid()}>{t.openKid}</button>
        <button className="btn plain" onClick={() => window.print()}>{t.print}</button>
      </div>
    </>
  );
}

export function About() {
  const { t, reset, toast } = useStore();
  const toggleTheme = () => {
    const r = document.documentElement;
    const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.dataset.theme = dark ? 'light' : 'dark';
  };
  return (
    <>
      <h1>{t.nav.about}</h1>
      <p className="sub">{t.aboutSub}</p>
      <div className="grid g2">
        <div className="card"><h2>{t.seqH}</h2><p>{t.seq}</p><p className="small muted">{t.seqNote}</p></div>
        <div className="card"><h2>{t.blocksH}</h2><p className="small">{t.blocks.map((b) => <span key={b}>{b}<br /></span>)}</p></div>
      </div>
      <h3>{t.princH}</h3>
      <div className="grid g3">
        {t.princ.map((p) => <div className="card" key={p[0]}><b>{p[0]}</b><p className="small muted" style={{ margin: '6px 0 0' }}>{p[1]}</p></div>)}
      </div>
      <div className="toolbar" style={{ marginTop: 20 }}>
        <button className="btn plain" onClick={() => { reset(); toast(t.resetDone); }}>{t.reset}</button>
        <button className="btn plain" onClick={toggleTheme}>{t.theme}</button>
      </div>
    </>
  );
}

export function Report({ id }) {
  const { t, obs, kidBy, kname, fmtDate, tx } = useStore();
  const k = kidBy(id);
  if (!k) return <Back to="kids">{t.allKids}</Back>;

  const rows = k.goals.map((g) => {
    const p = obs.filter((o) => o.kid === k.id && o.goal === g).sort((a, b) => a.date.localeCompare(b.date));
    const sc = p.filter((o) => o.score !== null);
    const first = sc[0], last = sc[sc.length - 1];
    const ctx = [...new Set(p.map((o) => t.CONTEXTS[o.ctx]))].join(', ');
    const next = p.length ? tx(p[p.length - 1].next) : '';
    return { g, first, last, ctx, next };
  });

  return (
    <>
      <Back to={'kid/' + k.id}>‹ {kname(k)}</Back>
      <h1>{t.repH}: {kname(k)}</h1>
      <p className="sub">{t.repSub(k.grade, k.next - 1, fmtDate(today()))}</p>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="rep">
          <thead><tr>{t.repCols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.g}>
                <td>{t.GOALS[r.g]}</td>
                <td>{r.first ? `${r.first.score} (${fmtDate(r.first.date)})` : '—'}</td>
                <td>{r.last ? `${r.last.score} (${fmtDate(r.last.date)})` : '—'}</td>
                <td>{r.ctx || '—'}</td>
                <td>{r.next || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card" style={{ marginTop: 14 }}><Chart kid={k} /></div>
      <div className="note" style={{ marginTop: 14 }}>{t.repNote}</div>
      <div className="toolbar noprint" style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => window.print()}>{t.repPrint}</button>
      </div>
    </>
  );
}
