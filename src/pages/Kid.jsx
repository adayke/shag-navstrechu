import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';
import Chart from '../components/Chart.jsx';
import { Back, Chip, ObsRow } from '../components/ui.jsx';

export default function Kid({ id }) {
  const { t, obs, kidBy, kname, lessonOf, lessonsOf, updateKid, toast } = useStore();
  const k = kidBy(id);
  if (!k) return <Back to="kids">{t.allKids}</Back>;
  const list = obs.filter((o) => o.kid === k.id).sort((a, b) => b.date.localeCompare(a.date));

  const toggleGoal = (i) => {
    if (k.goals.includes(i)) return updateKid(k.id, { goals: k.goals.filter((x) => x !== i) });
    if (k.goals.length >= 3) return toast(t.maxGoals);
    updateKid(k.id, { goals: [...k.goals, i] });
  };

  return (
    <>
      <Back to="kids">{t.allKids}</Back>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1>{kname(k)}</h1>
          <p className="sub" style={{ marginBottom: 12 }}>{t.nextLine(k.grade, k.next, lessonOf(k.grade, k.next).title)}</p>
        </div>
        <div className="toolbar">
          <button className="btn" onClick={() => go(`run/${k.id}/${k.grade}/${k.next}`)}>{t.startMeet}</button>
          <button className="btn ghost" onClick={() => go(`observe?kid=${k.id}`)}>{t.obsBtn}</button>
          <button className="btn plain" onClick={() => go('report/' + k.id)}>{t.report}</button>
        </div>
      </div>

      <div className="card">
        <h2>{t.dyn}</h2>
        <Chart kid={k} />
        <p className="small muted" style={{ margin: '8px 0 0' }}>{t.scaleLegend}</p>
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <h2>{t.goalsH} <span className="small muted">(2–3)</span></h2>
          {t.GOALS.map((g, i) => <Chip key={i} on={k.goals.includes(i)} style={{ textAlign: 'left' }} onClick={() => toggleGoal(i)}>{g}</Chip>)}
        </div>
        <div className="card">
          <h2>{t.settings}</h2>
          <label className="f">{t.workbook}</label>
          <div>{[1, 2, 3, 4].map((g) => <Chip key={g} on={k.grade === g} onClick={() => updateKid(k.id, { grade: g })}>{t.grade(g)}</Chip>)}</div>
          <label className="f">{t.nextMeetL}</label>
          <select value={k.next} onChange={(e) => updateKid(k.id, { next: +e.target.value })}>
            {lessonsOf(k.grade).map((l) => <option key={l.n} value={l.n}>{l.n}. {l.title}</option>)}
          </select>
        </div>
      </div>

      <h3>{t.journal}</h3>
      <div className="list">
        {list.length ? list.map((o) => <ObsRow key={o.id} o={o} />) : <div className="empty">{t.noRecords}</div>}
      </div>
    </>
  );
}
