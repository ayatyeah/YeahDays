'use client';
import { useState } from 'react';
import { Icon } from './Brand';
const examples = [
  { course: 'RMT', title: 'Choose the right research method', goal: 'Understand qualitative and quantitative research', exercise: 'Write one interview question and one survey question about how students choose a study app.', note: 'Compare the kind of answer each question would give you.' },
  { course: 'Cloud Comp', title: 'Find a home for your data', goal: 'Understand storage choices in the cloud', exercise: 'A student app stores profile photos and course enrolments. Choose storage for each and explain one trade-off.', note: 'Think about objects, relationships and how you will read the data.' },
  { course: 'Comp Net', title: 'Follow a packet’s journey', goal: 'Understand how devices communicate', exercise: 'Sketch the route from your laptop to a website. Label where DNS, a switch and a router help.', note: 'Explain what each device or service contributes.' },
];
export default function StudyPreview() {
  const [index, setIndex] = useState(0);
  const example = examples[index];
  return <div className="g-preview-scene"><div className="g-preview-sheet g-preview-sheet-back" aria-hidden="true"/><div className="g-preview-sheet g-preview-sheet-middle" aria-hidden="true"/><div className="g-preview"><div className="g-preview-header"><span><span className="g-live-dot"/>Your study desk</span><span>Example plan</span></div><div className="g-preview-tabs" role="group" aria-label="Preview a course">{examples.map((item, i) => <button key={item.course} type="button" onClick={() => setIndex(i)} aria-pressed={index === i}>{item.course}</button>)}</div><div className="g-preview-content" key={index} aria-live="polite"><div className="g-preview-goal"><Icon name="plan" size={21}/><span>{example.goal}</span></div><div className="g-preview-divider"><span>Up next</span><span><Icon name="clock" size={14}/>15 min</span></div><h2>{example.title}</h2><p>{example.exercise}</p><div className="g-preview-hint"><Icon name="spark" size={16}/><p>{example.note}</p></div></div><div className="g-preview-bottom"><span><Icon name="check" size={16}/>One task at a time</span><div aria-label="Three stages"><i className="active"/><i/><i/></div></div></div><div className="g-preview-sticker"><span><Icon name="progress" size={20}/></span><div><strong>Small steps add up.</strong><small>Your effort, made visible.</small></div></div></div>;
}
