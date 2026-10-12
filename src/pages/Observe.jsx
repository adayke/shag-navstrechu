import { useState } from 'react';
import { useStore, today } from '../state/store.jsx';
import { go } from '../state/router.js';
import { uid } from '../data/demo.js';
import { Chip } from '../components/ui.jsx';

// Запись наблюдения по разделу 2.3: цель, шкала 0–3, способ ответа, где, ситуация, следующий шаг
export default function Observe({ params }) {
  const { t, kids, kidBy, kname, lessonsOf, addObs, updateKid, toast } = useStore();
  const first = kidBy(params.kid) || kids[0];
  const fromRun = params.fromRun === '1';

  const [f, setF] = useState({
    kid: first.id, goal: first.goals[0] ?? 0, score: null, na: false, mode: 1, ctx: 0,
    lesson: +params.lesson || first.next, sit: '', next: '',
  });
  const set = (patch) => setF((s) => ({ ...s, ...patch }));
  const k = kidBy(f.kid);

  const save = () => {
    if (f.score === null && !f.na) return toast(t.needScore);
    addObs({
      id: uid(), kid: f.kid, date: today(), goal: f.goal, score: f.na ? null : f.score,
      lesson: f.lesson, mode: f.mode, ctx: f.ctx, sit: f.sit || '—', next: f.next,
    });
    if (fromRun) updateKid(f.kid, { next: Math.min(34, f.lesson + 1) });
    toast(t.saved);
    go('kid/' + f.kid);
  };

  return (
    <>
      <h1>{t.obsH}</h1>
      <p className="sub">{t.obsSub}</p>
      {fromRun && <div className="note" style={{ marginBottom: 14 }}>{t.obsAfter}</div>}
      <div className="card" style={{ maxWidth: 720 }}>
        <label className="f">{t.fKid}</label>
        <div>
          {kids.map((x) => (
            <Chip key={x.id} on={x.id === f.kid} onClick={() => set({ kid: x.id, goal: x.goals[0] ?? 0, lesson: x.next })}>{kname(x)}</Chip>
          ))}
        </div>

        <label className="f">{t.fLesson}</label>
        <select value={f.lesson} onChange={(e) => set({ lesson: +e.target.value })}>
          {lessonsOf(k.grade).map((l) => <option key={l.n} value={l.n}>{l.n}. {l.title}</option>)}
        </select>

        <label className="f">{t.fGoal}</label>
        <div>{t.GOALS.map((g, i) => <Chip key={i} on={i === f.goal} onClick={() => set({ goal: i })}>{k.goals.includes(i) ? '★ ' : ''}{g}</Chip>)}</div>

        <label className="f">{t.fHow}</label>
        <div className="scale">
          {t.SCALE.map((s, i) => (
            <button key={i} className={f.score === i && !f.na ? 'on' : ''} onClick={() => set({ score: i, na: false })}><b>{i}</b>{s}</button>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <Chip on={f.na} onClick={() => set({ na: !f.na, score: null })}>{t.fNA}</Chip>
        </div>

        <label className="f">{t.fMode}</label>
        <div>{t.MODES.map((m, i) => <Chip key={i} on={i === f.mode} onClick={() => set({ mode: i })}>{m}</Chip>)}</div>

        <label className="f">{t.fWhere}</label>
        <div>{t.CONTEXTS.map((m, i) => <Chip key={i} on={i === f.ctx} onClick={() => set({ ctx: i })}>{m}</Chip>)}</div>

        <label className="f" htmlFor="sit">{t.fSit}</label>
        <textarea id="sit" placeholder={t.phSit} value={f.sit} onChange={(e) => set({ sit: e.target.value })} />

        <label className="f" htmlFor="nxt">{t.fNext}</label>
        <input id="nxt" type="text" placeholder={t.phNext} value={f.next} onChange={(e) => set({ next: e.target.value })} />

        <div style={{ marginTop: 18 }}><button className="btn lg" onClick={save}>{t.save}</button></div>
      </div>
    </>
  );
}
