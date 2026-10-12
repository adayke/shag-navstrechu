import { useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import { useStore } from '../state/store.jsx';
import LessonCard, { blockIndex } from '../components/LessonCard.jsx';

// Каталог занятий: фильтры слева (класс, направление), поиск и сортировка сверху, карточки сеткой
export default function Lessons() {
  const { t, kids, lessonsOf, blocksOf, kname } = useStore();
  const [grades, setGrades] = useState([1]);
  const [btypes, setBtypes] = useState([]);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('order');
  const [open, setOpen] = useState(false);

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const query = q.trim().toLowerCase();
  const useGrades = grades.length ? grades : [1, 2, 3, 4];

  let items = useGrades.flatMap((g) => lessonsOf(g).map((l) => ({ g, l, bi: blockIndex(blocksOf, g, l.block) })))
    .filter(({ l, bi }) => (!btypes.length || btypes.includes(bi)) &&
      (!query || (l.title + ' ' + l.goal + ' ' + l.result + ' ' + l.block).toLowerCase().includes(query)));
  if (sort === 'az') items = [...items].sort((a, b) => a.l.title.localeCompare(b.l.title));

  // какие занятия у детей следующие — подсвечиваем
  const hot = {};
  kids.forEach((k) => { hot[`${k.grade}/${k.next}`] = hot[`${k.grade}/${k.next}`] || kname(k); });

  const countFor = (bi) => useGrades.reduce((s, g) => s + lessonsOf(g).filter((l) => blockIndex(blocksOf, g, l.block) === bi).length, 0);

  return (
    <>
      <h1>{t.nav.lessons}</h1>
      <p className="sub">{t.lessonsSub}</p>
      <div className="catalog">
        <aside className={'filters' + (open ? ' open' : '')}>
          <div className="filters-head">
            <b><SlidersHorizontal size={16} aria-hidden="true" />{t.filters}</b>
            <button className="linkbtn" onClick={() => { setGrades([]); setBtypes([]); setQ(''); }}>{t.clearAll}</button>
          </div>
          <div className="fgroup">
            <div className="fgroup-t">{t.fGrade}</div>
            {[1, 2, 3, 4].map((g) => (
              <label className="check" key={g}>
                <input type="checkbox" checked={grades.includes(g)} onChange={() => toggle(grades, setGrades, g)} />
                {t.grade(g)}<span className="cnt">34</span>
              </label>
            ))}
          </div>
          <div className="fgroup">
            <div className="fgroup-t">{t.fBlock}</div>
            {t.btypes.map((name, bi) => (
              <label className={`check b${bi + 1}`} key={bi}>
                <input type="checkbox" checked={btypes.includes(bi)} onChange={() => toggle(btypes, setBtypes, bi)} />
                <span className="dot" />{name}<span className="cnt">{countFor(bi)}</span>
              </label>
            ))}
          </div>
        </aside>

        <section>
          <div className="searchrow">
            <label className="search">
              <Search size={17} aria-hidden="true" />
              <input type="search" placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t.search} />
            </label>
            <button className="btn ghost mfilter" onClick={() => setOpen((o) => !o)}><SlidersHorizontal size={16} aria-hidden="true" />{t.filters}</button>
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="sort">
              <option value="order">{t.sortOrder}</option>
              <option value="az">{t.sortAz}</option>
            </select>
          </div>
          <div className="found">{t.found(items.length)}</div>
          {items.length === 0 && <div className="empty">{t.nothing}</div>}
          <div className="grid g3">
            {items.map(({ g, l }) => <LessonCard key={g + '-' + l.n} g={g} l={l} hotFor={hot[`${g}/${l.n}`]} />)}
          </div>
        </section>
      </div>
    </>
  );
}
