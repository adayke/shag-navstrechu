import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';
import { uid } from '../data/demo.js';

const LETTERS = 'АБВГДЕЖЗИКЛМНОПРСТУ';

export default function Kids() {
  const { t, kids, obs, kname, addKid, toast } = useStore();

  const add = () => {
    const kid = { id: uid(), letter: LETTERS[kids.length % LETTERS.length], grade: 1, goals: [0, 1], next: 1 };
    addKid(kid);
    toast(`${t.added}: ${kname(kid)}`);
    go('kid/' + kid.id);
  };

  return (
    <>
      <h1>{t.nav.kids}</h1>
      <p className="sub">{t.kidsSub}</p>
      <div className="grid g3">
        {kids.map((k) => (
          <div className="card click" key={k.id} onClick={() => go('kid/' + k.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <h2 style={{ margin: 0 }}>{kname(k)}</h2>
              <span className="tag">{t.grade(k.grade)}</span>
            </div>
            <p className="small muted" style={{ margin: '8px 0' }}>
              {k.goals.map((g) => <span key={g}>• {t.GOALS[g]}<br /></span>)}
            </p>
            <div className="small muted">{t.recs(obs.filter((o) => o.kid === k.id).length)} · {t.nextMeet} {k.next}</div>
          </div>
        ))}
        <div className="card click" onClick={add}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 150, color: 'var(--brand)', fontWeight: 600 }}>
          {t.addKid}
        </div>
      </div>
    </>
  );
}
