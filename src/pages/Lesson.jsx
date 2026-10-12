import { useState } from 'react';
import { Play, Smile, PenLine, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../state/store.jsx';
import { useContent } from '../state/content.js';
import { go } from '../state/router.js';
import { useOpenKid } from '../components/KidMode.jsx';
import { Back, STAGE_MIN } from '../components/ui.jsx';
import Blocks from '../components/Blocks.jsx';
import { BLOCK_ICONS, blockIndex } from '../components/LessonCard.jsx';

// Страница занятия: задания из рабочей тетради (с рисунками) и как проводить встречу
export default function Lesson({ g, n }) {
  const { t, lang, kids, kname, lessonOf, blocksOf } = useStore();
  const content = useContent(lang);
  const openKid = useOpenKid();
  const [who, setWho] = useState(kids[0]?.id);
  const [tab, setTab] = useState('tasks');
  const l = lessonOf(g, n);
  if (!l) return <Back to="lessons">{t.allLessons}</Back>;
  const bi = blockIndex(blocksOf, g, l.block);
  const Icon = BLOCK_ICONS[bi];
  const blocks = content?.grades[String(g)]?.lessons[String(n)];

  return (
    <>
      <Back to="lessons">{t.allLessons}</Back>
      <div className={`glow b${bi + 1}`} style={{ marginBottom: 22 }}>
        <div className="course-top" style={{ marginBottom: 14 }}>
          <span className="tile"><Icon size={22} aria-hidden="true" /></span>
          <div className="badges">
            <span className="badge">{t.grade(g)}</span>
            <span className="badge">{l.block}</span>
            <span className="badge"><Clock size={12} aria-hidden="true" />{t.min30}</span>
          </div>
        </div>
        <div className="small muted">{t.lessonN(n)}</div>
        <h1 style={{ marginTop: 4 }}>{l.title}</h1>
        <div className="grid g2" style={{ marginTop: 14 }}>
          <div><div className="tag">{t.goal}</div><p style={{ margin: '8px 0 0' }}>{l.goal}</p></div>
          <div><div className="tag acc">{t.result}</div><p style={{ margin: '8px 0 0' }}>{l.result}</p></div>
        </div>
      </div>

      <div className="lesson-layout">
        <section>
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'tasks'} className={tab === 'tasks' ? 'on' : ''} onClick={() => setTab('tasks')}>{t.tabTasks}</button>
            <button role="tab" aria-selected={tab === 'how'} className={tab === 'how' ? 'on' : ''} onClick={() => setTab('how')}>{t.tabHow}</button>
          </div>

          {tab === 'tasks' && (blocks ? <Blocks blocks={blocks} /> : <div className="empty">{t.loading}</div>)}

          {tab === 'how' && (
            <>
              <h3 style={{ marginTop: 0 }}>{t.structure}</h3>
              {t.STAGES.map((s, i) => (
                <div className="stage" key={i} style={{ cursor: 'default' }}>
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
          )}
        </section>

        <aside className="aside">
          <div className="card">
            <label className="f" style={{ marginTop: 0 }}>{t.fKid}</label>
            <select value={who} onChange={(e) => setWho(e.target.value)}>
              {kids.map((k) => <option key={k.id} value={k.id}>{kname(k)} ({t.gradeShort(k.grade)})</option>)}
            </select>
            <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
              <button className="btn" onClick={() => go(`run/${who}/${g}/${n}`)}><Play size={16} aria-hidden="true" />{t.runLesson}</button>
              <button className="btn ghost" onClick={() => openKid()}><Smile size={16} aria-hidden="true" />{t.showKid}</button>
              <button className="btn plain" onClick={() => go(`observe?kid=${who}&lesson=${n}`)}><PenLine size={16} aria-hidden="true" />{t.writeObs}</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn plain" style={{ flex: 1 }} disabled={n <= 1} onClick={() => go(`lesson/${g}/${n - 1}`)}><ChevronLeft size={16} aria-hidden="true" />{n - 1 || ''}</button>
            <button className="btn plain" style={{ flex: 1 }} disabled={n >= 34} onClick={() => go(`lesson/${g}/${n + 1}`)}>{n < 34 ? n + 1 : ''}<ChevronRight size={16} aria-hidden="true" /></button>
          </div>
        </aside>
      </div>
    </>
  );
}
