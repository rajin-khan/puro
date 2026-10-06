export const PROFILE_IDS = ['rajin','labbaiqua'];
const names = {rajin:'Rajin',labbaiqua:'Labbaiqua'};
const key = id => 'puro:progress:v2:' + id;
export const emptyState = (id='rajin') => ({name:names[id]||'Learner',goal:30,completed:{},review:{},days:{},journal:{},assessment:{},customWords:{},mistakes:{},missions:{},sessions:{},checkpoints:{},draft:null});
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
export function validateState(data) {
  if (!object(data)||Object.keys(data).some(k=>!Object.hasOwn(emptyState(),k))||typeof data.name!=='string'||!data.name.trim()||data.name.length>30||![10,15,30,45].includes(data.goal)) return false;
  for(const k of ['completed','review','days','journal','assessment']) if(!object(data[k])||Object.keys(data[k]).length>3000) return false;
  for(const map of Object.values(data).filter(object))if(Object.keys(map).some(k=>['__proto__','constructor','prototype'].includes(k)))return false;
  for(const k of ['customWords','mistakes','missions','sessions','checkpoints']) if(data[k]!==undefined&&(!object(data[k])||Object.keys(data[k]).length>3000)) return false;
  for(const [k,v] of Object.entries(data.completed)) if(!/^[a-z0-9-]{1,50}$/.test(k)||!object(v)||!Number.isFinite(v.score)||v.score<0||v.score>100||typeof v.date!=='string'||!Number.isFinite(Date.parse(v.date))) return false;
  for(const [k,v] of Object.entries(data.review)) if(!k||k.length>80||['__proto__','constructor','prototype'].includes(k)||!object(v)||!Number.isInteger(v.stage)||v.stage<0||v.stage>6||!Number.isFinite(v.due)) return false;
  for(const [k,v] of Object.entries(data.days)) if(!/^\d{4}-\d{2}-\d{2}$/.test(k)||!Number.isFinite(v)||v<0||v>10000) return false;
  for(const [k,v] of Object.entries(data.journal)) if(!k||k.length>100||typeof v!=='string'||v.length>15000) return false;
  for(const [k,v] of Object.entries(data.assessment)) if(!/^(A1|A2|B1|B2|C1|C2)-\d$/.test(k)||typeof v!=='boolean') return false;
  for(const [k,v] of Object.entries(data.customWords||{})) if(['__proto__','constructor','prototype'].includes(k)||!k||k.length>80||!object(v)||typeof v.en!=='string'||!v.en.trim()||v.en.length>200||!['A1','A2','B1','B2','C1','C2'].includes(v.level)) return false;
  for(const [k,v] of Object.entries(data.mistakes||{})) if(!/^[a-z0-9-]+:\d+$/.test(k)||!object(v)||!Number.isInteger(v.stage)||v.stage<0||v.stage>6||!Number.isFinite(v.due)) return false;
  for(const [k,v] of Object.entries(data.missions||{})) if(!/^[a-z0-9-]+$/.test(k)||typeof v!=='string'||!Number.isFinite(Date.parse(v))) return false;
  for(const [k,v] of Object.entries(data.sessions||{})) if(!/^[a-z0-9-]+$/.test(k)||!object(v)||typeof v.date!=='string'||!Number.isFinite(Date.parse(v.date))||!Number.isInteger(v.rounds)||v.rounds<1||v.rounds>10000) return false;
  for(const [k,v] of Object.entries(data.checkpoints||{})) if(!['A1','A2','B1','B2','C1','C2'].includes(k)||!object(v)||!Number.isFinite(v.score)||v.score<0||v.score>100||!Number.isFinite(Date.parse(v.date))) return false;
  if(data.draft!==undefined&&data.draft!==null&&(!object(data.draft)||!/^([a-z0-9-]){1,50}$/.test(data.draft.id)||!Number.isInteger(data.draft.step)||data.draft.step<0||data.draft.step>50||!Number.isInteger(data.draft.mistakes)||data.draft.mistakes<0||data.draft.mistakes>10000)) return false;
  return true;
}
let cloudStore=null;
export function configureCloud(store){cloudStore=store;}
let selected = 'rajin';
try {const id=sessionStorage.getItem('puro:active-profile');if(PROFILE_IDS.includes(id)) selected=id;} catch {}
export const activeProfile = () => selected;
export function setActiveProfile(id) {if(!PROFILE_IDS.includes(id)) throw new Error('Unknown learner.');selected=id;try{sessionStorage.setItem('puro:active-profile',id);}catch{}}
function readStored(id) {
  if(!PROFILE_IDS.includes(id)) throw new Error('Unknown learner.');
  let raw;try{raw=localStorage.getItem(key(id));if(raw===null&&id==='rajin')raw=localStorage.getItem('puro-progress-v1');}catch{throw new Error('Browser storage is unavailable. Allow site storage and try again.');}
  if(raw===null)return {data:emptyState(id),revision:0};
  let saved;try{saved=JSON.parse(raw);}catch{throw new Error('Saved progress could not be read. Your existing data has been kept.');}
  if(!saved||!Number.isSafeInteger(saved.revision)||saved.revision<0||!validateState(saved.data))throw new Error('Saved progress is invalid. Your existing data has been kept.');
  for(const k of ['customWords','mistakes','missions','sessions','checkpoints'])saved.data[k]||={};
  return saved;
}
export async function loadProgress(id=selected){return cloudStore?cloudStore.load(id):readStored(id);}
export function profileSnapshots(){return PROFILE_IDS.map(id=>{try{return {id,...readStored(id),error:null};}catch(e){return {id,data:emptyState(id),revision:0,error:e.message};}});}
export async function saveProgress(data,revision,id=selected) {
  if(cloudStore)return cloudStore.save(data,revision,id);
  if(!PROFILE_IDS.includes(id)||!validateState(data)||!Number.isSafeInteger(revision)||revision<0)throw new Error('Invalid progress data. Your current work is still on screen.');
  const save=()=>{
    const latest=readStored(id);
    if(latest.revision!==revision){const e=new Error('This learner’s progress changed in another tab. Download your current work before reloading.');e.code=409;throw e;}
    const next={data,revision:revision+1};
    try{localStorage.setItem(key(id),JSON.stringify(next));}catch{throw new Error('Browser storage is full or blocked. Download your current work before closing this page.');}
    return {revision:next.revision};
  };
  return globalThis.navigator?.locks?navigator.locks.request(key(id),save):save();
}
export function parseBackup(text){
  if(text.length>2500000)throw new Error('This backup is too large.');
  let body;try{body=JSON.parse(text);}catch{throw new Error('Choose a valid Puro JSON backup.');}
  const data=body?.format==='puro-learner-backup-v2'?body.data:body;
  if(!validateState(data))throw new Error('The backup contains invalid progress. Nothing has been changed.');
  for(const k of ['customWords','mistakes','missions','sessions','checkpoints'])data[k]||={};
  return data;
}
export function backupDocument(data){return {format:'puro-learner-backup-v2',exportedAt:new Date().toISOString(),profile:activeProfile(),data:structuredClone(data)};}
