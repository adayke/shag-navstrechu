import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ru from '../i18n/ru.js';
import kk from '../i18n/kk.js';
import lessonsRu from '../data/lessons.ru.json';
import lessonsKk from '../data/lessons.kk.json';
import { demoState } from '../data/demo.js';

const DICT = { ru, kk };
const LESSONS = { ru: lessonsRu, kk: lessonsKk };
const DATA_KEY = 'shag-app-v1';
const LANG_KEY = 'shag-lang';

// localStorage может быть недоступен (приватный режим, превью) — тогда работаем в памяти
function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [lang, setLang] = useState(() => (load(LANG_KEY) === 'kk' ? 'kk' : 'ru'));
  const [data, setData] = useState(() => {
    const saved = load(DATA_KEY);
    return saved && Array.isArray(saved.kids) ? saved : demoState();
  });
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => store(DATA_KEY, data), [data]);
  useEffect(() => {
    store(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 1800);
  }, []);

  const value = useMemo(() => {
    const t = DICT[lang];
    const lessons = LESSONS[lang];
    return {
      lang, setLang, t, toast, toastMsg,
      kids: data.kids,
      obs: data.obs,
      lessonOf: (g, n) => lessons[g][n - 1],
      lessonsOf: (g) => lessons[g],
      blocksOf: (g) => [...new Set(lessons[g].map((l) => l.block))],
      kidBy: (id) => data.kids.find((k) => k.id === id),
      kname: (k) => (k ? `${t.child} ${k.letter}.` : ''),
      tx: (v) => (v && typeof v === 'object' ? v[lang] || v.ru : v),
      fmtDate: (d) => {
        try { return new Date(d + 'T00:00').toLocaleDateString(t.locale, { day: 'numeric', month: 'short' }); } catch { return d; }
      },
      updateKid: (id, patch) => setData((s) => ({ ...s, kids: s.kids.map((k) => (k.id === id ? { ...k, ...patch } : k)) })),
      addKid: (kid) => setData((s) => ({ ...s, kids: [...s.kids, kid] })),
      addObs: (o) => setData((s) => ({ ...s, obs: [...s.obs, o] })),
      reset: () => setData(demoState()),
    };
  }, [lang, data, toast, toastMsg]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

export const today = () => new Date().toISOString().slice(0, 10);
