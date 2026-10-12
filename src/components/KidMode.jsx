import { ChevronRight } from 'lucide-react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useStore } from '../state/store.jsx';
import { Face } from './Faces.jsx';
import { Chip, KCOL } from './ui.jsx';

// Полноэкранный режим для ребёнка: настроение, сила чувства, карточки, пауза.
// Выход — удержанием кнопки, чтобы ребёнок не закрыл режим случайно.

const KidCtx = createContext(() => {});
export const useOpenKid = () => useContext(KidCtx);

const SETS = { 2: ['joy', 'sad'], 4: ['joy', 'sad', 'anger', 'fear'], 6: ['joy', 'sad', 'anger', 'fear', 'calm', 'unk'] };
const TABS = ['mood', 'str', 'cards', 'pause'];

export function KidModeProvider({ children }) {
  const [state, setState] = useState({ open: false, tab: 'mood', card: null });
  const open = (tab = 'mood', card = null) => setState({ open: true, tab, card });
  return (
    <KidCtx.Provider value={open}>
      {children}
      {state.open && <KidMode initialTab={state.tab} initialCard={state.card} onClose={() => setState((s) => ({ ...s, open: false }))} />}
    </KidCtx.Provider>
  );
}

function KidMode({ initialTab, initialCard, onClose }) {
  const { t, toast } = useStore();
  const [tab, setTab] = useState(initialTab);
  const [count, setCount] = useState(2);
  const [mood, setMood] = useState(null);
  const [str, setStr] = useState(null);
  const [card, setCard] = useState(initialCard);

  return (
    <div className="kid open" role="dialog" aria-modal="true">
      <div className="kid-top">
        <div className="kid-tabs">
          {TABS.map((k, i) => <Chip key={k} on={tab === k} onClick={() => setTab(k)}>{t.kTabs[i]}</Chip>)}
          {tab === 'mood' && (
            <>
              <span className="small muted" style={{ margin: '0 6px 8px 8px', alignSelf: 'center' }}>{t.kCount}</span>
              {[2, 4, 6].map((c) => <Chip key={c} on={count === c} onClick={() => { setCount(c); setMood(null); }}>{c}</Chip>)}
            </>
          )}
        </div>
        <HoldToExit label={t.kExit} onExit={onClose} />
      </div>
      <div className="kid-body">
        {tab === 'mood' && (
          <>
            <div className="kid-q">{mood ? t.kChose + t.EMO[mood] : t.kQ}</div>
            <div className="faces" style={{ gridTemplateColumns: `repeat(${count === 6 ? 3 : 2}, auto)` }}>
              {SETS[count].map((e) => (
                <div key={e}>
                  <button className={'face' + (mood === e ? ' sel' : '')} onClick={() => setMood(e)} aria-label={t.EMO[e]}>
                    <Face id={e} size="min(26vw,150px)" />
                  </button>
                  <div className="face-l">{t.EMO[e]}</div>
                </div>
              ))}
            </div>
            <div className="muted">{t.kSkip}</div>
            {mood && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="btn lg" onClick={() => setTab('str')}>{t.kHow}<ChevronRight size={18} aria-hidden="true" /></button>
                <button className="btn lg ghost" onClick={() => setTab('cards')}>{t.kHelp}<ChevronRight size={18} aria-hidden="true" /></button>
              </div>
            )}
          </>
        )}

        {tab === 'str' && (() => {
          const e = mood && mood !== 'unk' ? mood : 'anger';
          return (
            <>
              <Face id={e} size={90} />
              <div className="kid-q">{t.kStrQ}</div>
              <div className="circles">
                {[70, 110, 160].map((sz, i) => (
                  <div key={i}>
                    <button className={str === i ? 'on' : ''} onClick={() => setStr(i)} aria-label={t.kStr[i]}
                      style={{ width: sz, height: sz, background: `var(--${e})`, opacity: 0.35 + i * 0.3 }} />
                    <div className="face-l">{t.kStr[i]}</div>
                  </div>
                ))}
              </div>
              <div className="big-cards" style={{ maxWidth: 480 }}>
                <button className="bigc" style={{ background: KCOL[1][0], color: KCOL[1][1] }} onClick={() => setTab('pause')}>{t.KCARDS[1][0]}</button>
                <button className="bigc" style={{ background: KCOL[2][0], color: KCOL[2][1] }} onClick={() => { setCard(2); setTab('cards'); }}>{t.KCARDS[2][0]}</button>
              </div>
            </>
          );
        })()}

        {tab === 'cards' && (
          <>
            <div className="kid-q">{card !== null ? t.KCARDS[card][0] : t.kNeed}</div>
            <div className="big-cards">
              {t.KCARDS.map((c, i) => (
                <button key={i} className={'bigc' + (card === i ? ' on' : '')} style={{ background: KCOL[i][0], color: KCOL[i][1] }}
                  onClick={() => { setCard(i); if (i === 1) setTab('pause'); }}>
                  {c[0]}<small>{c[1]}</small>
                </button>
              ))}
            </div>
            {card !== null && <div className="muted">{t.kSeen}</div>}
          </>
        )}

        {tab === 'pause' && <Pause onDone={() => { setTab('mood'); setMood(null); toast(t.kBack); }} />}
      </div>
    </div>
  );
}

function Pause({ onDone }) {
  const { t } = useStore();
  const [len, setLen] = useState(60);
  const [left, setLeft] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { setRunning(false); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const shown = left ?? len;
  const C = 2 * Math.PI * 42;
  const start = () => { setLeft(left && left > 0 ? left : len); setRunning(true); };

  return (
    <>
      <div className="kid-q">{t.kPauseQ}</div>
      <svg viewBox="0 0 100 100" style={{ width: 'min(60vw,260px)', height: 'min(60vw,260px)' }}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--brand-soft)" strokeWidth="9" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--calm)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - shown / len)} transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        <text x="50" y="56" textAnchor="middle" fontSize="17" fontWeight="700" fill="var(--ink)">
          {Math.floor(shown / 60)}:{String(shown % 60).padStart(2, '0')}
        </text>
      </svg>
      <div className="muted" style={{ fontSize: 18 }}>{t.kPause1}<br /><span className="small">{t.kPause2}</span></div>
      {!running && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[30, 60, 120].map((s) => (
            <Chip key={s} on={len === s} onClick={() => { setLen(s); setLeft(null); }}>{s < 60 ? `${s} ${t.sec}` : `${s / 60} ${t.min}`}</Chip>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12 }}>
        {running ? (
          <>
            <button className="btn lg plain" onClick={() => { setLeft((l) => l + 30); setLen((n) => Math.max(n, (left ?? 0) + 30)); }}>{t.kMore}</button>
            <button className="btn lg" onClick={() => { setRunning(false); setLeft(null); onDone(); }}>{t.kDone}</button>
          </>
        ) : (
          <button className="btn lg" onClick={start}>{left === 0 ? t.kAgain : t.kStart}</button>
        )}
      </div>
    </>
  );
}

function HoldToExit({ label, onExit }) {
  const [p, setP] = useState(0);
  const timer = useRef(null);
  const stop = () => { clearInterval(timer.current); timer.current = null; setP(0); };
  const start = (e) => {
    e.preventDefault();
    const t0 = Date.now();
    timer.current = setInterval(() => {
      const v = Math.min(1, (Date.now() - t0) / 900);
      setP(v);
      if (v >= 1) { stop(); onExit(); }
    }, 30);
  };
  useEffect(() => stop, []);
  return (
    <button className="btn plain hold" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onExit(); }}>
      <i style={{ width: p * 100 + '%' }} /><span>{label}</span>
    </button>
  );
}
