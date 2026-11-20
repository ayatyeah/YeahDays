export type Attempt = { ids:string[]; index:number; answers:number[][]; done:boolean };
export type NetworkProgress = {
  history:Record<string,{ok:boolean;time:number}>;
  attempt:Attempt|null;
  time:number;
};
export const emptyProgress:NetworkProgress={history:{},attempt:null,time:0};
export function mergeNetwork(a:NetworkProgress,b:NetworkProgress):NetworkProgress {
  const history={...a.history};
  for(const [id,record] of Object.entries(b.history)){
    if(!history[id] || record.time>history[id].time) history[id]=record;
  }
  return {...(b.time>a.time?b:a),history};
}
