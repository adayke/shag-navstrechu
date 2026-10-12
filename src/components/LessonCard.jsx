import { Smile, BookOpen, Palette, Music, Leaf, ArrowUpRight, Clock } from 'lucide-react';
import { useStore } from '../state/store.jsx';
import { go } from '../state/router.js';

// Иконка и цвет по направлению (5 блоков программы одинаковы для всех классов)
export const BLOCK_ICONS = [Smile, BookOpen, Palette, Music, Leaf];

export function blockIndex(blocksOf, g, block) {
  return Math.max(0, blocksOf(g).indexOf(block));
}

export default function LessonCard({ g, l, hotFor }) {
  const { t, blocksOf } = useStore();
  const bi = blockIndex(blocksOf, g, l.block);
  const Icon = BLOCK_ICONS[bi];
  return (
    <div className={`glow click course b${bi + 1}${hotFor ? ' hot' : ''}`} onClick={() => go(`lesson/${g}/${l.n}`)}
      role="link" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && go(`lesson/${g}/${l.n}`)}>
      <div className="course-top">
        <span className="tile"><Icon size={22} aria-hidden="true" /></span>
        <div className="badges">
          {hotFor && <span className="badge" style={{ color: 'var(--ink)' }}>{t.nextFor} {hotFor}</span>}
          <span className="badge">{t.grade(g)}</span>
          <span className="badge"><Clock size={12} aria-hidden="true" />{t.min30}</span>
        </div>
      </div>
      <h2>{t.lessonNo(l.n)} · {l.title}<ArrowUpRight size={16} className="arr" aria-hidden="true" /></h2>
      <p>{l.goal}</p>
    </div>
  );
}
