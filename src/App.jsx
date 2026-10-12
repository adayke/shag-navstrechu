import { useStore } from './state/store.jsx';
import { go, useRoute } from './state/router.js';
import { FaceSprites, Face } from './components/Faces.jsx';
import { KidModeProvider } from './components/KidMode.jsx';
import { Toast } from './components/ui.jsx';
import Today from './pages/Today.jsx';
import Lessons from './pages/Lessons.jsx';
import Lesson from './pages/Lesson.jsx';
import Run from './pages/Run.jsx';
import Kids from './pages/Kids.jsx';
import Kid from './pages/Kid.jsx';
import Observe from './pages/Observe.jsx';
import { Cards, About, Report } from './pages/Other.jsx';

const NAV = [
  ['today', '◎'], ['lessons', '▤'], ['kids', '☺'], ['observe', '✎'], ['cards', '▣'], ['about', 'ⓘ'],
];
// к какому пункту меню относятся вложенные страницы
const PARENT = { lesson: 'lessons', run: 'lessons', kid: 'kids', report: 'kids' };

function Page({ route }) {
  const { name, args, params } = route;
  switch (name) {
    case 'lessons': return <Lessons />;
    case 'lesson': return <Lesson key={args.join('/')} g={+args[0]} n={+args[1]} />;
    case 'run': return <Run key={args.join('/')} kidId={args[0]} g={+args[1]} n={+args[2]} />;
    case 'kids': return <Kids />;
    case 'kid': return <Kid id={args[0]} />;
    case 'observe': return <Observe key={JSON.stringify(params)} params={params} />;
    case 'cards': return <Cards />;
    case 'about': return <About />;
    case 'report': return <Report id={args[0]} />;
    default: return <Today />;
  }
}

export default function App() {
  const { t, lang, setLang } = useStore();
  const route = useRoute();
  const active = PARENT[route.name] || route.name;

  return (
    <KidModeProvider>
      <FaceSprites />
      <div className="app">
        <nav className="side">
          <div className="logo"><Face id="calm" size={30} />Шаг навстречу</div>
          <div className="lang">
            <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>RU</button>
            <button className={lang === 'kk' ? 'on' : ''} onClick={() => setLang('kk')}>ҚАЗ</button>
          </div>
          {NAV.map(([key, ic]) => (
            <button key={key} className={'nav-btn' + (active === key ? ' on' : '')} onClick={() => go(key)}>
              <span className="ic">{ic}</span>{t.nav[key]}
            </button>
          ))}
          <div className="side-foot">{t.foot}</div>
        </nav>
        <main><Page route={route} /></main>
      </div>
      <Toast />
    </KidModeProvider>
  );
}
