import { useEffect, useState } from 'react';

// Полное содержание пособия (задания тетрадей, сценарии, приложения) грузится отдельно,
// чтобы первая страница открывалась быстро. Если перевода нет — показываем русский.
const cache = {};
const loaders = {
  ru: () => import('../data/content.ru.json'),
  kk: () => import('../data/content.kk.json'),
};

function load(lang) {
  if (!cache[lang]) {
    cache[lang] = (loaders[lang] || loaders.ru)()
      .then((m) => m.default)
      .catch(() => loaders.ru().then((m) => m.default));
  }
  return cache[lang];
}

export function useContent(lang) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    setData(null);
    load(lang).then((d) => alive && setData(d));
    return () => { alive = false; };
  }, [lang]);
  return data;
}

// Картинки лежат в public/img; путь относительный, чтобы работало на GitHub Pages
export const imgUrl = (src) => import.meta.env.BASE_URL + src;
