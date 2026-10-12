import { Play, PenLine, FileText } from 'lucide-react';
import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';
import Chart from '../components/Chart.jsx';
import { Avatar, Back, Chip, ObsRow } from '../components/ui.jsx';

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
          <div className="kid-head" style={{ marginBottom: 4 }}><Avatar kid={k} size={52} /><div><h1 style={{ margin: 0 }}>{kname(k)}</h1><div className="small muted">{t.grade(k.grade)}{k.age ? ' · ' + t.age(k.age) : ''}</div></div></div>
          <p className="sub" style={{ marginBottom: 12 }}>{t.nextLine(k.grade, k.next, lessonOf(k.grade, k.next).title)}</p>
        </div>
        <div className="toolbar">
          <button className="btn" onClick={() => go(`run/${k.id}/${k.grade}/${k.next}`)}><Play size={16} aria-hidden="true" />{t.startMeet}</button>
          <button className="btn ghost" onClick={() => go(`observe?kid=${k.id}`)}><PenLine size={16} aria-hidden="true" />{t.obsBtn}</button>
          <button className="btn plain" onClick={() => go('report/' + k.id)}><FileText size={16} aria-hidden="true" />{t.report}</button>
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
          <label className="f" htmlFor="kname">{t.fName}</label>
          <input id="kname" type="text" value={k.name || ''} onChange={(e) => updateKid(k.id, { name: e.target.value })} />
          <label className="f">{t.fAge}</label>
          <div>{[6, 7, 8, 9, 10, 11].map((a) => <Chip key={a} on={k.age === a} onClick={() => updateKid(k.id, { age: a })}>{a}</Chip>)}</div>
          <label className="f">{t.workbook}</label>
          <div>{[1, 2, 3, 4].map((g) => <Chip key={g} on={k.grade === g} onClick={() => updateKid(k.id, { grade: g })}>{t.grade(g)}</Chip>)}</div>
          <label className="f">{t.nextMeetL}</label>
          <select value={k.next} onChange={(e) => updateKid(k.id, { next: +e.target.value })}>
            {lessonsOf(k.grade).map((l) => <option key={l.n} value={l.n}>{l.n}. {l.title}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <h2>{t.adaptH}</h2>
        {t.ADAPT.map((a, i) => <Chip key={i} on={(k.adapt || []).includes(i)} onClick={() => updateKid(k.id, { adapt: (k.adapt || []).includes(i) ? k.adapt.filter((x) => x !== i) : [...(k.adapt || []), i] })}>{a[0]}</Chip>)}
        {(k.adapt || []).map((i) => <p className="small muted" key={i} style={{ margin: '4px 0 0' }}><b>{t.ADAPT[i][0]}:</b> {t.ADAPT[i][1]}</p>)}
      </div>

      <h3>{t.journal}</h3>
      <div className="list">
        {list.length ? list.map((o) => <ObsRow key={o.id} o={o} />) : <div className="empty">{t.noRecords}</div>}
      </div>
    </>
  );
}
