import { useState } from 'react';
import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';
import { Chip } from '../components/ui.jsx';

export default function Lessons() {
  const { t, lessonsOf, blocksOf } = useStore();
  const [grade, setGrade] = useState(1);
  const [block, setBlock] = useState(-1);
  const [q, setQ] = useState('');

  const blocks = blocksOf(grade);
  const query = q.trim().toLowerCase();
  const items = lessonsOf(grade).filter((l) =>
    (block === -1 || l.block === blocks[block]) &&
    (!query || (l.title + ' ' + l.goal + ' ' + l.result).toLowerCase().includes(query)));

  let cur = '';
  return (
    <>
      <h1>{t.nav.lessons}</h1>
      <p className="sub">{t.lessonsSub}</p>
      <div className="toolbar">
        <div>{[1, 2, 3, 4].map((g) => <Chip key={g} on={grade === g} onClick={() => { setGrade(g); setBlock(-1); }}>{t.grade(g)}</Chip>)}</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input type="search" placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <Chip on={block === -1} onClick={() => setBlock(-1)}>{t.allBlocks}</Chip>
        {blocks.map((b, i) => <Chip key={b} on={block === i} onClick={() => setBlock(i)}>{b}</Chip>)}
      </div>
      <div className="list">
        {items.length === 0 && <div className="empty">{t.nothing}</div>}
        {items.map((l) => {
          const header = l.block !== cur ? (cur = l.block) : null;
          return (
            <div key={l.n}>
              {header && <div className="block-h">{header}</div>}
              <div className="row" onClick={() => go(`lesson/${grade}/${l.n}`)}>
                <div className="n">{l.n}</div>
                <div className="t"><b>{l.title}</b><span className="small muted">{l.goal}</span></div>
                <span className="muted">›</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
