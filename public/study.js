export const normalizeAnswer=text=>String(text).normalize('NFC').trim().toLocaleLowerCase('fi').replace(/[.,!?]/g,'').replace(/\s+/g,' ');
export function answerIsCorrect(question,answer){return question.type==='input'?question.answers.some(value=>normalizeAnswer(value)===normalizeAnswer(answer)):Number(answer)===question.answer;}
export const reviewIntervals=[1,3,7,14,30,60,120];
export function scheduleReview(previous,correct,now=Date.now()){
  if(!correct)return {stage:0,due:now+600000};
  const stage=Math.min(previous?.stage||0,6);
  return {stage:Math.min(stage+1,6),due:now+reviewIntervals[stage]*86400000};
}
export function questionBank(lessons){return lessons.flatMap(lesson=>lesson.questions.map((question,index)=>({id:lesson.id+':'+index,lesson:lesson.id,title:lesson.title,level:lesson.level,question})));}
export function checkpointQuestions(lessons,level,random=Math.random){
  const pool=questionBank(lessons.filter(lesson=>lesson.level===level));
  // One question per lesson first, then a shuffled second pass when the level is shorter.
  const first=[];for(const lesson of lessons.filter(lesson=>lesson.level===level)){const items=pool.filter(item=>item.lesson===lesson.id);first.push(items[Math.floor(random()*items.length)]);}
  const selected=new Set(first.map(item=>item.id));
  const rest=pool.filter(item=>!selected.has(item.id));
  const mix=list=>{for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;};
  return mix([...mix(first).slice(0,15),...mix(rest).slice(0,Math.max(0,15-first.length))]);
}
