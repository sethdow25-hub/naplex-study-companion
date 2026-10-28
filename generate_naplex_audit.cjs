'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const {sources, questionMap, lessonMap} = require('./naplex_audit_spec.cjs');
const extra = require('./naplex_extra_practice.cjs');
const more = require('./naplex_more_practice.cjs');
const developmentDist = path.join(__dirname, 'naplex-study-app', 'dist');
const dist = fs.existsSync(developmentDist) ? developmentDist : __dirname;
const outputs = dist === developmentDist ? path.join(__dirname, '..', 'outputs') : dist;
const context = {window:{}};
vm.createContext(context);
for (const file of ['content.js','extra-content.js']) vm.runInContext(fs.readFileSync(path.join(dist,file),'utf8'),context,{filename:file});
const original = JSON.parse(JSON.stringify(context.window.STUDY_DATA));
const data = JSON.parse(JSON.stringify(original));
const get=(w,q)=>data[w-1].questions[q-1];
const changed=[];
function change(w,q,edit,reason){const x=get(w,q);const before=JSON.parse(JSON.stringify(x));edit(x);changed.push({id:`W${String(w).padStart(2,'0')}-Q${String(q).padStart(2,'0')}`,reason,before,after:JSON.parse(JSON.stringify(x))});}
change(3,3,q=>{q.q='Which type of diabetes generally requires insulin treatment?';q.why='Most people with type 1 diabetes need insulin every day. Treatment for other forms depends on individual circumstances.';},'Avoid an absolute claim about every person with type 1 diabetes.');
data[2].lessons[0].points[0]='Most people with type 1 diabetes need insulin every day. People with type 2 diabetes may use a variety of medicines, including insulin, depending on their circumstances.';
change(8,3,q=>{q.options[q.correct]='The indication and exact prescribed schedule';q.why='Some non-oncology uses are dosed weekly. Verify the actual indication and schedule; a daily-versus-weekly error can cause serious harm.';},'Do not imply all non-oncology schedules are weekly.');
for (const n of [1,10]) change(6,n,q=>{q.q=n===1?'Which action can reduce local oral adverse effects after fluticasone inhalation aerosol?':'What counseling point appears in the fluticasone inhalation aerosol instructions?';q.why='The fluticasone inhalation aerosol label advises rinsing the mouth after use to reduce local oral effects. Follow the instructions for the specific product.';},'Tie the advice to the product label used as evidence.');
for (const n of [2,9]) change(10,n,q=>{q.q=q.q.replace('event rate is','event rate over the same follow-up is').replace('treatment is 10%','treatment is 10% over the same follow-up');q.why+=' This comparison applies to the outcome, population, and follow-up specified in the study.';},'State that risks must refer to comparable follow-up.');
for (const n of [3,10]) change(10,n,q=>{q.q=q.q.replace('what is the NNT?', 'what is the NNT for the study’s specified outcome and follow-up?').replace('what is NNT?', 'what is the NNT for the study’s specified outcome and follow-up?');q.why+=' Interpret this estimate for the population, outcome, and follow-up period studied.';},'Add the population, outcome, and time context for NNT.');
data[9].math.prompt=data[9].math.prompt.replace('In a hypothetical study,','In a hypothetical one-year study,');
data[9].lessons[2].points[0]+=' Interpret NNT for the study’s population, outcome and follow-up period.';
data[0].lessons[4].points.push('Biosimilar substitution depends on the specific product’s FDA status, the prescription, and applicable state law.');
data[9].lessons[0].points.push('Sterile preparations need appropriate contamination controls; a clear appearance or correct calculation does not establish sterility.');
data[10].lessons[2].points.push('When mentoring learners, use specific, timely feedback and appropriate supervision, according to the setting’s rules.');
change(12,5,q=>{q.q='Which is a reasonable use of a missed-question log?';q.why='A log can help organize error patterns and topics to revisit. Evidence for retrieval practice does not establish that a particular log format guarantees exam performance.';},'Describe a study suggestion without presenting it as a proven NAPLEX outcome.');
change(12,9,q=>{q.q='A practice question was missed because the allergy was overlooked. Which is a reasonable response?';q.why='One option is to record the pattern and practice checking allergy information. This study suggestion does not guarantee future performance.';},'Describe a study suggestion without asserting an established effect on exam results.');

// Check the arithmetical answer independently, using the question's numbers.
const fixedChecks={
 '1-4':500/250,'1-7':50*4,'3-4':100*0.5,'3-9':100*0.3,'4-4':100/1,
 '5-3':20*5,'6-4':4*5,'6-8':3*10,'7-4':1*3*7,'8-4':50*2,'8-9':120*1.5,
 '9-4':200*5/100,'10-2':20-10,'10-3':1/0.1,'10-7':1000/100,'10-9':15-10,'10-10':1/0.05,'11-3':90/3,'12-2':250/100
};
const numericFirst = {1:180/40,2:0.05*80,3:35/100,4:6*42,5:8*.5,6:Math.round(250/(90/60)*10)/10,7:1.5*2*14,8:40*1.65,9:12.5*16,10:18-12,11:84/(2*2),12:200/1200*30};
const numericMore = {2:100*4,3:80/2/2,4:0.5};
const mathResults=[500*5/250,5*80,25/100,100/(30/60),10*18,2*15,1.5*2*10,100*1.7,125*5/125,25,60/2,250/(1000/10)];
const extraSources={'2-3':['apixaban'],'3-6':['insulin300'],'8-5':['recon'],'9-6':['weight','syringe'],'12-4':['allergy','kidney']};
const originalMetadata=[];
for(const w of data){
  assert.equal(w.questions.length,13); assert.equal(w.lessons.length,5);
  w.lessons.forEach((l,i)=>{l.blueprint=lessonMap[w.n][i];});
  if(w.n===1) w.lessons[4].blueprint='1.F / 2.B';
  if(w.n===11) w.lessons[2].blueprint='5.A / 5.D';
  w.sources=w.sources.map(s=>s.name.includes('NAPLEX content outline')?{name:s.name,url:sources.outline[1]}:s);
  if(w.n===1) w.sources.push({name:sources.biosimilars[0],url:sources.biosimilars[1]});
  if(w.n===10) w.sources.push({name:sources.sterile[0],url:sources.sterile[1]});
  if(w.n===11) w.sources.push({name:sources.feedback[0],url:sources.feedback[1]});
  w.questions.forEach((q,i)=>{
    let code,sourceId;
    if(i<10) [code,sourceId]=questionMap[w.n][i].split('|');
    else [code,sourceId]=[['1.C.5','math'],['1.C.3','math'],['1.C.2','math']][i-10];
    const sourceIds=[sourceId,...(extraSources[`${w.n}-${i+1}`]||[])];
    const studySuggestion=w.n===12 && [5,9].includes(i+1);
    const key=`${w.n}-${i+1}`;
    let computed=null;
    if(Object.hasOwn(fixedChecks,key)) computed=fixedChecks[key];
    if(i>=10){
      let m;
      if(i===10){m=/contains (\d+) mg in (\d+) mL.*supply (\d+) mg/i.exec(q.q); assert.ok(m); computed=Number(m[3])*Number(m[2])/Number(m[1]);}
      if(i===11){m=/infusion of (\d+) mL.*over (\d+) hours/i.exec(q.q); assert.ok(m); computed=Number(m[1])/Number(m[2]);}
      if(i===12){m=/takes (\d+) tablets daily for (\d+) days/i.exec(q.q); assert.ok(m); computed=Number(m[1])*Number(m[2]);}
    }
    if(computed!==null){const found=Number(q.options[q.correct].replace(/,/g,'').match(/\d+(?:\.\d+)?/)[0]);assert.ok(Math.abs(found-computed)<1e-8,`Calculation mismatch ${key}`);}
    q.audit={id:`W${String(w.n).padStart(2,'0')}-Q${String(i+1).padStart(2,'0')}`,blueprint:code,sourceIds,kind:studySuggestion?'study_suggestion':computed!==null?'independent_calculation':'source_check',checked:'2026-10-28'};
    originalMetadata.push(q.audit.id);
  });
  for(const [i,q0] of [...extra[w.n],...(more[w.n]||[])].entries()){
    const q=JSON.parse(JSON.stringify(q0));
    if(w.n===9 && i===1) q.sourceIds.push('weight');
    if(w.n===10 && i===0) q.sourceIds.push('nnt');
    if(q.type==='numeric'){
      const check=i===0?numericFirst[w.n]:numericMore[w.n];
      assert.ok(typeof check==='number' && Math.abs(check-q.answer)<1e-8,`New calculation mismatch week ${w.n} item ${i}`);
    }
    q.audit={id:`W${String(w.n).padStart(2,'0')}-Q${String(w.questions.length+1).padStart(2,'0')}`,blueprint:q.blueprint,sourceIds:q.sourceIds,kind:q.reviewKind,checked:'2026-10-28'};
    delete q.blueprint;delete q.sourceIds;delete q.reviewKind;
    w.questions.push(q);
  }
  const answerText=w.math.answer;
  if(w.n===10) assert.ok(answerText.includes('4 percentage points') && answerText.includes('25'));
  else assert.ok(Math.abs(Number(answerText.match(/\d+(?:\.\d+)?/)[0])-mathResults[w.n-1])<1e-8,`Worked calculation mismatch week ${w.n}`);
}

const deltas=data.map((w,wi)=>({
  questions:w.questions.slice(0,13).map((q,i)=>{
    const delta={audit:q.audit};
    for(const key of ['q','options','correct','why']) if(JSON.stringify(q[key])!==JSON.stringify(original[wi].questions[i][key])) delta[key]=q[key];
    return delta;
  }),
  added:w.questions.slice(13),
  lessons:w.lessons.map((l,i)=>({blueprint:l.blueprint,...(JSON.stringify(l.points)!==JSON.stringify(original[wi].lessons[i].points)?{points:l.points}:{})})),
  math:w.math,
  sources:w.sources
}));
const script=`/* AI-assisted source and blueprint audit; generated 2026-10-28. */\n(function(){\n  const d=${JSON.stringify(deltas)};\n  window.NAPLEX_SOURCES=${JSON.stringify(sources)};\n  window.STUDY_DATA.forEach((w,i)=>{const x=d[i];w.questions.forEach((q,j)=>Object.assign(q,x.questions[j]));w.questions.push(...x.added);w.lessons.forEach((l,j)=>Object.assign(l,x.lessons[j]));w.math=x.math;w.sources=x.sources;});\n})();\n`;
fs.writeFileSync(path.join(dist,'audit-data.js'),script,'utf8');

const counts={};for(const w of data)for(const q of w.questions){const k=q.audit.blueprint==='S'?'Supplemental':q.audit.blueprint[0];counts[k]=(counts[k]||0)+1;}
const report=[];
report.push('# NAPLEX Study Companion: question audit and blueprint map','',
  'Review date: October 28, 2026. The mapping uses the NABP outline effective May 1, 2025; confirm the current outline before a 2027 exam.',
  '', 'This is an AI-assisted source check and a best-fit mapping, not an independent pharmacist or NABP review, psychometric validation, a complete clinical fact check, or evidence of exam readiness. The app is not an NABP product. Source links support the stated concepts, but may not address every distractor or every possible clinical circumstance. Verify current guidelines and product-specific labeling. Mathematical examples are hypothetical, not dosing recommendations.',
  '', '[Official NABP content outline](https://nabp.pharmacy/wp-content/uploads/NAPLEX-Content-Outline.pdf) · [NABP examination format](https://read.nxtbook.com/nabp/bulletin/naplex_mpje_bulletin/what_is_the_naplex.html)',
  '',`Original questions reviewed: ${originalMetadata.length}. New questions added: ${data.reduce((a,w)=>a+w.questions.length,0)-originalMetadata.length}. Total questions: ${data.reduce((a,w)=>a+w.questions.length,0)}. Lessons mapped: 60. Worked calculations checked: 12.`,
  '',`Question best-fit counts: foundational knowledge ${counts['1']||0}; medication-use process ${counts['2']||0}; person-centered care ${counts['3']||0}; professional practice ${counts['4']||0}; management/leadership ${counts['5']||0}; supplemental ${counts.Supplemental||0}. These counts are not exam weights and do not establish adequate coverage.`,
  '', 'The set remains short and repetitive, especially its original weekly calculation drills. Domain 2 remains much thinner than its exam weight, and complex compounding, pharmacokinetics, nutrition, drug development, patient cases, interactions, monitoring, and many disease states need deeper study. A code beside an item means a best-fit topic assignment, not that the subdomain has been mastered or exhaustively covered.',
  '', '## Corrections made','');
for(const x of changed) report.push(`- **${x.id}:** ${x.reason}`);
report.push('- Added an outcome and one-year follow-up to the worked risk example. Updated related lesson wording, references, and selected missing topic introductions.','- Marked exam-policy questions and study suggestions as supplemental. The research cited for retrieval practice does not validate a specific error-log format.','', '## Lesson map','');
for(const w of data){report.push(`### Week ${w.n}: ${w.title}`);for(const l of w.lessons) report.push(`- ${l.title} — ${l.blueprint==='S'?'Supplemental: outside scored outline':`NABP ${l.blueprint}`}`);report.push('');}
report.push('## Question-by-question audit','');
for(const w of data){report.push(`### Week ${w.n}: ${w.title}`,'');
  for(const q of w.questions){
    const a=q.audit; const answer=q.type==='numeric'?`${q.answer} ${q.unit}`:Array.isArray(q.correct)?q.correct.map(i=>q.options[i]).join('; '):q.options[q.correct];
    const kind=a.kind==='study_suggestion'?'Study suggestion; specific effectiveness not established':a.kind==='independent_calculation'?'Arithmetic independently checked; no clinical dosing validation':'AI-assisted source check; independent pharmacist review pending';
    const ref=a.sourceIds.map(id=>{assert.ok(sources[id],id);const [name,url,section]=sources[id];return `[${name}](${url}) — ${section}`;}).join('; ');
    report.push(`**${a.id} — ${a.blueprint==='S'?'Supplemental':`NABP ${a.blueprint}`}**  `,`${q.q}  `,`Answer: ${answer}  `,`Explanation: ${q.why}  `,`Review: ${kind}. Checked ${a.checked}.  `,`Sources: ${ref}.`,'');
  }
}
report.push('## Worked calculations','');for(const w of data)report.push(`- Week ${w.n}: ${w.math.prompt} Answer: ${w.math.answer}. Arithmetic independently checked; not a clinical dosing endorsement.`);
report.push('','## Remaining review','', 'Have qualified pharmacists review every question and lesson, including distractors and patient-specific assumptions. Use fresh, case-based questions and a comprehensive review resource. Check current labels, guidelines, NABP policies and the content outline again before the exam. Scores in this app have not been validated to predict a NAPLEX result.');
fs.mkdirSync(outputs,{recursive:true});fs.writeFileSync(path.join(dist,'content-audit.md'),report.join('\n')+'\n','utf8');if(outputs!==dist)fs.writeFileSync(path.join(outputs,'NAPLEX Content Audit.md'),report.join('\n')+'\n','utf8');
console.log(JSON.stringify({original:originalMetadata.length,total:data.reduce((a,w)=>a+w.questions.length,0),lessons:60,changed:changed.length,counts},null,2));
