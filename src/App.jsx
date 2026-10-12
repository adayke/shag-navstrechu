import { useEffect, useState } from 'react';
import { House, BookOpen, Library, Users, PenLine, Languages, Sun, Moon, Smile, Footprints } from 'lucide-react';
import { useStore } from './state/store.jsx';
import { go, useRoute } from './state/router.js';
import { FaceSprites } from './components/Faces.jsx';
import { KidModeProvider, useOpenKid } from './components/KidMode.jsx';
import { Toast } from './components/ui.jsx';
import Today from './pages/Today.jsx';
import Lessons from './pages/Lessons.jsx';
import Lesson from './pages/Lesson.jsx';
import Run from './pages/Run.jsx';
import Kids from './pages/Kids.jsx';
import Kid from './pages/Kid.jsx';
import Observe from './pages/Observe.jsx';
import Materials, { DocPage } from './pages/Materials.jsx';
import { Cards, About, Report } from './pages/Other.jsx';

const NAV = [
  ['today', House], ['lessons', BookOpen], ['materials', Library], ['kids', Users], ['observe', PenLine],
];
// к какому пункту меню относятся вложенные страницы
const PARENT = { lesson: 'lessons', run: 'lessons', kid: 'kids', report: 'kids', doc: 'materials', cards: 'materials', about: 'materials' };

function Page({ route }) {
  const { name, args, params } = route;
  switch (name) {
    case 'lessons': return <Lessons />;
    case 'lesson': return <Lesson key={args.join('/')} g={+args[0]} n={+args[1]} />;
    case 'run': return <Run key={args.join('/')} kidId={args[0]} g={+args[1]} n={+args[2]} />;
    case 'materials': return <Materials />;
    case 'doc': return <DocPage key={args.join('/')} kind={args[0]} id={args[1]} />;
    case 'kids': return <Kids />;
    case 'kid': return <Kid id={args[0]} />;
    case 'observe': return <Observe key={JSON.stringify(params)} params={params} />;
    case 'cards': return <Cards />;
    case 'about': return <About />;
    case 'report': return <Report id={args[0]} />;
    default: return <Today />;
  }
}

function LangSwitch() {
  const { t, lang, setLang } = useStore();
  return (
    <div className="lang" role="group" aria-label={t.lang}>
      <Languages size={15} className="lang-ic" aria-hidden="true" />
      <button className={lang === 'ru' ? 'on' : ''} onClick={() => setLang('ru')}>{t.langRu}</button>
      <button className={lang === 'kk' ? 'on' : ''} onClick={() => setLang('kk')}>{t.langKk}</button>
    </div>
  );
}

// Тема: по умолчанию тёмная, выбор запоминается
function useTheme() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('shag-theme') || 'dark'; } catch { return 'dark'; } });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('shag-theme', theme); } catch { /* ignore */ }
  }, [theme]);
  return [theme, () => setTheme((x) => (x === 'dark' ? 'light' : 'dark'))];
}

function Shell() {
  const { t } = useStore();
  const route = useRoute();
  const openKid = useOpenKid();
  const [theme, toggleTheme] = useTheme();
  const active = PARENT[route.name] || route.name;

  return (
    <>
      <FaceSprites />
      <header className="topbar">
        <div className="wrap">
          <button className="brand" onClick={() => go('today')}><span className="logo-mark"><Footprints size={17} strokeWidth={2.2} aria-hidden="true" /></span>Шаг навстречу</button>
          <nav className="toplinks">
            {NAV.map(([key]) => (
              <button key={key} className={'toplink' + (active === key ? ' on' : '')} onClick={() => go(key)}>{t.nav[key]}</button>
            ))}
          </nav>
          <div className="top-right">
            <LangSwitch />
            <button className="icon-btn" onClick={toggleTheme} title={theme === 'dark' ? t.themeLight : t.themeDark} aria-label={theme === 'dark' ? t.themeLight : t.themeDark}>
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="pill" onClick={() => openKid()}><Smile size={16} aria-hidden="true" />{t.kidMode}</button>
          </div>
        </div>
      </header>
      <main className="wrap"><Page route={route} /></main>
      <nav className="tabbar">
        {NAV.map(([key, Icon]) => (
          <button key={key} className={'tab' + (active === key ? ' on' : '')} onClick={() => go(key)} aria-current={active === key ? 'page' : undefined}>
            <Icon size={20} strokeWidth={2} aria-hidden="true" />
            <span>{t.navShort[key]}</span>
          </button>
        ))}
      </nav>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <KidModeProvider>
      <Shell />
    </KidModeProvider>
  );
}
