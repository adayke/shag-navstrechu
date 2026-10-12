import { useEffect, useState } from 'react';
import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';
import { useOpenKid } from '../components/KidMode.jsx';
import { Back, STAGE_MIN } from '../components/ui.jsx';

const mm = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

// Проведение занятия: 5 этапов из раздела 2.2 и тихий таймер
export default function Run({ kidId, g, n }) {
  const { t, kidBy, kname, lessonOf, toast } = useStore();
  const openKid = useOpenKid();
  const [idx, setIdx] = useState(0);
  const [sec, setSec] = useState(0);
  const [total, setTotal] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => { setSec((s) => s + 1); setTotal((s) => s + 1); }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  const k = kidBy(kidId);
  const l = lessonOf(g, n);
  if (!k || !l) return <Back to="lessons">{t.exitLesson}</Back>;

  const last = idx === t.STAGES.length - 1;
  const finish = () => { toast(t.lessonDone); go(`observe?kid=${k.id}&lesson=${n}&fromRun=1`); };
  const pick = (i) => { setIdx(i); setSec(0); };

  return (
    <>
      <Back to="lessons">{t.exitLesson}</Back>
      <div className="small muted">{kname(k)} · {t.grade(g)} · {t.lessonN(n)}</div>
      <h1 style={{ marginTop: 4 }}>{l.title}</h1>
      <p className="sub">{l.goal}</p>
      <div className="grid g2" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'start' }}>
        <div>
          {t.STAGES.map((s, i) => (
            <div key={i} className={'stage' + (i === idx ? ' now' : i < idx ? ' done' : '')} onClick={() => pick(i)}>
              <div className="tm">{STAGE_MIN[i][0]}–{STAGE_MIN[i][1]}′</div>
              <div><b>{s[0]}{i < idx ? ' ✓' : ''}</b><br /><span className="small">{s[1]}</span></div>
            </div>
          ))}
        </div>
        <div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="small muted">{t.STAGES[idx][0]} · {t.orient(...STAGE_MIN[idx])}</div>
            <div className="timer" style={{ color: sec > STAGE_MIN[idx][1] * 60 ? 'var(--accent)' : undefined }}>{mm(sec)}</div>
            <div className="small muted">{t.total} {mm(total)}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
              <button className="btn plain" onClick={() => setPaused((p) => !p)}>{paused ? t.resume : t.pause}</button>
              <button className="btn" onClick={() => (last ? finish() : pick(idx + 1))}>{last ? t.finish : t.next}</button>
            </div>
          </div>
          <button className="btn ghost" style={{ width: '100%', marginTop: 10, justifyContent: 'center' }} onClick={() => openKid()}>{t.showKid}</button>
          <button className="btn plain" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }} onClick={finish}>{t.endEarly}</button>
          <div className="note" style={{ marginTop: 12 }}>{t.timerNote}</div>
        </div>
      </div>
    </>
  );
}
