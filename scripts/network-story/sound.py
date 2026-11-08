import json,wave,sys
out=sys.argv[1] if len(sys.argv)>1 else "output/network-story-v2"
import numpy as np
s=json.load(open(out+'/timeline.json'));sr=44100;t=np.arange(int((s['duration']+.1)*sr))/sr
# Quiet original underscore and event cues; no external music or extra API spend.
a=np.zeros_like(t)
for start,notes in [(0,[110,164.81,220]),(20,[103.83,155.56,207.65]),(40,[130.81,196,261.63]),(60,[146.83,220,293.66]),(80,[130.81,196,261.63])]:
 env=np.clip((t-start)/2,0,1)*np.clip((start+23-t)/3,0,1)
 for f in notes:a+=.005*np.sin(2*np.pi*f*t)*env*(.7+.3*np.sin(2*np.pi*.15*t))
for i,l in enumerate(s['lines']):
 at=l['start'];u=t-at
 if l['action']=='reject':
  mask=(u>=0)&(u<.65);a+=mask*.075*np.sin(2*np.pi*(190*u-65*u*u))*np.exp(-np.maximum(u,0)*5)
 if l['action']=='return':
  mask=(u>=0)&(u<.8);a+=mask*.025*np.sin(2*np.pi*(500*u+700*u*u))*np.sin(np.pi*np.clip(u/.8,0,1))
 if l['action']=='deliver':
  for delay,f in[(.6,523.25),(.85,659.25),(1.1,783.99)]:
   v=u-delay;mask=(v>=0)&(v<1);a+=mask*.035*np.sin(2*np.pi*f*v)*np.exp(-np.maximum(v,0)*5)
a*=np.clip(t/2,0,1)*np.clip((s['duration']-t)/2,0,1)
with wave.open(out+'/score.wav','wb')as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
