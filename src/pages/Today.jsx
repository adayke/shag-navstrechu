import { Play, Smile } from 'lucide-react';
import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';
import { useOpenKid } from '../components/KidMode.jsx';
import { Avatar, ObsRow } from '../components/ui.jsx';
import { blockIndex } from '../components/LessonCard.jsx';

export default function Today() {
  const { t, kids, obs, lessonOf, kname, blocksOf } = useStore();
  const openKid = useOpenKid();
  const last = [...obs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <>
      <h1>{t.hello}</h1>
      <p className="sub">{t.helloSub}</p>
      <div className="grid g3">
        {kids.map((k) => {
          const l = lessonOf(k.grade, k.next);
          return (
            <div className={`glow b${blockIndex(blocksOf, k.grade, l.block) + 1}`} key={k.id}>
              <div className="kid-head" style={{ cursor: 'pointer' }} onClick={() => go('kid/' + k.id)}>
                <Avatar kid={k} size={36} />
                <div><b>{kname(k)}</b><div className="small muted">{t.grade(k.grade)} · {t.meet(k.next)}</div></div>
              </div>
              <h2 style={{ margin: '12px 0 4px' }}>{l.title}</h2>
              <p className="small muted" style={{ margin: '0 0 14px' }}>{l.goal}</p>
              <button className="btn" onClick={() => go(`run/${k.id}/${k.grade}/${k.next}`)}><Play size={16} aria-hidden="true" />{t.startLesson}</button>{' '}
              <button className="btn ghost" onClick={() => go(`lesson/${k.grade}/${k.next}`)}>{t.more}</button>
            </div>
          );
        })}
      </div>
      <div className="grid g4 stats" style={{ marginTop: 16 }}>
        <div className="card stat"><b>136</b><span className="muted small">{t.statLessons}</span></div>
        <div className="card stat"><b>{kids.length}</b><span className="muted small">{t.statKids}</span></div>
        <div className="card stat"><b>{obs.length}</b><span className="muted small">{t.statObs}</span></div>
        <div className="card click stat" onClick={() => openKid()}><b><Smile size={28} aria-hidden="true" /></b><span className="muted small">{t.statKid}</span></div>
      </div>
      <h3>{t.lastObs}</h3>
      <div className="list">
        {last.length ? last.map((o) => <ObsRow key={o.id} o={o} />) : <div className="empty">{t.noRecords}</div>}
      </div>
    </>
  );
}
