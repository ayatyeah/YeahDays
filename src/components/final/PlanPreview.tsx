'use client';
import { useState } from 'react';
import { Icon } from './Brand';
export default function PlanPreview() {
  const [personal, setPersonal] = useState(true);
  return <div className="f-plan-preview" data-no-i18n>
    <div className="f-preview-top"><span><Icon name="plan" size={19}/> A task with a purpose</span><span className="f-pill">Example</span></div>
    <div className="f-segment" aria-label="Compare example plans"><button aria-pressed={!personal} onClick={() => setPersonal(false)}>Standard</button><button aria-pressed={personal} onClick={() => setPersonal(true)}><Icon name="spark" size={15}/> Personalized</button></div>
    <div className="f-preview-context"><span>Learning goal</span><strong>Understand database joins</strong><span>What feels difficult</span><strong>Knowing how two tables connect</strong></div>
    <div className="f-preview-task" aria-live="polite"><span className="f-task-category"><Icon name="book" size={17}/> Plan</span><h3>{personal ? 'Find the link between two tables.' : 'Make a three-step study plan.'}</h3><p>{personal ? 'Sketch a Students table and an Enrolments table. Identify the primary key in each, then circle the field that connects them.' : 'Choose a small learning activity. Write three steps and estimate how much time each will take.'}</p><div className="f-preview-reward"><span><Icon name="clock" size={16}/> 5 minutes</span><strong>+10 XP</strong></div></div>
    <p className="f-preview-caption">{personal ? 'The exercise changes with your context.' : 'You choose the subject-specific exercise.'} The reward stays the same.</p>
  </div>;
}
