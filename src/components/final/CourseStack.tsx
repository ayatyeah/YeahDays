import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EVENT_COURSES } from '@/lib/events/courses';
import { Icon } from './Brand';
import s from './course-stack.module.css';

const stories: Record<string, { label: string; description: string; topics: string[]; idea: string; path: string[] }> = {
  'cloud-computing': {
    label: 'Cloud Comp', description: 'Find the right home for your data. Connect storage, security and costs to the decisions behind a working app.',
    topics: ['AWS & Azure', 'Storage', 'Shared responsibility'], idea: 'Give your ideas room to grow.', path: ['Your app', 'Cloud services', 'Room to scale'],
  },
  'computer-networks': {
    label: 'Comp Net', description: 'Follow a packet beyond your laptop. Make sense of the devices, addresses and protocols that keep everything connected.',
    topics: ['Routing', 'Protocols', 'Cisco practice'], idea: 'Every connection has a journey.', path: ['Your device', 'A gateway', 'Another network'],
  },
  'project-management': {
    label: 'Project Management', description: 'Turn an idea into a project you can actually deliver. Work through scope, dependencies and the next useful step.',
    topics: ['Planning', 'Agile & Scrum', 'Teamwork'], idea: 'Make the next step clear.', path: ['Set the scope', 'Build together', 'Review & adapt'],
  },
  'computer-vision': {
    label: 'Comp Vision', description: 'Look at what happens between an image and a prediction. Connect visual features, models and evaluation.',
    topics: ['Image features', 'Models', 'Evaluation'], idea: 'There is more to an image.', path: ['An image', 'Useful features', 'A prediction'],
  },
  'research-methods': {
    label: 'RMT', description: 'Ask a better question, choose a method and understand what the evidence can tell you. Work through research one decision at a time.',
    topics: ['Research design', 'Data collection', 'Evidence'], idea: 'Curiosity, with a method.', path: ['Your question', 'Your method', 'Your evidence'],
  },
};

export default function CourseStack() {
  return <ol className={s.stack} aria-label="Explore five courses">
    {EVENT_COURSES.map((course, index) => {
      const story = stories[course.id];
      return <li className={s.card} data-course={course.id} key={course.id} style={{ '--stack-index': index } as CSSProperties}>
        <div className={s.cardHeader}><span><Image src={course.logo} alt="" width={30} height={30}/>{story.label}</span><span>0{index + 1}<span className={s.total}> / 0{EVENT_COURSES.length}</span></span></div>
        <div className={s.body}>
          <div className={s.copy}>
            <h3 className={s.title}>{course.title}</h3>
            <p className={s.description}>{story.description}</p>
            <ul className={s.topics} aria-label={`${course.title} topics`}>{story.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
            <Link href={`/events/courses/${course.id}`} className="f-button">Explore {story.label}<Icon name="arrow" size={19}/></Link>
          </div>
          <div className={s.visual} aria-hidden="true">
            <div className={s.visualHeading}><span>Your next discovery</span><Image src={course.logo} alt="" width={52} height={52}/></div>
            <p className={s.idea}>{story.idea}</p>
            <div className={s.path}>{story.path.map((step, i) => <div key={step}><span>{step}</span>{i < story.path.length - 1 && <Icon name="arrow" size={18}/>}</div>)}</div>
            <span className={s.eventCount}>{course.eventIds.length} study {course.eventIds.length === 1 ? 'event' : 'events'} ready to explore</span>
          </div>
        </div>
      </li>;
    })}
  </ol>;
}
