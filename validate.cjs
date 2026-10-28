const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const distDir = path.join(__dirname, 'dist');
const dir = fs.existsSync(distDir) ? distDir : __dirname;
const context = {window:{}};
vm.createContext(context);
for (const file of ['content.js','extra-content.js','audit-data.js']) vm.runInContext(fs.readFileSync(require('node:path').join(dir,file),'utf8'),context,{filename:file});
const data=context.window.STUDY_DATA;
const sources=context.window.NAPLEX_SOURCES;
const practice=require(path.join(dir,'practice-core.js'));
const validCodes=new Set(['S','1.A','1.A.1','1.A.2','1.A.3','1.B','1.B.1','1.B.2','1.C','1.C.1','1.C.2','1.C.3','1.C.4','1.C.5','1.C.6','1.C.7','1.C.8','1.C.9','1.D','1.E','1.F','2.A','2.A.1','2.A.2','2.A.3','2.A.4','2.A.5','2.B','2.C','2.C.1','2.C.2','2.C.3','2.C.4','2.C.5','2.D','3.A','3.B','3.C','3.C.1','3.C.2','3.C.3','3.C.4','3.C.5','3.C.6','3.C.7','3.D','3.D.1','3.D.2','3.D.3','3.E','3.E.1','3.E.2','3.E.3','3.F','3.G','4.A','4.B','4.C','4.D','5.A','5.B','5.C','5.D']);
const ids=new Set();let total=0;
assert.equal(data.length,12);
for(const [i,w] of data.entries()){
  assert.equal(w.n,i+1);
  assert.equal(w.days.length,5);
  assert.equal(w.lessons.length,5);
  assert.ok(w.questions.length>=15);
  assert.ok(w.medicationFocus.title && w.medicationFocus.intro && w.medicationFocus.points.length>=3);
  assert.ok(w.medicationFocus.sourceIds.length && w.medicationFocus.sourceIds.every(id=>sources[id]));
  for(const code of w.medicationFocus.blueprint.split(' / '))assert.ok(validCodes.has(code),code);
  assert.ok(w.questions.filter(q=>q.audit.blueprint.startsWith('2.')).length>=4);
  assert.ok(w.math.prompt && w.math.steps.length && w.math.answer);
  for(const l of w.lessons){assert.ok(l.title && l.intro && l.points.length>=3 && l.points.every(Boolean));for(const code of l.blueprint.split(' / '))assert.ok(validCodes.has(code),code);}
  for(const q of w.questions){
    assert.ok(q.q && q.why);
    total++;
    assert.match(q.audit.id,/^W\d{2}-Q\d{2}$/);assert.ok(!ids.has(q.audit.id));ids.add(q.audit.id);
    assert.ok(validCodes.has(q.audit.blueprint),q.audit.blueprint);assert.ok(q.audit.sourceIds.length);
    for(const sourceId of q.audit.sourceIds){assert.ok(sources[sourceId],sourceId);assert.equal(new URL(sources[sourceId][1]).protocol,'https:');}
    assert.equal(q.audit.checked,'2026-10-28');
    if(q.type==='numeric'){
      assert.ok(Number.isFinite(q.answer) && q.unit);assert.equal(practice.grade(q,String(q.answer)),true);assert.equal(practice.grade(q,String(q.answer+1)),false);
    }else{
      assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4,'Duplicate option in '+q.q);
      if(q.type==='multiple') {assert.ok(Array.isArray(q.correct) && q.correct.length>1 && q.correct.every(n=>Number.isInteger(n) && n>=0 && n<4));assert.equal(practice.grade(q,Array.from(q.correct)),true);assert.equal(practice.grade(q,[q.correct[0]]),false);}
      else {assert.ok(Number.isInteger(q.correct) && q.correct>=0 && q.correct<4);assert.equal(practice.grade(q,q.correct),true);assert.equal(practice.grade(q,(q.correct+1)%4),false);}
    }
  }
  for(const source of w.sources) assert.equal(new URL(source.url).protocol,'https:');
}
assert.equal(total,237);
const manifest=JSON.parse(fs.readFileSync(require('node:path').join(dir,'manifest.webmanifest'),'utf8'));
for(const icon of manifest.icons) assert.ok(fs.existsSync(require('node:path').join(dir,icon.src)));
for(const file of ['index.html','styles.css','app.js','content.js','extra-content.js','audit-data.js','content-audit.md','practice-core.js','sw.js']) assert.ok(fs.statSync(require('node:path').join(dir,file)).size>0);
console.log('Validated 12 weeks, 60 mapped lessons, 12 medication-use focus sections, 237 questions and their source records, 12 worked calculations, and PWA assets.');
