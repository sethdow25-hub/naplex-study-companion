const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const distDir = path.join(__dirname, 'dist');
const dir = fs.existsSync(distDir) ? distDir : __dirname;
const context = {window:{}};
vm.createContext(context);
for (const file of ['content.js','extra-content.js']) vm.runInContext(fs.readFileSync(require('node:path').join(dir,file),'utf8'),context,{filename:file});
const data=context.window.STUDY_DATA;
assert.equal(data.length,12);
for(const [i,w] of data.entries()){
  assert.equal(w.n,i+1);
  assert.equal(w.days.length,5);
  assert.equal(w.lessons.length,5);
  assert.equal(w.questions.length,13);
  assert.ok(w.math.prompt && w.math.steps.length && w.math.answer);
  for(const l of w.lessons) assert.ok(l.title && l.intro && l.points.length>=3 && l.points.every(Boolean));
  for(const q of w.questions){
    assert.ok(q.q && q.why);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4, 'Duplicate option in '+q.q);
    assert.ok(Number.isInteger(q.correct) && q.correct>=0 && q.correct<4);
  }
  for(const source of w.sources) assert.equal(new URL(source.url).protocol,'https:');
}
const manifest=JSON.parse(fs.readFileSync(require('node:path').join(dir,'manifest.webmanifest'),'utf8'));
for(const icon of manifest.icons) assert.ok(fs.existsSync(require('node:path').join(dir,icon.src)));
for(const file of ['index.html','styles.css','app.js','content.js','extra-content.js','sw.js']) assert.ok(fs.statSync(require('node:path').join(dir,file)).size>0);
console.log('Validated 12 weeks, 60 lessons, 156 questions, 12 worked calculations, references, and PWA assets.');
