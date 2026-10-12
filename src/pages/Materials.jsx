import { FileText, Clapperboard, Theater, Mountain, Images, BookMarked, NotebookPen, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { useStore } from '../state/store.jsx';
import { useContent, imgUrl } from '../state/content.js';
import { go } from '../state/router.js';
import Blocks from '../components/Blocks.jsx';
import { Back } from '../components/ui.jsx';

// Плитка-ссылка в стиле каталога
function Tile({ to, icon: Icon, color, title, desc, cover, badge }) {
  return (
    <div className={`glow click course ${color}`} onClick={() => go(to)} role="link" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && go(to)}>
      <div className="course-top">
        <span className="tile"><Icon size={22} aria-hidden="true" /></span>
        {badge && <div className="badges"><span className="badge">{badge}</span></div>}
      </div>
      {cover && <img src={imgUrl(cover)} alt="" loading="lazy" style={{ marginTop: 16, height: 120, objectFit: 'contain', borderRadius: 12, background: '#fff', width: '100%' }} />}
      <h2>{title}<ArrowUpRight size={16} className="arr" aria-hidden="true" /></h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}

const firstImg = (blocks) => blocks?.find((b) => b.t === 'img')?.src;

export default function Materials() {
  const { t, lang } = useStore();
  const c = useContent(lang);
  return (
    <>
      <h1>{t.materials}</h1>
      <p className="sub">{t.matSub}</p>
      {!c ? <div className="empty">{t.loading}</div> : (
        <>
          <div className="grid g3">
            <Tile to="doc/program/0" icon={FileText} color="b2" title={t.matProgram} desc={t.matProgramD} />
            <Tile to="doc/masterclass/0" icon={Theater} color="b3" title={t.matMaster} desc={t.matMasterD} />
            <Tile to="doc/fairytale/0" icon={Mountain} color="b1" title={t.matTale} desc={t.matTaleD} />
          </div>

          <h3>{t.matScen}</h3>
          <div className="grid g4">
            {c.scenarios.map((s, i) => <Tile key={s.id} to={`doc/scenario/${i}`} icon={Clapperboard} color={`b${(i % 5) + 1}`} title={s.title} badge={t.min30} />)}
          </div>

          <h3>{t.matApp}</h3>
          <div className="grid g4">
            {c.appendices.map((a, i) => <Tile key={a.id} to={`doc/appendix/${i}`} icon={Images} color={`b${(i % 5) + 1}`} title={a.title} cover={firstImg(a.blocks)} />)}
          </div>

          <h3>{t.matWorkbooks}</h3>
          <div className="grid g4">
            {['1', '2', '3', '4'].map((g, i) => (
              <Tile key={g} to={`doc/intro/${g}`} icon={NotebookPen} color={`b${i + 1}`} title={`${t.matIntro} · ${t.grade(g)}`} cover={firstImg(c.grades[g].intro)} />
            ))}
          </div>

          <h3>{t.matExtra}</h3>
          <div className="grid g4">
            {c.extras.map((e, i) => <Tile key={e.id} to={`doc/extra/${i}`} icon={BookMarked} color={`b${(i % 5) + 1}`} title={e.title} />)}
            <Tile to="cards" icon={LayoutGrid} color="b5" title={t.nav.cards} desc={t.cardsSub} />
          </div>
        </>
      )}
    </>
  );
}

// Страница одного материала: программа, сценарий, мастер-класс, сказка, приложение, введение тетради, доп. раздел
export function DocPage({ kind, id }) {
  const { t, lang } = useStore();
  const c = useContent(lang);
  if (!c) return <div className="empty">{t.loading}</div>;
  const doc = {
    program: c.program,
    masterclass: c.masterclass,
    fairytale: c.fairytale,
    scenario: c.scenarios[+id],
    appendix: c.appendices[+id],
    extra: c.extras[+id],
    intro: c.grades[id] && { title: `${t.matIntro} · ${t.grade(id)}`, blocks: c.grades[id].intro },
  }[kind];
  if (!doc) return <Back to="materials">{t.materials}</Back>;
  return (
    <div style={{ maxWidth: 900 }}>
      <Back to="materials">{t.materials}</Back>
      <h1>{doc.title}</h1>
      <div style={{ height: 14 }} />
      <Blocks blocks={doc.blocks} />
    </div>
  );
}
