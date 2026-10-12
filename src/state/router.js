import { useEffect, useState } from 'react';

// Простой hash-роутер: #/lesson/1/13, #/kid/a, #/observe?kid=a&lesson=13
// Hash-ссылки работают на GitHub Pages без настройки сервера.

export function parseHash(hash = window.location.hash) {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const parts = path.split('/').filter(Boolean);
  const params = Object.fromEntries(new URLSearchParams(query));
  return { name: parts[0] || 'today', args: parts.slice(1), params };
}

export function go(path) {
  window.location.hash = '#/' + path;
  window.scrollTo(0, 0);
}

export function useRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const on = () => setRoute(parseHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
