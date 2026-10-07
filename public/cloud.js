import {emptyState,validateState,setActiveProfile,configureCloud} from './storage.js';
import {SUPABASE_URL,SUPABASE_KEY} from './config.js';
export const LEARNERS={'rajin.khan2001@gmail.com':'rajin','labbaiquahtabassum2001@gmail.com':'labbaiqua'};
const names={rajin:'Rajin',labbaiqua:'Labbaiqua'};
let signingOut=false;
let client,account,summaries=[],summaryError='',summaryTime=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const cloudAccount=()=>account;
export const pairStatus=()=>({profiles:summaries,error:summaryError,at:summaryTime});
export function validPairSummary(profiles){
 return Array.isArray(profiles)&&profiles.length===2&&new Set(profiles.map(profile=>profile?.id)).size===2&&profiles.every(profile=>profile&&['rajin','labbaiqua'].includes(profile.id)&&typeof profile.name==='string'&&!!profile.name.trim()&&typeof profile.started==='boolean'&&['lessons','words','minutes','practiceRounds'].every(key=>Number.isFinite(profile[key])&&profile[key]>=0));
}
export async function refreshPair(){
 if(!client||!account)return;
 try{const profiles=await rpc('puro_pair_summary');if(!validPairSummary(profiles))throw new Error('The cloud returned invalid partner progress.');summaries=profiles;summaryError='';summaryTime=new Date();}
 catch(error){summaryError='Partner progress could not refresh. '+error.message;}
 window.dispatchEvent(new Event('puro-pairupdate'));
}
async function rpc(name,args){
 const {data,error}=await client.rpc(name,args);
 if(error){const e=new Error(error.code==='PT409'?'Progress changed on another device. Download your work, then load the latest cloud progress.':error.message||'Cloud connection failed.');e.code=error.code==='PT409'?409:error.code;throw e;}
 return data;
}
// A failed cloud save leaves a durable recovery copy. Local data never replaces
// a newer cloud revision without the learner choosing a backup restore.
export function makeCloudStore(sdk,user,id,storage=localStorage){
 const cacheKey='puro:cloud:v1:'+user.id;
 const read=()=>{let raw;try{raw=storage.getItem(cacheKey);}catch{throw new Error('Browser storage is blocked. Enable site storage to protect unsynced work.');}if(!raw)return null;let c;try{c=JSON.parse(raw);}catch{throw new Error('Your recovery copy is unreadable. It has been kept.');}if(!c||!validateState(c.data)||!Number.isSafeInteger(c.revision)||c.revision<0||typeof c.pending!=='boolean')throw new Error('Your recovery copy is invalid. It has been kept.');return c;};
 const write=c=>{try{storage.setItem(cacheKey,JSON.stringify(c));}catch{throw new Error('Browser storage is full or blocked. Download your current work before closing.');}};
 const call=async(name,args)=>{const {data,error}=await sdk.rpc(name,args);if(error){const e=new Error(error.code==='PT409'?'Progress changed on another device. Download your work, then load the latest cloud progress.':error.code==='42501'?'Your account cannot access this learning space. Check your confirmed sign-in email.':'Cloud save failed. Your recovery copy stays on this device. Reconnect and retry.');e.code=error.code==='PT409'?409:error.code;throw e;}return data;};
 const assertOwner=requested=>{if(requested!==id)throw new Error('Sign in to your own account to edit progress.');};
 const save=async(data,revision,requested=id)=>{
  assertOwner(requested);if(!validateState(data)||!Number.isSafeInteger(revision)||revision<0)throw new Error('Invalid progress data.');
  const work=async()=>{
   const previous=read();if(previous&&previous.revision!==revision){const e=new Error('Progress changed in another tab. Download your work, then load the latest cloud progress.');e.code=409;throw e;}
   const pending={data:structuredClone(data),revision,pending:true};write(pending);
   const result=await call('puro_save',{progress:{owner:user.id,data},expected_revision:revision});
   if(!result||!Number.isSafeInteger(result.revision)||result.revision!==revision+1)throw new Error('The cloud returned an invalid save confirmation. Your recovery copy has been kept.');
   write({...pending,revision:result.revision,pending:false});return {revision:result.revision};
  };
  return globalThis.navigator?.locks?navigator.locks.request(cacheKey,work):work();
 };
 return {
  async load(requested=id){
   assertOwner(requested);const cached=read();
   const remote=await call('puro_bootstrap');
   if(!remote||remote.slot!==id||!validateState(remote.data)||!Number.isSafeInteger(remote.revision)||remote.revision<0)throw new Error('The cloud returned invalid learner progress.');
   if(cached?.pending){
    if(cached.revision!==remote.revision)return {...cached,problem:'A newer cloud version exists. Your unsynced work is still here. Download it before loading the latest cloud progress.',conflict:true};
    try{const result=await save(cached.data,cached.revision);return {data:cached.data,revision:result.revision};}
    catch(error){return {...cached,problem:error.message,conflict:error.code===409};}
   }
   write({data:remote.data,revision:remote.revision,pending:false});return {data:remote.data,revision:remote.revision};
  },save,
  async discardPending(data,revision){const c=read();const copy=data?{data:structuredClone(data),revision}:c?.pending?c:null;if(copy){storage.setItem('puro:recovery:'+user.id,JSON.stringify(copy));if(c?.pending)storage.removeItem(cacheKey);}},
  recovery(){try{const c=JSON.parse(storage.getItem('puro:recovery:'+user.id)||'null');return c&&validateState(c.data)?c.data:null;}catch{return null;}},
  cached:read
 };
}
let store;
export const discardPending=(data,revision)=>store?.discardPending(data,revision);
export const recoveryProgress=()=>store?.recovery();
export async function signOut(){signingOut=true;const {error}=await client.auth.signOut({scope:'local'});if(error){signingOut=false;throw error;}location.reload();}

function loginView(message=''){
 document.body.classList.add('signed-out');
 document.querySelector('#main').innerHTML='<section class="auth-layout"><div class="auth-story"><a class="brand" href="#home">puro<span class="brand-dot">.</span></a><span class="eyebrow" lang="fi">OPITAAN SUOMEA YHDESSÄ</span><h1>Your next chapter.<br>In Finnish.</h1><p>Learn Finnish for life, study, and work in Finland. 60 guided lessons, word review, and practice you can share.</p><span class="auth-caption">MADE FOR RAJIN & LABBAIQUA</span></div><div class="auth-card"><span class="eyebrow">TERVETULOA · WELCOME</span><h2>Pick up where you left off.</h2><p>Your progress follows you. Sign in to your own learning space.</p><form id="login-form"><label for="login-email">Email address</label><input id="login-email" type="email" name="email" autocomplete="username" aria-describedby="login-error" required placeholder="Your sign-in email"><label for="login-password">Password</label><input id="login-password" type="password" name="password" autocomplete="current-password" aria-describedby="login-error" required minlength="6"><p class="auth-error" id="login-error" role="status">'+esc(message)+'</p><button class="button primary" type="submit">Sign in<span class="busy-indicator" aria-hidden="true"></span></button></form><p class="hint">A private space for two. Lesson progress and practice totals are shared with your partner. Writing drafts stay in your own account.</p><details class="auth-help"><summary>First time signing in?</summary><p>Use the password created for your email in Supabase → Authentication → Users. The two accounts must be created and confirmed by the project owner. Public sign-up is not offered here.</p><p>If you forget your password, the project owner can update it in Supabase. No email delivery setup is needed for this sign-in flow.</p></details></div></section>';
}
export async function startCloud(){
 client=globalThis.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false},global:{fetch:(url,options)=>fetch(url,{...options,signal:options?.signal||AbortSignal.timeout(20000)})}});
 const accept=async user=>{
  const id=LEARNERS[user.email?.toLowerCase()];if(!id)throw new Error('Use Rajin or Labbaiqua’s registered email.');
  const body=await rpc('puro_bootstrap');if(!body||body.slot!==id)throw new Error('This account does not match the learner profile.');
  account=user;setActiveProfile(id);store=makeCloudStore(client,user,id);configureCloud(store);
  // Authenticated views contain personal work and must stay out of search results.
  const robots=document.querySelector('meta[name="robots"]');if(robots)robots.setAttribute('content','noindex, nofollow');
  document.body.classList.remove('signed-out');
  document.querySelector('#learner-profile').disabled=true;
  document.querySelector('#sign-out').hidden=false;
  client.auth.onAuthStateChange((event,session)=>{if(signingOut&&event==='SIGNED_OUT'){location.reload();return;}if(event==='SIGNED_OUT'||session&&session.user.id!==account.id)window.dispatchEvent(new Event('puro-accountchanged'));});
  await refreshPair();setInterval(()=>{if(!document.hidden)refreshPair();},30000);
  window.addEventListener('focus',()=>refreshPair());
 };
 let initialError='';
 try{const {data,error}=await client.auth.getSession();if(error)throw error;if(data.session){await accept(data.session.user);return;}}
 catch(error){initialError=error.message;}
 loginView(initialError);
 await new Promise(resolve=>{
  document.querySelector('#login-form').addEventListener('input',event=>{event.target.removeAttribute('aria-invalid');});
  document.querySelector('#login-form').addEventListener('submit',async event=>{
   event.preventDefault();const button=event.submitter,email=document.querySelector('#login-email').value.trim().toLowerCase(),password=document.querySelector('#login-password').value;
   const message=document.querySelector('#login-error');message.textContent='';for(const input of document.querySelectorAll('#login-form input'))input.removeAttribute('aria-invalid');button.disabled=true;button.setAttribute('aria-busy','true');message.textContent='Signing in…';
   try{
    if(!LEARNERS[email])throw new Error('Use Rajin or Labbaiqua’s registered email.');
    const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw new Error(error.message==='Invalid login credentials'?'Email or password is incorrect. Check that your Supabase account has been created.':error.message);
    await accept(data.user);document.querySelector('#login-password')?.value&&(document.querySelector('#login-password').value='');resolve();
   }catch(error){message.textContent=error.message==='Failed to fetch'?'Could not reach your learning space. Check your connection and try again.':error.message;const field=document.querySelector(!LEARNERS[email]?'#login-email':'#login-password');field.setAttribute('aria-invalid','true');field.focus();message.scrollIntoView({block:'nearest'});}
   finally{button.disabled=false;button.removeAttribute('aria-busy');}
  });
 });
}
