import { imgUrl } from '../state/content.js';

// Схемы-подсказки, которые повторяются после многих заданий, показываем маленькими
const SMALL = new Set(['img/img29.png', 'img/img47.png', 'img/img39.png', 'img/img40.png', 'img/img48.png', 'img/img43.png']);

// Рендер блоков содержания: h — подзаголовок, p — текст, li — задание, note — подсказка взрослому, img — рисунок
export default function Blocks({ blocks }) {
  const out = [];
  let list = null;
  blocks.forEach((b, i) => {
    if (b.t === 'li') {
      if (!list) { list = []; out.push(<ol key={'ol' + i}>{list}</ol>); }
      list.push(<li key={i}>{b.text}</li>);
      return;
    }
    list = null;
    if (b.t === 'h') out.push(<h4 key={i}>{b.text}</h4>);
    else if (b.t === 'note') out.push(<div className="dnote" key={i}>{b.text}</div>);
    else if (b.t === 'img') out.push(
      <figure key={i} className={SMALL.has(b.src) ? 'mini' : ''}>
        <img src={imgUrl(b.src)} alt={b.alt || ''} loading="lazy" />
      </figure>
    );
    else out.push(<p key={i}>{b.text}</p>);
  });
  return <div className="doc">{out}</div>;
}
