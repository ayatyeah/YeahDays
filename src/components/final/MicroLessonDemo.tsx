'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './micro-landing.module.css';
export default function MicroLessonDemo() {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  return <section id="try-lesson" className={styles.demo} aria-labelledby="demo-heading">
    <div><span className={styles.kicker}>TRY A SMALL LESSON</span><h2 id="demo-heading">S3 or a database?</h2><p>Cloud Computing · About 5 minutes</p><p>One everyday example. One decision. Something you can explain.</p><ol className={styles.demoSteps}>{['Understand', 'Practise', 'Remember'].map((label,index) => <li key={label} aria-current={step === index ? 'step' : undefined}><span>{index+1}</span>{label}</li>)}</ol></div>
    <div className={styles.demoPaper} aria-live="polite">
      {step === 0 && <><p className={styles.kicker}>01 / UNDERSTAND</p><h3>Different data. Different homes.</h3><p>A shop has product photos and customer orders. Photos are files: object storage such as Amazon S3 gives each file a key so the app can retrieve it.</p><p>Orders connect customers, products and payments. A relational database such as PostgreSQL on Amazon RDS can keep those relationships and update them in transactions.</p><aside><strong>The question to ask:</strong> Do I need to retrieve a file, or work with connected records?</aside><button className={styles.primary} onClick={() => setStep(1)}>Try one question</button></>}
      {step === 1 && <><p className={styles.kicker}>02 / PRACTISE</p><h3>Where would you store product photos?</h3><div className={styles.answers}>{['Amazon S3: objects retrieved by key', 'Amazon RDS: related records and transactions', 'Amazon SQS: messages waiting for processing'].map((label,index) => <button key={label} disabled={answer !== null} aria-pressed={answer === index} data-correct={answer !== null && index === 0 ? 'true' : undefined} data-wrong={answer === index && index !== 0 ? 'true' : undefined} onClick={() => setAnswer(index)}>{label}</button>)}</div><div className={styles.feedback} role="status">{answer === null ? 'Choose an answer. Then see why it fits.' : <><strong>{answer === 0 ? 'Exactly.' : 'S3 fits this task.'}</strong><p>S3 stores each photo as an object. RDS is useful for the connected order records. SQS holds work messages, such as a request to resize a photo.</p></>}</div><button className={styles.primary} disabled={answer === null} onClick={() => setStep(2)}>Make it stick</button></>}
      {step === 2 && <><p className={styles.kicker}>03 / REMEMBER</p><h3>Explain it your way.</h3><label className={styles.reflection}>Why would a shop use both S3 and a relational database?<textarea rows={3} maxLength={500} value={reflection} onChange={event => setReflection(event.target.value)} placeholder="S3 would hold… The database would hold…"/></label><details><summary>Compare with an example</summary><p>S3 holds the photo files. The database links products, customers and orders. The app can store a photo’s S3 key in a product record.</p></details><p>Come back later and try explaining this without the example.</p><div className={styles.actions}><Link className={styles.primary} href="/events/courses/cloud-computing">Continue with Cloud Computing</Link><button className={styles.secondary} onClick={() => { setStep(0); setAnswer(null); setReflection(''); }}>Try again</button></div></>}
      <small>This preview stays in this page and does not change your account progress.</small>
    </div>
  </section>;
}
