'use client';
import { useState } from 'react';
import { translateSelection } from '@/lib/selectionTranslation';
import { Icon } from '@/components/final/Brand';
export default function NotesToolbar({ lang, onLang, showLanguage = true }: { lang: 'en' | 'ru'; onLang: (value: 'en' | 'ru') => void; showLanguage?: boolean }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [direction, setDirection] = useState<'en' | 'ru'>('en');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function translate(event: React.FormEvent) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(''); setResult('');
    try { setResult(await translateSelection(text, direction)); }
    catch (e) { setError(e instanceof Error && e.name !== 'TypeError' && e.name !== 'TimeoutError' ? e.message : 'Translation is unavailable. Check your connection and try again.'); }
    finally { setBusy(false); }
  }
  return <div className="g-notes-tools" data-no-i18n>
    <div className="g-notes-toolbar">{showLanguage && <div className="g-language-options" role="group" aria-label="Notes language"><button type="button" aria-pressed={lang === 'en'} onClick={() => onLang('en')}>English</button><button type="button" aria-pressed={lang === 'ru'} onClick={() => onLang('ru')}>Русский</button></div>}<span>Select text to translate it</span><button type="button" className="g-translator-toggle" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name="book" size={18}/>Translator</button></div>
    {open && <form className="g-translator" onSubmit={translate}><div><h2>Understand it another way.</h2><button type="button" aria-label="Close translator" onClick={() => setOpen(false)}>×</button></div><label>Translation direction<select name="translation-direction" value={direction} onChange={e => { setDirection(e.target.value as 'en' | 'ru'); setResult(''); }}><option value="en">English → Russian</option><option value="ru">Russian → English</option></select></label><label>A word or short phrase<textarea name="translation-text" value={text} onChange={e => setText(e.target.value)} maxLength={500} rows={3} required placeholder="Paste a phrase from your notes…"/></label><p>Text is sent to MyMemory only when you translate. Up to 500 UTF-8 bytes per request.</p><button type="submit" className="f-button" disabled={busy}>{busy ? 'Translating…' : 'Translate text'}</button>{error && <p role="alert" className="g-translation-error">{error}</p>}{result && <div className="g-translation-result" role="status" lang={direction === 'en' ? 'ru' : 'en'}>{result}</div>}</form>}
  </div>;
}
