(() => {
  'use strict';
  const DATA = window.STUDY_DATA;
  const KEY = 'naplex-study-companion-v1';
  const root = document.getElementById('app');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icons = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/>',
    plan:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M7 2v4M17 2v4M3 9h18M7 13h3M14 13h3M7 17h3"/>',
    practice:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    notes:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.3 14.2l1.2.9-1.5 2.6-1.5-.4a8 8 0 0 1-1.8 1l-.3 1.5h-3l-.3-1.5a8 8 0 0 1-1.8-1l-1.5.4-1.5-2.6 1.2-.9a7 7 0 0 1 0-2.1l-1.2-.9 1.5-2.6 1.5.4a8 8 0 0 1 1.8-1l.3-1.5h3l.3 1.5a8 8 0 0 1 1.8 1l1.5-.4 1.5 2.6-1.2.9a7 7 0 0 1 0 2.1z"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>'
  };
  const svg = name => '<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>';
  const fresh = () => ({version:1,examDate:'',days:{},lessons:{},scores:{},notes:{}});
  function cleanState(candidate) {
    const out=fresh();
    if (!candidate || typeof candidate !== 'object') return out;
    if (typeof candidate.examDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(candidate.examDate)) out.examDate=candidate.examDate;
    for (const group of ['days','lessons']) if (candidate[group] && typeof candidate[group]==='object') for (const [key,val] of Object.entries(candidate[group])) if (/^\d{1,2}-\d$/.test(key) && val === true) out[group][key]=true;
    if (candidate.scores && typeof candidate.scores==='object') for (const [key,val] of Object.entries(candidate.scores)) if (/^\d{1,2}$/.test(key) && Number.isInteger(val) && val>=0 && val<=(DATA[Number(key)-1]?.questions.length??0)) out.scores[key]=val;
    if (candidate.notes && typeof candidate.notes==='object') for (const [key,val] of Object.entries(candidate.notes)) if (/^\d{1,2}$/.test(key) && typeof val==='string') out.notes[key]=val.slice(0,30000);
    return out;
  }
  let state;
  try { state=cleanState(JSON.parse(localStorage.getItem(KEY)||'null')); } catch { state=fresh(); }
  let view='home', selectedWeek=1, tab='lessons', quiz=null, searchValue='', deferredInstall=null;
  function save(){ try { localStorage.setItem(KEY,JSON.stringify(state)); } catch { /* Reading and practice remain available if storage is unavailable. */ } }
  function week(n){return DATA.find(w=>w.n===n)||DATA[0];}
  function daysDone(n){return week(n).days.reduce((sum,_,i)=>sum+(state.days[n+'-'+i]?1:0),0);}
  function lessonsDone(n){return week(n).lessons.reduce((sum,_,i)=>sum+(state.lessons[n+'-'+i]?1:0),0);}
  function totalDone(){return DATA.reduce((sum,w)=>sum+daysDone(w.n),0);}
  function nextWeek(){return DATA.find(w=>daysDone(w.n)<5)?.n||12;}
  function prettyDate(str) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(str)) return '';
    const [y,m,d]=str.split('-').map(Number);
    const date=new Date(y,m-1,d);
    return Number.isNaN(date.getTime())?'':date.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
  }
  function dateRange(n){
    if(!state.examDate)return '';
    const [y,m,d]=state.examDate.split('-').map(Number);
    const end=new Date(y,m-1,d), start=new Date(end); start.setDate(end.getDate()-83+(n-1)*7);
    const finish=new Date(start);finish.setDate(start.getDate()+6);
    const format=x=>x.toLocaleDateString(undefined,{month:'short',day:'numeric'});
    return format(start)+'–'+format(finish);
  }
  function daysUntil(){
    if(!state.examDate)return null;
    const [y,m,d]=state.examDate.split('-').map(Number);const target=new Date(y,m-1,d);const now=new Date();now.setHours(0,0,0,0);
    return Math.round((Date.UTC(target.getFullYear(),target.getMonth(),target.getDate())-Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()))/86400000);
  }
  const navs=[['home','Home'],['plan','12-week plan'],['practice','Practice'],['notes','Notebook'],['settings','Settings']];
  function nav(active,mobile=false){return navs.map(([id,label])=>'<button class="'+(mobile?'':'nav-button ')+(active===id?'active':'')+'" data-view="'+id+'" '+(active===id?'aria-current="page"':'')+'>'+svg(id)+'<span>'+esc(mobile&&id==='plan'?'Plan':label)+'</span></button>').join('');}
  function layout(content,active=view){
    const titles={home:'Dashboard',plan:'12-week plan',week:'Weekly study',practice:'Practice',notes:'Notebook',settings:'Settings',search:'Search'};
    const navActive=view==='week'?'plan':view;
    root.innerHTML='<div class="app"><aside class="sidebar"><div class="brand"><span class="brand-icon">✚</span><span class="brand-name">NAPLEX<span style="color:#aad4c8"> Study</span><small>Your study companion</small></span></div><div class="nav-title">Your workspace</div><nav aria-label="Main navigation">'+nav(navActive)+'</nav><div class="sidebar-note"><strong>Made for your next step.</strong>Study a little every day. Your progress stays on this device.<button data-view="settings">Backup &amp; settings →</button></div></aside><div class="main"><header class="mobile-header"><div class="brand"><span class="brand-icon">✚</span><span class="brand-name">NAPLEX Study<small>Your study companion</small></span></div><button data-view="search" aria-label="Search lessons">Search</button></header><header class="topbar"><div class="breadcrumb">Your study space &nbsp;/&nbsp; <strong>'+esc(titles[view])+'</strong></div><div class="top-actions"><button class="button text" data-view="search">'+svg('search')+' <span>Search</span></button><span class="top-date">12-week study plan</span><span class="avatar">NS</span></div></header><main class="content">'+content+'</main></div><nav class="mobile-nav" aria-label="Mobile navigation">'+nav(navActive,true)+'</nav></div>';
  }
  function resources(w){return '<div class="panel"><h3>Go deeper</h3><p class="panel-sub">References for this week. Links need an internet connection.</p><div style="height:15px"></div>'+w.sources.map(s=>'<a class="source-link" target="_blank" rel="noopener noreferrer" href="'+esc(s.url)+'">'+esc(s.name)+' ↗<span>Open reference</span></a>').join('')+'<p class="small-note">These original notes are a starting point. Verify evolving recommendations with the current source and drug labeling.</p></div>';}
  function panelTitle(title,sub,extra=''){return '<div class="page-head"><div><div class="eyebrow">Your study space</div><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></div>'+extra+'</div>';}
  function home(){
    const n=nextWeek(),w=week(n),completed=totalDone(),pct=Math.round(completed/60*100),days=daysUntil(),questionCount=DATA.reduce((a,x)=>a+x.questions.length,0),lessonCount=DATA.reduce((a,x)=>a+x.lessons.length,0);
    const dateText=days===null?'Not set':days<0?'Date passed':days===0?'Today':days+' days';
    const previews=DATA.slice(Math.max(0,Math.min(n-1,9)),Math.max(0,Math.min(n-1,9))+3);
    layout(panelTitle('Welcome back','Your NAPLEX preparation, organized one week at a time.','<button class="button secondary" data-view="plan">Explore the plan →</button>')+
      '<div class="dashboard-grid"><div class="primary-column"><section class="hero"><div class="hero-content"><div class="eyebrow">Your next study session</div><h2>Small steps. Stronger confidence.</h2><p>Pick up where you left off with focused lessons, practice questions, and calculations for all 12 weeks.</p><div class="hero-action"><button class="button light" data-open-week="'+n+'">Continue week '+n+' →</button><span>'+esc(w.title)+'</span></div></div></section>'+
      '<div class="stat-grid"><div class="stat-card"><div class="stat-label">Study days complete</div><div class="stat-value">'+completed+' <span style="font-size:12px;font-weight:500;color:#91a19a">/ 60</span></div><div class="stat-foot">Across your 12-week plan</div></div><div class="stat-card"><div class="stat-label">Target exam</div><div class="stat-value">'+esc(dateText)+'</div><div class="stat-foot">'+(state.examDate?esc(prettyDate(state.examDate)):'Add a date in settings')+'</div></div><div class="stat-card"><div class="stat-label">Practice questions</div><div class="stat-value">'+questionCount+'</div><div class="stat-foot">Original questions included</div></div></div>'+
      '<section class="panel"><div class="panel-head"><div><h2>Your study roadmap</h2><p class="panel-sub">Focused, manageable weeks.</p></div><button class="button text" data-view="plan">View all →</button></div>'+previews.map(x=>'<button class="week-preview link-button" data-open-week="'+x.n+'"><span class="number-box">'+String(x.n).padStart(2,'0')+'</span><span><strong>'+esc(x.title)+'</strong><small>'+esc(x.short)+'</small></span><span class="chevron">›</span></button>').join('')+'</section></div>'+
      '<aside class="side-column"><section class="panel"><div class="panel-head"><div><h2>Your progress</h2><p class="panel-sub">Every study day counts.</p></div></div><div class="progress-top"><strong>'+pct+'%</strong><span>'+completed+' of 60 days</span></div><div class="progress-track"><span style="width:'+pct+'%"></span></div><div class="goal-box"><strong>'+esc(w.title)+'</strong><p>Week '+n+' · '+daysDone(n)+' of 5 study days checked off.</p></div></section><section class="panel"><div class="panel-head"><div><h2>In your toolkit</h2><p class="panel-sub">Ready whenever you are.</p></div></div><div class="metric-row"><span class="metric-icon">✦</span><div><strong>'+lessonCount+' study lessons</strong><small>Original review notes</small></div></div><div class="metric-row"><span class="metric-icon">÷</span><div><strong>12 worked calculations</strong><small>Plus calculation drills</small></div></div><div class="metric-row"><span class="metric-icon">✓</span><div><strong>Weekly question sets</strong><small>With explanations</small></div></div></section></aside></div>'+
      '<p class="disclaimer">Independent educational material; not an official NABP product or a comprehensive clinical reference. These summaries have not been independently reviewed by a pharmacist or NABP. Check current guidelines and drug labeling.</p>');
  }
  function plan(){
    layout(panelTitle('Your 12-week plan','A clear path from foundational review to exam day.','<button class="button secondary" data-view="settings">Set exam date</button>')+
      '<div class="week-grid">'+DATA.map(w=>'<button class="week-tile" data-open-week="'+w.n+'"><div class="tile-top"><span class="eyebrow">Week '+String(w.n).padStart(2,'0')+'</span><span class="badge">'+daysDone(w.n)+'/5 days</span></div><h3>'+esc(w.title)+'</h3><p>'+esc(w.short)+'</p><div class="tile-foot"><span>'+(dateRange(w.n)?esc(dateRange(w.n)):'5 study days')+'</span><span>Open week →</span></div></button>').join('')+'</div><p class="disclaimer">The schedule is a starting point, not an exhaustive list of exam content. Adjust the pace to your background and review the full NABP outline.</p>');
  }
  function banner(w){
    return '<div class="week-topline"><button class="back" data-view="plan">← All weeks</button><select class="week-picker" id="week-picker" aria-label="Choose a study week">'+DATA.map(v=>'<option value="'+v.n+'" '+(v.n===w.n?'selected':'')+'>Week '+v.n+' · '+esc(v.title)+'</option>').join('')+'</select></div><div class="week-banner"><div><div class="eyebrow">Week '+String(w.n).padStart(2,'0')+' '+(dateRange(w.n)?' · '+esc(dateRange(w.n)):'')+'</div><h1>'+esc(w.title)+'</h1><p>'+esc(w.description)+'</p></div><span class="week-bubble">'+String(w.n).padStart(2,'0')+'</span></div><div class="tabs" role="tablist" aria-label="Week sections"><button class="tab '+(tab==='lessons'?'active':'')+'" data-tab="lessons" role="tab" aria-selected="'+(tab==='lessons')+'">Lessons</button><button class="tab '+(tab==='schedule'?'active':'')+'" data-tab="schedule" role="tab" aria-selected="'+(tab==='schedule')+'">5-day plan</button><button class="tab '+(tab==='quiz'?'active':'')+'" data-tab="quiz" role="tab" aria-selected="'+(tab==='quiz')+'">Practice</button></div>';
  }
  function lessonCards(w){return w.lessons.map((l,i)=>'<article class="lesson-card"><div class="lesson-title"><span class="lesson-num">'+String(i+1).padStart(2,'0')+'</span><div><h3>'+esc(l.title)+'</h3><small>WEEK '+w.n+' · STUDY NOTES</small></div></div><div class="lesson-body"><p>'+esc(l.intro)+'</p><ul>'+l.points.map(p=>'<li>'+esc(p)+'</li>').join('')+'</ul></div><div class="lesson-footer"><span>'+(state.lessons[w.n+'-'+i]?'Added to your progress':'Review when you are ready')+'</span><button class="check-button '+(state.lessons[w.n+'-'+i]?'done':'')+'" data-lesson="'+i+'">'+(state.lessons[w.n+'-'+i]?'✓ Reviewed':'Mark reviewed')+'</button></div></article>').join('');}
  function mathCard(w){return '<section class="panel worked"><div class="eyebrow">Worked calculation</div><h3>'+esc(w.math.title)+'</h3><p>'+esc(w.math.prompt)+'</p><ol>'+w.math.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol><div class="answer">Answer: '+esc(w.math.answer)+'</div></section>';}
  function schedule(w){return '<section class="panel"><div class="panel-head"><div><h2>Five days, one focus</h2><p class="panel-sub">Check off a day when you finish your study session.</p></div><span class="eyebrow">'+daysDone(w.n)+'/5 complete</span></div>'+w.days.map((day,i)=>'<div class="day-row '+(state.days[w.n+'-'+i]?'checked':'')+'"><input type="checkbox" id="day-'+i+'" data-day="'+i+'" '+(state.days[w.n+'-'+i]?'checked':'')+'><label for="day-'+i+'"><strong>Day '+(i+1)+'</strong>'+esc(day)+'</label></div>').join('')+'<p class="small-note">Suggested daily routine: 25 minutes of calculations, 65 minutes of review, 40 minutes of questions, and 50 minutes reviewing explanations. The built-in set has '+w.questions.length+' questions for this week; use a broader question bank or school resources to meet a larger daily target.</p></section>';}
  function newQuiz(n){
    const randomOrder=()=>[0,1,2,3].map(i=>({i,key:Math.random()})).sort((a,b)=>a.key-b.key).map(x=>x.i);
    quiz={week:n,index:0,selected:null,submitted:false,answers:[],orders:week(n).questions.map(randomOrder),finished:false};
  }
  function quizView(w){
    if(!quiz || quiz.week!==w.n)newQuiz(w.n);
    if(quiz.finished){
      const score=quiz.answers.filter(Boolean).length;
      return '<section class="panel question-panel finished"><div class="eyebrow">Practice complete</div><div class="big">'+score+' / '+w.questions.length+'</div><h2>Nice work on week '+w.n+'</h2><p>Review the explanations and revisit the topics you missed. This short quiz is a learning tool, not a prediction of your NAPLEX result.</p><div class="inline-actions" style="justify-content:center"><button class="button" data-action="restart-quiz">Practice again</button><button class="button secondary" data-tab="lessons">Back to lessons</button></div></section>';
    }
    const q=w.questions[quiz.index], order=quiz.orders[quiz.index];
    const choices=order.map((originalIndex,displayIndex)=>{
      const classes=['choice'];
      if(quiz.selected===originalIndex)classes.push('selected');
      if(quiz.submitted && originalIndex===q.correct)classes.push('correct');
      if(quiz.submitted && originalIndex===quiz.selected && originalIndex!==q.correct)classes.push('wrong');
      return '<button class="'+classes.join(' ')+'" data-choice="'+originalIndex+'" '+(quiz.submitted?'disabled':'')+' aria-pressed="'+(quiz.selected===originalIndex)+'"><span class="letter">'+String.fromCharCode(65+displayIndex)+'</span><span>'+esc(q.options[originalIndex])+'</span></button>';
    }).join('');
    const feedback=quiz.submitted?'<div class="feedback '+(quiz.selected===q.correct?'':'wrong')+'" role="status"><strong>'+(quiz.selected===q.correct?'Correct':'Review this one')+'</strong>'+esc(q.why)+'</div>':'';
    return '<section class="panel question-panel"><div class="q-meta"><span>WEEK '+w.n+' PRACTICE</span><span>Question '+(quiz.index+1)+' of '+w.questions.length+'</span></div><h2>'+esc(q.q)+'</h2><div class="choices">'+choices+'</div>'+feedback+'<div class="quiz-actions"><span>'+(quiz.submitted?'Review the explanation before continuing.':'Select one answer.')+'</span>'+(quiz.submitted?'<button class="button" data-action="next-question">'+(quiz.index===w.questions.length-1?'See results':'Next question →')+'</button>':'<button class="button" data-action="check-answer" '+(quiz.selected===null?'disabled':'')+'>Check answer</button>')+'</div></section>';
  }
  function weekView(){
    const w=week(selectedWeek);
    let inside='';
    if(tab==='lessons')inside='<div class="detail-grid"><div class="detail-main">'+lessonCards(w)+mathCard(w)+'</div><aside class="detail-aside"><div class="panel"><h3>Week at a glance</h3><p class="panel-sub">'+esc(w.short)+'</p><div class="metric-row"><span class="metric-icon">✓</span><div><strong>'+lessonsDone(w.n)+' of '+w.lessons.length+' lessons reviewed</strong><small>Mark each lesson as you go</small></div></div><div class="metric-row"><span class="metric-icon">▦</span><div><strong>'+daysDone(w.n)+' of 5 study days</strong><small>Track your weekly routine</small></div></div><button class="button small" data-tab="quiz">Try this week’s questions →</button></div>'+resources(w)+'</aside></div>';
    if(tab==='schedule')inside='<div class="detail-grid"><div class="detail-main">'+schedule(w)+mathCard(w)+'</div><aside class="detail-aside">'+resources(w)+'</aside></div>';
    if(tab==='quiz')inside='<div class="detail-grid"><div class="detail-main">'+quizView(w)+'</div><aside class="detail-aside"><div class="panel"><h3>Practice to learn</h3><p class="small-note">These '+w.questions.length+' original questions are based on the built-in study notes and include calculation drills. They are not actual NAPLEX items. Answers include explanations.</p><button class="button secondary small" data-action="restart-quiz">Restart quiz</button></div>'+resources(w)+'</aside></div>';
    layout(banner(w)+inside,'plan');
  }
  function practice(){layout(panelTitle('Practice by week','Choose a subject and learn from the explanation after each answer.')+'<div class="week-grid">'+DATA.map(w=>'<button class="week-tile" data-quiz-week="'+w.n+'"><div class="tile-top"><span class="eyebrow">Week '+String(w.n).padStart(2,'0')+'</span><span class="badge">'+(state.scores[w.n]===undefined?w.questions.length+' questions':'Best '+state.scores[w.n]+'/'+w.questions.length)+'</span></div><h3>'+esc(w.title)+'</h3><p>Original questions with answer explanations.</p><div class="tile-foot"><span>'+w.questions.length+' questions</span><span>Start practice →</span></div></button>').join('')+'</div>');}
  function notes(){const w=week(selectedWeek);layout(panelTitle('Your notebook','Capture reminders and the concepts you want to revisit.')+'<div class="detail-grid"><section class="panel"><div class="panel-head"><div><h2>Week '+w.n+' notes</h2><p class="panel-sub">Changes save automatically on this device.</p></div><select class="week-picker" id="notes-picker" aria-label="Choose week for notes">'+DATA.map(x=>'<option value="'+x.n+'" '+(x.n===w.n?'selected':'')+'>Week '+x.n+' · '+esc(x.title)+'</option>').join('')+'</select></div><textarea class="notebook" id="note" aria-label="Your study notes" placeholder="Write what you want to remember…">'+esc(state.notes[w.n]||'')+'</textarea><p class="small-note">Keep your notes general; avoid storing confidential patient information.</p></section><aside class="detail-aside"><div class="panel"><h3>Make notes useful</h3><p class="small-note">Try recording the concept, why you missed it, and a short reminder to revisit it next week.</p><button class="button secondary small" data-view="settings">Export a backup</button></div></aside></div>');}
  function settings(){const secure=location.protocol==='https:';const installText=secure?'On Android, open this app in Chrome, then choose <strong>Install app</strong> or <strong>Add to Home screen</strong> in the browser menu. On a computer, use the install option in your browser if available.':'On your computer, a supported browser can offer an install option for the local app. On Android over a local Wi-Fi address, open it in the browser while the computer is running; independent installation and offline access require a secure hosted connection.';layout(panelTitle('Settings & backup','Set your target date and keep a copy of your progress.')+'<div class="settings-grid"><section class="panel"><h2>Exam date</h2><p class="panel-sub">Add a date to place each study week on your calendar. The final week ends on your exam date.</p><label class="field-label" for="exam-date">Target NAPLEX date</label><input class="settings-input" type="date" id="exam-date" value="'+esc(state.examDate)+'"><p class="small-note">'+(state.examDate?'Your target is '+esc(prettyDate(state.examDate))+'.':'You can change this date whenever your plans change.')+'</p><h3 style="margin-top:22px">Using your devices</h3><p class="small-note">'+installText+'</p>'+(deferredInstall?'<button class="button secondary small" data-action="install">Install this app</button>':'')+'</section><section class="panel"><h2>Progress &amp; backup</h2><p class="panel-sub">Progress and notes are stored in this browser on this device. They do not automatically sync across devices.</p><div class="inline-actions"><button class="button" data-action="export">Export backup</button><button class="button secondary" data-action="choose-import">Import backup</button><input id="backup-file" type="file" accept="application/json,.json" hidden></div><p class="small-note">Export a backup on one device and import it on another to transfer your progress. Import replaces the progress stored on this device.</p><p class="small-note">After a successful online visit, supported secure connections and localhost can cache the built-in content for offline use. External source links require internet access.</p></section></div><p class="disclaimer">Independent study material, not an official NABP product. Content was researched October 28, 2026 and is not automatically updated. Use current primary references and the official NAPLEX outline; these notes are not a complete review.</p>');}
  function search(){
    const q=searchValue.trim().toLowerCase();
    let matches=[];
    if(q)for(const w of DATA)for(const l of w.lessons)if((w.title+' '+l.title+' '+l.intro+' '+l.points.join(' ')).toLowerCase().includes(q))matches.push({w,l});
    layout(panelTitle('Search your lessons','Find a concept across the built-in review notes.')+'<input class="searchbox" id="search-input" type="search" placeholder="Try insulin, anticoagulation, vaccines…" value="'+esc(searchValue)+'" aria-label="Search lessons"><div style="height:18px"></div>'+(q?(matches.length?'<section class="panel"><div class="panel-head"><h2>'+matches.length+' result'+(matches.length===1?'':'s')+'</h2></div>'+matches.map(({w,l})=>'<button class="week-preview link-button" data-open-week="'+w.n+'"><span class="number-box">'+String(w.n).padStart(2,'0')+'</span><span><strong>'+esc(l.title)+'</strong><small>Week '+w.n+' · '+esc(w.title)+'</small></span><span class="chevron">›</span></button>').join('')+'</section>':'<div class="empty">No lessons found. Try a different term.</div>'):'<div class="empty">Search for a topic, medication class or concept.</div>'));
  }
  function render(){({home,plan,week:weekView,practice,notes,settings,search}[view]||home)();}
  function setView(next){view=next;render();window.scrollTo(0,0);}
  function setTab(next){tab=next;view='week';render();window.scrollTo(0,0);}
  function downloadBackup(){
    const payload={app:'NAPLEX Study Companion',version:1,exportedAt:new Date().toISOString(),data:state};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='naplex-study-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  root.addEventListener('click',async event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.view){setView(target.dataset.view);return;}
    if(target.dataset.openWeek){selectedWeek=Number(target.dataset.openWeek);tab='lessons';setView('week');return;}
    if(target.dataset.quizWeek){selectedWeek=Number(target.dataset.quizWeek);newQuiz(selectedWeek);tab='quiz';setView('week');return;}
    if(target.dataset.tab){setTab(target.dataset.tab);return;}
    if(target.dataset.lesson!==undefined){const key=selectedWeek+'-'+target.dataset.lesson;state.lessons[key]=!state.lessons[key];save();render();return;}
    if(target.dataset.choice!==undefined && quiz && !quiz.submitted){quiz.selected=Number(target.dataset.choice);render();return;}
    if(target.dataset.action==='restart-quiz'){newQuiz(selectedWeek);tab='quiz';render();return;}
    if(target.dataset.action==='check-answer' && quiz && quiz.selected!==null){quiz.submitted=true;quiz.answers[quiz.index]=quiz.selected===week(selectedWeek).questions[quiz.index].correct;render();return;}
    if(target.dataset.action==='next-question' && quiz && quiz.submitted){
      if(quiz.index===week(selectedWeek).questions.length-1){quiz.finished=true;const score=quiz.answers.filter(Boolean).length;state.scores[selectedWeek]=Math.max(state.scores[selectedWeek]??0,score);save();}
      else {quiz.index++;quiz.selected=null;quiz.submitted=false;}
      render();return;
    }
    if(target.dataset.action==='export'){downloadBackup();return;}
    if(target.dataset.action==='choose-import'){document.getElementById('backup-file').click();return;}
    if(target.dataset.action==='install' && deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;render();}
  });
  root.addEventListener('change',async event=>{
    const t=event.target;
    if(t.id==='week-picker'){selectedWeek=Number(t.value);quiz=null;render();return;}
    if(t.id==='notes-picker'){selectedWeek=Number(t.value);render();return;}
    if(t.dataset.day!==undefined){state.days[selectedWeek+'-'+t.dataset.day]=t.checked;save();render();return;}
    if(t.id==='exam-date'){state.examDate=t.value;save();render();return;}
    if(t.id==='backup-file' && t.files && t.files[0]){
      try{const raw=JSON.parse(await t.files[0].text());if(raw.app!=='NAPLEX Study Companion'||raw.version!==1||!raw.data||typeof raw.data!=='object')throw new Error('Invalid backup');if(!confirm('Importing will replace progress and notes on this device. Continue?'))return;state=cleanState(raw.data);save();alert('Backup imported.');render();}catch{alert('This file is not a valid NAPLEX Study Companion backup.');}
    }
  });
  root.addEventListener('input',event=>{
    const t=event.target;
    if(t.id==='note'){state.notes[selectedWeek]=t.value;save();}
    if(t.id==='search-input'){const pos=t.selectionStart;searchValue=t.value;search();const el=document.getElementById('search-input');el.focus();if(pos!==null)el.setSelectionRange(pos,pos);}
  });
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;if(view==='settings')render();});
  if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  render();
})();
