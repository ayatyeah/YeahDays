import {describe,it,expect} from 'vitest';
import {newStudyData,setStudyMode,studySnapshot,feedbackEvents} from './studyWorkspace';
import {taskAction,DAY} from './research';
describe('personal study workspace',()=>{
 it('requires explicit AI consent and removes it on standard mode',()=>{const d=newStudyData();expect(d.aiConsent).toBe(false);expect(()=>setStudyMode(d,'ai',false,1000)).toThrow('consent_required');setStudyMode(d,'ai',true,1000);expect(d.aiConsentAt).toBe(new Date(1000).toISOString());setStudyMode(d,'fixed',false,2000);expect(d.aiConsentAt).toBeNull();});
 it('awards each completion once and locks future weeks',()=>{const d=newStudyData();const start=new Date('2026-11-06T00:00:00Z');const at=+start+1000;taskAction(d,start,'start','w1-plan',at);taskAction(d,start,'complete','w1-plan',at+1000);taskAction(d,start,'complete','w1-plan',at+2000);expect(studySnapshot(start,d,at+2000).points).toBe(10);expect(()=>taskAction(d,start,'start','w2-plan',at)).toThrow();expect(()=>taskAction(d,start,'start','w2-plan',at+7*DAY)).not.toThrow();});
 it('only sends a bounded allowlist of activity fields',()=>{const d=newStudyData();d.interview={answers:['private'],ratings:[],at:''};d.events=Array.from({length:90},()=>({event_type:'task_start',event_timestamp:'now',task_id:'w1-plan',private:'secret'}));const events=feedbackEvents(d);expect(events).toHaveLength(80);expect(Object.keys(events[0])).toEqual(['event_type','event_timestamp','task_id']);expect(JSON.stringify(events)).not.toContain('private');});
});
