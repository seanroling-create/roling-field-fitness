let program=[],tab='workout',week=Number(localStorage.getItem('roling-week')||1),session=Number(localStorage.getItem('roling-session')||1);const main=document.querySelector('#main');const $=id=>document.getElementById(id);const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};let logs=get('roling-logs',{}),completed=get('roling-completed',{}),userNotes=get('roling-notes',''),baseline=get('roling-baselines',{'3RM Deadlift':'340','HRPU':'50','SDC':'1:45','Plank':'3:20','2-mile Run':'15:00'});const save=()=>{localStorage.setItem('roling-logs',JSON.stringify(logs));localStorage.setItem('roling-completed',JSON.stringify(completed));localStorage.setItem('roling-notes',JSON.stringify(userNotes));localStorage.setItem('roling-baselines',JSON.stringify(baseline))};const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const definitions=[['Mr. Spectacular','2-hand kettlebell clean and press; set down, walk hands out to a push-up, perform the push-up, walk back.'],['Craig Special','Hang squat clean followed by a front squat.'],['Man Maker','Dumbbell push-up, row right, row left, dumbbell clean and press.'],['Scotty Bob','From front leaning rest on dumbbells: push-up, row right, push-up, row left.'],['Slasher','Controlled diagonal dumbbell chopping pattern, alternating sides.'],['Ankle to Bar','Hang from a pull-up bar; raise legs toward bar with control.'],['Shoulder Dislocates','Use a wide grip on a band or dowel; sweep straight arms overhead and behind in a comfortable range.'],['Instep Stretch','Deep lunge with hands near the inside of the lead foot, gently mobilize hips.'],['3rd World Stretch','Supported deep squat hold with heels grounded as tolerated.'],['HRPU','Hand-release push-up with chest to ground and hands briefly lifted each rep.'],['SDC','Sprint-drag-carry: 50 m sprint, 50 m sled drag, 50 m lateral shuffle, 50 m carry, 50 m sprint.'],['Deadlift','Brace torso, hinge at hips, maintain neutral back, stand tall with controlled lockout.'],['Front Bridge','Forearm plank with neutral body alignment.'],['Power Clean','Explosive floor-to-shoulder barbell clean; receive securely with elbows through.'],['Face Down Back Extension','Lie prone and lift chest slightly by extending through hips and back without hyperextending.'],['Goblet Squat','Hold weight at chest; squat between hips with stable foot pressure.'],['Push Press','Small vertical dip and powerful leg drive to press weight overhead.'],['Military Press','Strict overhead press without leg drive.'],['Renegade','Plank-based dumbbell push-up and row movement.'],['Lateral Shuffle','Sideways shuttle without crossing feet; change lead side at turn.'],['Farmer Carry','Walk briskly with loaded implements at sides and torso upright.'],['Plank','Maintain straight line from head to heels while bracing abdomen and glutes.']];
function findDef(t){let x=definitions.find(([n])=>t.toLowerCase().includes(n.toLowerCase()));return x||null}function demo(t){return 'https://www.youtube.com/results?search_query='+encodeURIComponent(t+' exercise proper technique demonstration')}function key(w,s,b,i){return `${w}-${s}-${b}-${i}`}function classify(t){let names=['Mr. Spectacular','Craig Special','Man Maker','Scotty Bob','Deadlift','Bench Press','Front Squat','Back Squat','Box Squat','Military Press','Push Press','Power Clean','DB Lunge','Walking DB Lunge','DB Thruster','Goblet Squat','DB Slasher','Farmer Carry','Biceps Curl','Tricep Extension','Pullup','Chinup'];return names.find(n=>t.toLowerCase().includes(n.toLowerCase()))||null}
function extractSets(t){let m=t.match(/(?:^|\s)(\d+)\s*x\s*(\d+)/i);return m?Math.min(12,Number(m[1])):1}
function lineKind(line){
 const t=line.trim();
 if(/^(?:complete sequence|out\/back\)|running paces\.|between rounds\.|and back\.|to standing\.)/i.test(t))return 'continuation';
 if(/^(?:For full official|Next week:|Use |After Week|One complete|These are|Official |Note:)/i.test(t)||/^(?:Mr\. Spectacular|Craig Special|Renegade Man Maker|Man Maker|Scotty Bob|SDC PARTIAL|SDC FULL):/i.test(t))return 'note';
 if(/^Rest\b/i.test(t))return 'instruction';
 return 'exercise';
}
function blockHTML(b,bi){return `<section class="card workout-section"><h3 class="${/^(Warm Up|Training)$/i.test(b.title)?'section-heading':'subsection-heading'}">${esc(b.title)}</h3>${b.lines.map((line,i)=>{let id=key(week,session,bi,i),d=findDef(line),ex=classify(line),l=logs[id]||{},reps=extractSets(line);let control=ex?`<div class="inputline"><label class="muted">${esc(ex)} · set weight (lb)</label><input aria-label="${esc(ex)} weight" type="number" inputmode="decimal" min="0" step="5" value="${esc(l.weight??'')}" data-log="${id}" data-ex="${esc(ex)}" placeholder="lb"><button class="mini" data-addset="${id}" data-ex="${esc(ex)}">+ set</button></div>${(l.sets||[]).map((v,j)=>`<div class="inputline"><label>Set ${j+2} weight</label><input type="number" inputmode="decimal" min="0" step="5" value="${esc(v)}" data-extra="${id}" data-idx="${j}"><button class="mini remove-set" data-removeset="${id}" data-idx="${j}" aria-label="Remove set ${j+2}" title="Remove this set">✕ Remove</button></div>`).join('')}`:'';let timed=/\b(sec|seconds|minute|minutes|\bmin\b|\b800m\b|\b400m\b|\b200m\b|for time|SDC|plank|bridge|run|shuttle|AMRAP)\b/i.test(line);if(bi===0 && i===0 && /^\s*\d+\s+Rounds?\s*$/i.test(line))return `<h4 class="subsection-heading warmup-rounds">${esc(line)}</h4>`;return `<div class="line ${lineKind(line)==="exercise"?"exercise-item":lineKind(line)==="continuation"?"continuation-item":"instruction-item"}">${lineKind(line)==="exercise"?`<span class="exercise-bullet" aria-hidden="true">•</span>`:""}${esc(line)} ${d?`<a class="exerciseLink" href="${demo(d[0])}" target="_blank" rel="noopener">Demo</a> <button class="mini" data-desc="${esc(d[0])}">?</button>`:''}${timed?`<button class="mini" data-timer="${esc(line)}">◷</button>`:''}</div>${control}`}).join('')}</section>`}
function renderWorkout(){let item=program.find(x=>x.week===week&&x.session===session);main.innerHTML=`<h2>Today's training</h2><div class="weekbar">${Array.from({length:8},(_,i)=>`<button class="${week===i+1?'active':''}" data-week="${i+1}">W${i+1}</button>`).join('')}</div><div class="weekbar">${['Mon · 1','Tue · 2','Thu · 3','Fri · 4','Sat · 5'].map((x,i)=>`<button class="${session===i+1?'active':''}" data-session="${i+1}">${x}</button>`).join('')}</div><div class="card"><div class="eyebrow">CYCLE 1 · WEEK ${week} · SESSION ${session}</div><h2>${['Complex strength','SDC + core + easy run','Barbell + HRPU + intervals','Power + conditioning','Aerobic running'][session-1]}</h2><p class="muted">Target: 45–60 min. Wednesday and Sunday are recovery days. Use the original prescriptions below.</p><label><input class="check" type="checkbox" id="complete" ${completed[`${week}-${session}`]?'checked':''}> Session completed</label></div>${item.blocks.map(blockHTML).join('')}<div class="card workout-section"><h3 class="section-heading">Session Notes</h3><textarea id="session-note" placeholder="How did the session feel? Technique, effort, substitutions...">${esc((logs[`${week}-${session}-note`]||{}).text||'')}</textarea></div><p class="notice">Weights entered are stored on this device. For multiple sets, use “+ set”; your highest logged load for each exercise updates Records automatically. External demo links open YouTube search results, not individually verified videos.</p>`}
function workoutLocation(k){let m=/^(\d+)-(\d+)-(\d+)-(\d+)$/.exec(k);if(!m)return k;let w=Number(m[1]),day=Number(m[2]),block=Number(m[3]);let item=program.find(x=>x.week===w&&x.session===day);let title=item?.blocks?.[block]?.title||'Exercise';return `Week ${w} · ${['Mon','Tue','Thu','Fri','Sat'][day-1]||'Session '+day} · ${title}`}function records(){let by={};Object.entries(logs).forEach(([k,v])=>{if(v.exercise){let vals=[v.weight,...(v.sets||[])].map(Number).filter(n=>Number.isFinite(n)&&n>0);if(vals.length){let max=Math.max(...vals);if(!by[v.exercise]||max>by[v.exercise].value)by[v.exercise]={value:max,key:k}}}});let tests=['3RM Deadlift','HRPU','SDC','Plank','2-mile Run'];main.innerHTML=`<h2>Personal records</h2><p class="muted">Best entered weights update automatically. AFT results are entered separately below; the best is selected by event type.</p><div class="grid">${Object.entries(by).sort((a,b)=>a[0].localeCompare(b[0])).map(([n,v])=>`<div class="stat"><small>${esc(n)}</small><b>${v.value} lb</b><small>${esc(workoutLocation(v.key))}</small></div>`).join('')||'<p>No weights logged yet.</p>'}</div><h2>AFT event records</h2>${tests.map(n=>{let entries=(get('roling-tests',{})[n]||[]);let best=entries.slice().sort((a,b)=>{let val=x=>x.includes(':')?Number(x.split(':')[0])*60+Number(x.split(':')[1]):Number(x);return ['SDC','2-mile Run'].includes(n)?val(a.value)-val(b.value):val(b.value)-val(a.value)})[0];return `<div class="card"><div class="row"><div><b>${n}</b><div class="muted">Starting: ${esc(baseline[n]||'—')} · Best: ${esc(best?.value||'—')}</div></div><button data-test="${esc(n)}">+ Result</button></div></div>`}).join('')}<p class="notice">Personal records reflect entered data, not independently verified official AFT scores. Weight PRs are highest logged training loads regardless of reps.</p>`}
let timerMode='stopwatch',timerSeconds=90,timerRunning=false,timerStart=0,timerElapsed=0,timerTick=null,timerLabel='';function currentMs(){return timerElapsed+(timerRunning?performance.now()-timerStart:0)}function fmt(ms){let v=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(v/60)).padStart(2,'0')}:${String(v%60).padStart(2,'0')}`}function timerPage(){main.innerHTML=`<h2>Workout timer</h2><div class="card"><div class="row"><button data-mode="stopwatch" class="${timerMode==='stopwatch'?'active':''}">Stopwatch</button><button data-mode="countdown" class="${timerMode==='countdown'?'active':''}">Countdown</button></div><p class="muted">${esc(timerLabel||'Time an exercise, interval, plank, or rest period.')}</p><div class="timer" id="clock">00:00</div><div class="timercontrols"><button class="primary" id="timer-start">${timerRunning?'Pause':'Start'}</button><button id="timer-reset">Reset</button><button id="timer-save">Save time</button></div><div class="row" style="margin-top:20px"><label>Countdown seconds</label><input id="timer-seconds" type="number" min="1" max="7200" value="${timerSeconds}"></div><div class="weekbar">${[30,45,60,75,90,105,120,180,300].map(v=>`<button data-preset="${v}">${v}s</button>`).join('')}</div></div><div class="card"><h3>Recent timed results</h3>${(get('roling-times',[]).slice(-10).reverse()).map(x=>`<div class="line">${esc(x.date)} · ${esc(x.label)} · <b>${esc(x.time)}</b></div>`).join('')||'No timed results yet.'}</div>`;refreshClock()}
function refreshClock(){let el=$('clock');if(!el)return;let ms=currentMs();el.textContent=fmt(timerMode==='countdown'?timerSeconds*1000-ms:ms);if(timerMode==='countdown'&&timerRunning&&ms>=timerSeconds*1000){timerRunning=false;timerElapsed=timerSeconds*1000;el.textContent='00:00';if(navigator.vibrate)navigator.vibrate([200,100,200]);$('timer-start').textContent='Start'}}function startTimer(){if(timerRunning){timerElapsed=currentMs();timerRunning=false}else{if(timerMode==='countdown'&&timerElapsed>=timerSeconds*1000)timerElapsed=0;timerStart=performance.now();timerRunning=true}timerPage()}
function notesPage(){main.innerHTML=`<h2>Training notes & guidance</h2><div class="card"><h3>Purpose</h3><p>Five training sessions each week, 45–60 minutes, with three running exposures. Preserve original Roling complexes, sled work, barbell strength, burpees, carries, pull-ups, and running. Prioritize long-term strength, health, and athleticism.</p></div><div class="card"><h3>Training rules</h3><p>Most working strength sets: RPE 7–8, leaving about 2–3 good reps in reserve. Keep explosive lifts crisp. Easy runs: conversational RPE 3–4. Weeks 4 and 8 are lighter. Trim accessories before primary work if short on time. Rest Wednesday and Sunday.</p><p>Percentages refer to estimated 1RM, not your 340 lb three-rep max. Full AFT testing may take longer than one hour.</p></div><div class="card"><h3>Repeating the cycle</h3><p>After Week 8, restart Week 1 using adjusted working weights and run paces. Add 5–10 lb to appropriate barbell loads only when technique and recovery support it. Improve intervals gradually (about 2–5 seconds per 400 m when comfortable). Reduce Friday conditioning by 25–40% if fatigue accumulates.</p><p>Alternate maximal AFT assessments with submaximal checks; consider a full test every 16 weeks when no official test is imminent. Do not pursue PRs in every event each cycle.</p></div><div class="card"><h3>SDC & AFT reference</h3><p><b>3-rep deadlift:</b> Official test uses a hex bar; three technically valid consecutive repetitions with the prescribed equipment and rules. Straight-bar training results are not directly equivalent.</p><p><b>HRPU:</b> Two-minute hand-release push-up event. Lower to ground, release hands as specified, return to front leaning rest; only valid repetitions count.</p><p><b>SDC:</b> Start prone, sprint 25 m out and back (50 m), drag 90 lb sled 25 m out and back (50 m), lateral shuffle 25 m out and back (50 m), carry two 40 lb kettlebells 25 m out and back (50 m), then sprint 25 m out and back (50 m). Total 250 m. Use correct lane, turnaround and handling rules from current official instructions.</p><p><b>Plank:</b> Timed forearm plank maintaining required body position until termination or scoring cap.</p><p><b>2-mile run:</b> Timed two-mile run on an approved measured course after preceding events.</p><p class="notice">These are training summaries, not authoritative test administration instructions. Verify current Army AFT rules, scoring tables, and rest periods before an official test.</p></div><div class="card"><h3>Original movement descriptions</h3>${definitions.map(([n,d])=>`<details class="block"><summary>${esc(n)} <a class="exerciseLink" href="${demo(n)}" target="_blank" rel="noopener">Demo</a></summary><p>${esc(d)}</p></details>`).join('')}</div><div class="card"><h3>Your notes</h3><textarea id="global-notes" placeholder="Recovery observations, equipment settings, goals, adjustments...">${esc(userNotes)}</textarea></div>`}
function settings(){main.innerHTML=`<h2>Data & installation</h2><div class="card"><h3>Save your training history</h3><p>All entries are stored locally in this browser on this device. Export regularly; deleting site data or switching devices will not transfer records automatically.</p><div class="row"><button id="export">Export backup</button><label class="button" for="import">Import backup</label><input class="hide" id="import" type="file" accept="application/json"></div></div><div class="card"><h3>Install on phone</h3><p>Host this folder over HTTPS. On iPhone, open in Safari and choose Share → Add to Home Screen. On Android, open in Chrome and choose Install app or Add to Home Screen. Once installed and first loaded, the app works offline, except external demo links.</p><p class="muted">Opening index.html directly from a downloaded ZIP does not enable full offline installation or service worker support.</p></div><div class="card"><h3>Cycle controls</h3><button id="restart">Return to Week 1</button><p class="muted">Does not erase records.</p></div><div class="card"><h3>Backup caution</h3><p>Import replaces existing local workout logs, notes, event results, and completion markers. Export before importing.</p></div>`}
function render(){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));if(tab==='workout')renderWorkout();else if(tab==='records')records();else if(tab==='timer')timerPage();else if(tab==='notes')notesPage();else settings()}
document.addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;if(b.dataset.tab){tab=b.dataset.tab;render()}else if(b.dataset.week){week=+b.dataset.week;localStorage.setItem('roling-week',week);render()}else if(b.dataset.session){session=+b.dataset.session;localStorage.setItem('roling-session',session);render()}else if(b.dataset.desc){let d=definitions.find(x=>x[0]===b.dataset.desc);alert(d?`${d[0]}\n\n${d[1]}`:'Description unavailable')}else if(b.dataset.addset){let id=b.dataset.addset;logs[id]??={exercise:b.dataset.ex};logs[id].sets??=[];logs[id].sets.push('');save();render()}else if(b.dataset.removeset){let id=b.dataset.removeset,idx=Number(b.dataset.idx);if(logs[id]&&Array.isArray(logs[id].sets)&&idx>=0&&idx<logs[id].sets.length){logs[id].sets.splice(idx,1);save();render()}}else if(b.dataset.timer){timerLabel=b.dataset.timer;timerMode=/rest|sec|minute|plank|bridge/i.test(timerLabel)?'countdown':'stopwatch';timerElapsed=0;timerRunning=false;tab='timer';render()}else if(b.dataset.test){let n=b.dataset.test,v=prompt(`Enter ${n} result (lb, reps, or mm:ss):`);if(v===null||!v.trim())return;v=v.trim();if(!/^(\d+(?:\.\d+)?|\d+:\d{1,2})$/.test(v)){alert('Use a number or mm:ss.');return}let t=get('roling-tests',{});t[n]??=[];t[n].push({value:v,date:new Date().toISOString().slice(0,10)});localStorage.setItem('roling-tests',JSON.stringify(t));render()}else if(b.dataset.mode){timerMode=b.dataset.mode;timerElapsed=0;timerRunning=false;render()}else if(b.dataset.preset){timerSeconds=+b.dataset.preset;timerMode='countdown';timerElapsed=0;timerRunning=false;render()}else if(b.id==='timer-start')startTimer();else if(b.id==='timer-reset'){timerElapsed=0;timerRunning=false;render()}else if(b.id==='timer-save'){let time=fmt(currentMs());let list=get('roling-times',[]);list.push({date:new Date().toISOString().slice(0,10),label:timerLabel||'Stopwatch',time});localStorage.setItem('roling-times',JSON.stringify(list));timerElapsed=currentMs();timerRunning=false;render()}else if(b.id==='export'){let data={logs,completed,userNotes,baseline,tests:get('roling-tests',{}),times:get('roling-times',[])};let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='roling-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}else if(b.id==='restart'){week=1;session=1;localStorage.setItem('roling-week',week);localStorage.setItem('roling-session',session);tab='workout';render()}});
document.addEventListener('input',e=>{let t=e.target;if(t.dataset.log){let id=t.dataset.log;logs[id]??={};logs[id].exercise=t.dataset.ex;logs[id].weight=t.value;save()}else if(t.dataset.extra){logs[t.dataset.extra].sets[+t.dataset.idx]=t.value;save()}else if(t.id==='session-note'){logs[`${week}-${session}-note`]={text:t.value};save()}else if(t.id==='global-notes'){userNotes=t.value;save()}else if(t.id==='timer-seconds'){timerSeconds=Math.max(1,Number(t.value)||90);timerElapsed=0;timerRunning=false}});document.addEventListener('change',async e=>{let t=e.target;if(t.id==='complete'){completed[`${week}-${session}`]=t.checked;save()}else if(t.id==='import'&&t.files?.[0]){try{let d=JSON.parse(await t.files[0].text());if(!d.logs||!d.completed||!confirm('Replace all existing saved workout data?'))return;logs=d.logs;completed=d.completed;userNotes=d.userNotes||'';baseline=d.baseline||baseline;localStorage.setItem('roling-tests',JSON.stringify(d.tests||{}));localStorage.setItem('roling-times',JSON.stringify(d.times||[]));save();render();alert('Backup imported')}catch(err){alert('Invalid backup file')}}});setInterval(refreshClock,150);fetch('program.json').then(r=>r.json()).then(x=>{program=x;render()}).catch(()=>{main.innerHTML='<div class="card">Could not load program data. Open the app from a web server or installed home-screen app.</div>'});if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});

// Version 6: cleaner exercise layout
function blockHTML(b, bi) {
  return `<section class="card workout-section">
    <h3 class="${/^(Warm Up|Training)$/i.test(b.title)
      ? 'section-heading' : 'subsection-heading'}">${esc(b.title)}</h3>
    ${b.lines.map((line, i) => {
      const id = key(week, session, bi, i);
      const kind = lineKind(line);
      const heading = /^\s*(?:\d+\s*(?:Rounds?|Sets?)|(?:\d+\)\s*)?\d+\s*Rounds?)\s*$/i.test(line);
      if (heading) return `<h4 class="subsection-heading">${esc(line)}</h4>`;

      const stretch = /\b(stretch|dislocates|mobility|mobilization|foam roll|cool.?down)\b/i.test(line);
      const active = kind === 'exercise' && !stretch;
      const ex = active ? classify(line) : null;
      const d = active ? findDef(line) : null;
      const timed = active && /\b(sec|seconds|minute|minutes|min|800m|400m|200m|for time|SDC|plank|bridge|run|shuttle|AMRAP)\b/i.test(line);
      const l = logs[id] || {};

      const controls = active ? `
        <div class="v6-actions">
          ${d ? `<a class="exerciseLink" href="${demo(d[0])}"
            target="_blank" rel="noopener">Demo</a>
            <button class="mini" data-desc="${esc(d[0])}">?</button>` : ''}
          ${timed ? `<button class="mini" data-timer="${esc(line)}">◷ Timer</button>` : ''}
        </div>` : '';

      const weights = ex ? `
        <div class="inputline">
          <label class="muted">${esc(ex)} · weight (lb)</label>
          <input type="number" inputmode="decimal" min="0" step="5"
            value="${esc(l.weight ?? '')}" data-log="${id}"
            data-ex="${esc(ex)}" placeholder="lb">
          <button class="mini" data-addset="${id}"
            data-ex="${esc(ex)}">+ set</button>
        </div>
        ${(l.sets || []).map((v, j) => `
          <div class="inputline">
            <label>Set ${j + 2}</label>
            <input type="number" inputmode="decimal" min="0" step="5"
              value="${esc(v)}" data-extra="${id}" data-idx="${j}">
            <button class="mini remove-set" data-removeset="${id}"
              data-idx="${j}">✕ Remove</button>
          </div>`).join('')}` : '';

      return `<div class="v6-exercise ${active ? 'exercise-item' : 'instruction-item'}">
        <div class="v6-description">${active ? '<span class="exercise-bullet">•</span> ' : ''}${esc(line)}</div>
        ${controls}
        ${weights}
      </div>`;
    }).join('')}
  </section>`;
}

// Version 6: remove dashed separators and keep controls below text
const v6style = document.createElement('style');
v6style.textContent = `
  .v6-exercise {
    border: 0 !important;
    border-bottom: 0 !important;
    border-top: 0 !important;
    border-style: none !important;
    padding: 9px 0;
  }
  .v6-description {
    display: block;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  .v6-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 5px 0 0 15px;
  }
  .v6-exercise .inputline {
    margin-top: 6px;
  }
  .v6-exercise input[type="number"] {
    max-width: 78px;
  }
`;
document.head.appendChild(v6style);

// Version 6.1: restore exercise bullets and remove dashed lines
function fixWorkoutFormatting() {
  document.querySelectorAll('.v6-exercise').forEach(item => {
    const description = item.querySelector('.v6-description');
    if (!description) return;

    const text = description.textContent.trim().replace(/^•\s*/, '');
    const isRest = /^Rest\b/i.test(text);
    const isInstruction = /^(?:For full official|Next week:|Use |After Week|One complete|These are|Official |Note:|Complete sequence|Running paces\.|Between rounds\.)/i.test(text);

    if (!isRest && !isInstruction) {
      item.classList.add('exercise-item');
      item.classList.remove('instruction-item');
      if (!description.querySelector('.exercise-bullet')) {
        const bullet = document.createElement('span');
        bullet.className = 'exercise-bullet';
        bullet.textContent = '•';
        bullet.setAttribute('aria-hidden', 'true');
        description.prepend(bullet, ' ');
      }
    }
  });
}

const v61style = document.createElement('style');
v61style.textContent = `
  .v6-exercise,
  .v6-exercise .inputline,
  .v6-exercise .v6-description,
  .v6-exercise .v6-actions {
    border: none !important;
    border-top: none !important;
    border-bottom: none !important;
    box-shadow: none !important;
  }
  .v6-exercise.exercise-item .v6-description {
    color: inherit !important;
    opacity: 1 !important;
  }
`;
document.head.appendChild(v61style);

const originalRenderWorkoutV61 = renderWorkout;
renderWorkout = function() {
  originalRenderWorkoutV61();
  fixWorkoutFormatting();
};
fixWorkoutFormatting();

// Version 6.2: join split descriptions and hide redundant SDC note
function tidyWorkoutDescriptions() {
  document.querySelectorAll('.workout-section').forEach(section => {
    const items = Array.from(section.querySelectorAll('.v6-exercise'));

    items.forEach(item => {
      if (!item.isConnected) return;

      const desc = item.querySelector('.v6-description');
      if (!desc) return;

      const text = desc.textContent.trim().replace(/^•\s*/, '');

      // Hide the redundant SDC reference.
      if (/^For full official SDC sequence\b/i.test(text)) {
        item.remove();
        return;
      }

      // Join a continuation to the preceding exercise or note.
      const continuation =
        /^(?:complete sequence\s*=|running paces\b)/i.test(text);

      if (!continuation) return;

      const previous = item.previousElementSibling;
      if (!previous || !previous.classList.contains('v6-exercise')) return;

      const previousDesc = previous.querySelector('.v6-description');
      if (!previousDesc) return;

      previousDesc.append(
        document.createTextNode(' ' + text)
      );

      item.remove();
    });

    // Join "One" with "complete sequence = 1 rep."
    // The previous loop handles the continuation without
    // changing any saved workout data.
  });
}

const previousRenderWorkoutV62 = renderWorkout;
renderWorkout = function() {
  previousRenderWorkoutV62();
  tidyWorkoutDescriptions();
};

tidyWorkoutDescriptions();

// Version 6.3: fix explanatory notes and SDC layout
function refineWorkoutLayoutV63() {
  document.querySelectorAll('.workout-section').forEach(section => {
    const items = Array.from(
      section.querySelectorAll('.v6-exercise')
    );

    items.forEach(item => {
      if (!item.isConnected) return;

      const desc = item.querySelector('.v6-description');
      if (!desc) return;

      const text = desc.textContent
        .trim()
        .replace(/^•\s*/, '');

      // Explanations of named complexes are notes,
      // not additional exercise requirements.
      if (/^(?:Mr\. Spectacular|Craig Special|Man Maker|Renegade Man Maker|Scotty Bob)\s*:/i.test(text)) {
        item.classList.remove('exercise-item');
        item.classList.add('instruction-item', 'v63-note');

        desc.querySelector('.exercise-bullet')?.remove();
        item.querySelector('.v6-actions')?.remove();
        item.querySelectorAll('.inputline').forEach(el => el.remove());
      }

      // Keep the entire SDC description before its controls.
      if (/^SDC PARTIAL\b/i.test(text)) {
        const next = item.nextElementSibling;
        const nextDesc = next?.querySelector('.v6-description');
        const nextText = nextDesc?.textContent
          .trim()
          .replace(/^•\s*/, '') || '';

        if (/^out\/back\)/i.test(nextText)) {
          desc.append(document.createTextNode(' ' + nextText));
          next.remove();
        }
      }
    });
  });
}

const v63style = document.createElement('style');
v63style.textContent = `
  .v63-note .v6-description {
    color: #a5b4bd !important;
    opacity: 1 !important;
    font-size: 0.94em;
    line-height: 1.5;
  }
  .v63-note {
    padding-top: 4px;
    padding-bottom: 8px;
  }
`;
document.head.appendChild(v63style);

const previousRenderWorkoutV63 = renderWorkout;
renderWorkout = function() {
  previousRenderWorkoutV63();
  refineWorkoutLayoutV63();
};

refineWorkoutLayoutV63();
