'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './Brand';
const pages = [
  { label: 'Read', title: 'Make room for a new idea.', text: 'Start with a clear explanation. Give the difficult part a little more time.', left: 'Understand', leftText: 'Read a little, at your own pace.', right: 'Make it yours', rightText: 'Translate a phrase. Ask a question.' },
  { label: 'Practise', title: 'Turn understanding into practice.', text: 'Try a question, check the explanation and revisit what needs another look.', left: 'Try it', leftText: 'Put your understanding to the test.', right: 'Learn from it', rightText: 'Use feedback to find the next step.' },
  { label: 'Reflect', title: 'Keep what becomes clearer.', text: 'A small reflection helps you return to an idea without starting from scratch.', left: 'Look back', leftText: 'What did you understand today?', right: 'Look ahead', rightText: 'What would you like to try next?' },
];
export default function PrimeNotebook({ layered = false, compact = false }: { layered?: boolean; compact?: boolean }) {
  const [active, setActive] = useState(0);
  const page = pages[active];
  return <div className={`p-notebook-scene${layered ? ' is-layered' : ''}${compact ? ' is-compact' : ''}`}>
    {layered && <div className="p-book-covers" aria-hidden="true"><div className="p-cover p-cover-plan"><Icon name="plan" size={25}/><span>Your plan</span><i/></div><div className="p-cover p-cover-practice"><Icon name="check" size={25}/><span>Practice</span><i/></div></div>}
    <div className="p-notebook"><div className="p-notebook-paper"><div className="p-book-header"><span><Icon name="book" size={26}/>{compact ? 'Your learning notebook' : 'Your notebook'}</span><div className="p-book-tabs" role="group" aria-label="Try a learning preview">{pages.map((item,i) => <button type="button" key={item.label} aria-pressed={active === i} onClick={() => setActive(i)}>{item.label}</button>)}</div></div><div className="p-book-page" key={active}><h2>{page.title}</h2><p>{page.text}</p><div className="p-book-spread"><div><Icon name={active === 1 ? 'check' : 'book'} size={23}/><h3>{page.left}</h3><p>{page.leftText}</p></div><div><Icon name={active === 2 ? 'arrow' : 'spark'} size={23}/><h3>{page.right}</h3><p>{page.rightText}</p></div></div></div>{!compact && <Link className="f-button" href="/register">Start learning <Icon name="arrow" size={18}/></Link>}</div><span className="p-bookmark" aria-hidden="true"/></div>
  </div>;
}
