import { useState } from 'react';
import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';
import { useOpenKid } from '../components/KidMode.jsx';
import { Back, STAGE_MIN } from '../components/ui.jsx';

export default function Lesson({ g, n }) {
  const { t, kids, kname, lessonOf } = useStore();
  const openKid = useOpenKid();
  const [who, setWho] = useState(kids[0]?.id);
  const l = lessonOf(g, n);
  if (!l) return <Back to="lessons">{t.allLessons}</Back>;

  return (
    <>
      <Back to="lessons">{t.allLessons}</Back>
      <div className="small muted">{t.grade(g)} · {t.lessonN(n)} · {l.block}</div>
      <h1 style={{ marginTop: 4 }}>{l.title}</h1>
      <div className="grid g2" style={{ marginTop: 16 }}>
        <div className="card"><div className="tag">{t.goal}</div><p style={{ margin: '8px 0 0' }}>{l.goal}</p></div>
        <div className="card"><div className="tag acc">{t.result}</div><p style={{ margin: '8px 0 0' }}>{l.result}</p></div>
      </div>
      <div className="toolbar" style={{ marginTop: 16 }}>
        <select style={{ width: 'auto' }} value={who} onChange={(e) => setWho(e.target.value)}>
          {kids.map((k) => <option key={k.id} value={k.id}>{kname(k)} ({t.gradeShort(k.grade)})</option>)}
        </select>
        <button className="btn" onClick={() => go(`run/${who}/${g}/${n}`)}>{t.runLesson}</button>
        <button className="btn ghost" onClick={() => openKid()}>{t.showKid}</button>
        <button className="btn plain" onClick={() => go(`observe?kid=${who}&lesson=${n}`)}>{t.writeObs}</button>
      </div>

      <h3>{t.structure}</h3>
      {t.STAGES.map((s, i) => (
        <div className="stage" key={i}>
          <div className="tm">{STAGE_MIN[i][0]}–{STAGE_MIN[i][1]}′</div>
          <div><b>{s[0]}.</b> {s[1]}</div>
        </div>
      ))}
      <p className="small muted">{t.structNote}</p>

      <h3>{t.levelsH}</h3>
      <div className="grid g3">
        {t.LEVELS.map((x) => <div className="card" key={x[0]}><b>{x[0]}</b><p className="small muted" style={{ margin: '6px 0 0' }}>{x[1]}</p></div>)}
      </div>

      <h3>{t.adaptH}</h3>
      <div className="list">
        {t.ADAPT.map((a) => (
          <div className="row" style={{ cursor: 'default' }} key={a[0]}>
            <div className="t"><b>{a[0]}</b><span className="small muted">{a[1]}</span></div>
          </div>
        ))}
      </div>
    </>
  );
}
