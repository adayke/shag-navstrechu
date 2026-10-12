import { Plus, ChevronRight } from 'lucide-react';
import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';
import { uid } from '../data/demo.js';
import { Avatar } from '../components/ui.jsx';

export default function Kids() {
  const { t, kids, obs, kname, addKid, toast } = useStore();

  const add = () => {
    const kid = { id: uid(), name: t.newKid, age: 7, grade: 1, goals: [0, 1], next: 1, adapt: [] };
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
            <div className="kid-head">
              <Avatar kid={k} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ margin: 0 }}>{kname(k)}</h2>
                <div className="small muted">{t.grade(k.grade)}{k.age ? ' · ' + t.age(k.age) : ''}</div>
              </div>
              <ChevronRight size={18} className="chev" aria-hidden="true" />
            </div>
            {k.adapt?.length > 0 && (
              <div className="tags">{k.adapt.map((a) => <span className="tag acc" key={a}>{t.ADAPT[a][0]}</span>)}</div>
            )}
            <p className="small muted" style={{ margin: '8px 0' }}>
              {k.goals.map((g) => <span key={g}>• {t.GOALS[g]}<br /></span>)}
            </p>
            <div className="small muted">{t.recs(obs.filter((o) => o.kid === k.id).length)} · {t.nextMeet} {k.next}</div>
          </div>
        ))}
        <div className="card click" onClick={add}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 150, color: 'var(--brand)', fontWeight: 600 }}>
          <Plus size={18} aria-hidden="true" style={{ marginRight: 6 }} />{t.addKid}
        </div>
      </div>
      <p className="small muted" style={{ marginTop: 14 }}>{t.demoNote}</p>
    </>
  );
}
