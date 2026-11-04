/* In-slide exploration. The outer slide order and transport are retained. */
(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const img=(src,alt)=>`<img src="assets/${src}" alt="${alt}" loading="lazy">`;
const reduce=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
let serial=0;
function explorer(host,labels,panels,{vertical=false}={}){
 const id='explore-'+(++serial), wrap=document.createElement('div');wrap.className='explorer'+(vertical?' explorer-vertical':'');
 const rail=document.createElement('div');rail.className='explore-tabs'+(vertical?'':' glass');rail.setAttribute('role','tablist');rail.setAttribute('aria-label','Explore '+host.closest('.slide').querySelector('h2').textContent);rail.setAttribute('aria-orientation',vertical?'vertical':'horizontal');
 const lens=document.createElement('span');lens.className='tab-lens';rail.append(lens);
 const body=document.createElement('div');body.className='explore-body';
 panels.forEach((panel,i)=>{const b=document.createElement('button');b.type='button';b.id=id+'-tab-'+i;b.setAttribute('role','tab');b.setAttribute('aria-controls',id+'-panel-'+i);b.innerHTML=`<span class="step-index">${String(i+1).padStart(2,'0')}</span><span>${labels[i]}</span><span class="step-arrow" aria-hidden="true">↗</span>`;rail.append(b);panel.classList.add('explore-panel');panel.id=id+'-panel-'+i;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',b.id);body.append(panel);b.onclick=()=>select(i);b.onkeydown=e=>{let n=i;if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%panels.length;else if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i+panels.length-1)%panels.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=panels.length-1;else return;e.preventDefault();e.stopPropagation();select(n);buttons[n].focus();};});
 const buttons=$$('[role=tab]',rail);
 function align(){const b=buttons.find(b=>b.getAttribute('aria-selected')==='true');if(!b)return;lens.style.width=b.offsetWidth+'px';lens.style.height=b.offsetHeight+'px';lens.style.transform=`translate(${b.offsetLeft}px,${b.offsetTop}px)`;}
 function select(n){panels.forEach((p,i)=>{if(i!==n)$$('video,audio',p).forEach(m=>m.pause());p.hidden=i!==n;buttons[i].setAttribute('aria-selected',String(i===n));buttons[i].tabIndex=i===n?0:-1;});align();if(!reduce())panels[n].animate([{opacity:.25,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:200,easing:'ease-out'});}
 wrap.append(rail,body);host.append(wrap);select(0);new ResizeObserver(align).observe(rail);
}
const panel=html=>{const n=document.createElement('div');n.innerHTML=html;return n;};
const content=n=>$('#slide-'+n+' .slide-content');
function group(n,labels,selectors){const host=content(n);const panels=selectors.map(sel=>{const p=panel('');sel.forEach(s=>{const el=$(s,host);if(el)p.append(el);});return p;});host.replaceChildren();explorer(host,labels,panels);}
// Documented prompts: the corrected final PDF supplies the character text.
const sources=content(5);sources.replaceChildren();
const costumeText=documentedPrompts[0].split('\n\n').find(s=>s.startsWith('COSTUME')).replace(/^COSTUME\n/,'');
const charExcerpt=costumeText.split(/(?<=\.) /).filter((_,i)=>[0,2,3].includes(i)).join(' … ');
const locationExcerpt=documentedPrompts[1].split('\n\n').find(s=>s.startsWith('SCENE')).replace(/^SCENE\n/,'');
const promptBox=(title,excerpt,full)=>`<div class="prompt-card"><span class="tag">${title}</span><blockquote>${esc(excerpt)}</blockquote><details><summary>Read the complete documented prompt <span>↗</span></summary><pre>${esc(full)}</pre></details></div>`;
explorer(sources,['Character','Location'],[
 panel(`<div class="source-explorer"><div class="source-visual"><div class="identity-input">${img('nathan-photo-front.jpg','Nathan’s original identity photograph')}<div><span class="tag">IDENTITY INPUT</span><h3>Start with Nathan.</h3><p>His photographs establish the person. The written direction specifies the clothes.</p></div></div><figure>${img('history-scene01-character.png','Nathan character and costume sheet')}<figcaption>Character & costume reference</figcaption></figure></div>${promptBox('COSTUME · FROM THE FINAL DOCUMENT',charExcerpt,documentedPrompts[0])}</div>`),
 panel(`<div class="source-explorer"><figure class="source-visual">${img('history-scene01-corridor.png','Surviving History location reference sheet')}<figcaption><h3>Give the place a clear brief.</h3><p>The prompt specifies the space, daylight, materials and photographic treatment.</p></figcaption></figure>${promptBox('LOCATION · FROM THE FINAL DOCUMENT',locationExcerpt,documentedPrompts[1])}</div>`)
]);
$('#slide-5 h2').textContent='Where did these references come from?';
// Costume: retain the same output, remove the superseded garment-reference story.
const costume=content(7);costume.replaceChildren();
explorer(costume,['Keep the person','Describe the outfit','Use the reference'],[
 panel(`<div class="detail-pair">${img('nathan-photo-front.jpg','Nathan’s identity photograph')}<div><span class="tag">IDENTITY</span><h3>Keep Nathan recognisable.</h3><p>The photographs establish his face, hair and lean build.</p>${promptBox('PROMPT EXCERPT','Ignore the office backgrounds and modern clothing.',documentedPrompts[0])}</div></div>`),
 panel(`<div class="detail-pair">${img('history-scene01-character.png','Nathan in the documented costume')}<div><span class="tag">WRITTEN COSTUME DIRECTION</span><h3>Make the clothing specific.</h3>${promptBox('PROMPT EXCERPT',charExcerpt,documentedPrompts[0])}</div></div>`),
 panel(`<div class="detail-pair">${img('history-nathan-walking-22s.jpg','Nathan walking toward camera in the sequence')}<div><span class="tag">CONTINUITY</span><h3>Carry the choices into the shot.</h3><p>Use the character sheet to guide the same person, clothing and build. Review the result against that reference.</p><div class="choice-line">Face → Clothes → Shot</div></div></div>`)
]);
// Preserve the original blocks; reveal them one at a time instead of stacking.
group(10,['Surviving History','Detection Club'],[['.input-grid','.takeaway'],['.extra-section']]);
group(12,['Refine the image','Handle a change'],[['.comparison','.correction-line'],['.extra-section']]);
// Revisions themselves work as an explorable list.
const changes=$('#slide-12 .change-cards');const changePanels=$$('article',changes);changes.replaceChildren();explorer(changes,['Camera speed','Subject position','Wardrobe'],changePanels,{vertical:true});
// Production stages use Panda’s list-to-panel relationship.
const prod=content(2), ribbon=$('.process-ribbon',prod), stages=$$('div',ribbon);const prodLabels=stages.map(s=>$('strong',s).textContent);ribbon.replaceChildren();explorer(ribbon,prodLabels,stages,{vertical:true});
// Edit and sound: keep all examples, but reveal the relevant part.
const post=content(14), pg=$('.post-grid',post), edit=pg.firstElementChild,sounds=pg.lastElementChild,sourcing=$('.sound-sourcing',post), takeaway=$('.takeaway',post);post.replaceChildren();const soundPanel=panel('');soundPanel.append(sounds,sourcing,takeaway);explorer(post,['Picture & grade','Sound'],[edit,soundPanel]);
// Review: one criterion accompanies the real frame at a time.
const review=$('#slide-11 .review-list'),criteria=$$('div',review);review.replaceChildren();explorer(review,['Person','Action','Place','Artifacts'],criteria);
// Realism is a diagnosis, illustrated with teaching examples rather than claimed production prompts.
const realismData=[
 ['Lighting','Where is the light coming from?','A face is lit from one side, but the room or shadow suggests another. The person and place stop belonging together.','Name the source, direction and softness. Check that shadows, reflections and the subject agree.','Daylight enters through the gate on camera-left. Light the surfaces of Nathan’s face and clothes that face the gate; let the opposite side stay darker. Shadows fall away from the gate.','Light → surface → shadow','<path d="M45 35v100h40V35Z"/><path d="m90 55 115 55M90 85l115 45M90 115l115 35" stroke-dasharray="5 7"/><circle cx="235" cy="100" r="18"/><path d="M235 120v65m0-40-25 20m25-20 25 20m-25 20-17 30m17-30 17 30M40 218h285"/><path d="m250 215 62 0" stroke-width="9"/>'],
 ['Materials','What is the surface made of?','Stone can look like plastic. Linen can look glossy. Repeated dirt and perfect edges make a working space feel manufactured.','Describe the material and how it behaves: roughness, weave, wear and where moisture collects. More detail alone is not more realism.','Rough limestone with irregular mortar joints. Matte, creased linen with visible weave. Only the damp patches catch brighter reflections; dry stone stays dull.','Material → response → wear','<path d="M55 65h230v145H55ZM55 110h230M55 160h230M110 65v45m95-45v45m-50 0v50m90-50v50M100 160v50m105-50v50"/><path d="m67 83 18 3m47 39 12 8m90 48 23-4m-90 14 12 2" stroke-width="4"/>'],
 ['Atmosphere','Does the air belong to the scene?','Uniform fog, unexplained haze or fire with no effect on nearby surfaces can disconnect the atmosphere from its source.','Tie effects to a cause. Fire may add local flicker, rising smoke and occasional embers when appropriate. Keep their scale and direction believable.','The brazier casts a small, warm flicker on nearby stone and cloth. A thin wisp of smoke rises and drifts with the airflow. A few tiny embers lift near the flame, not across the whole corridor.','Source → air → surroundings','<path d="M125 185h90l-15 28h-60ZM145 183c-35-35 25-50 15-90 50 40 48 60 33 90"/><path d="M170 75c-40-25 25-30 0-58m25 70c35-25-5-35 15-57" stroke-dasharray="5 8"/><path d="m115 145-38-15m145 15 38-15m-140 40-45 8m150-8 40 8"/>'],
 ['Physics & contact','Does it have weight and contact?','A foot floats, a hand misses what it holds, or cloth and liquid move without weight. Missing contact shadows can make objects look pasted in.','Watch the movement, not just the still. Check gravity, weight, collisions and contact shading—the small darkening where surfaces meet.','The sandal plants firmly on the stone, with a small contact shadow beneath it. Weight shifts before the next step. Loose cloth settles under gravity; splash droplets fall and collect on the floor.','Weight → contact → reaction','<path d="m145 35-10 100 15 35 65 15v20H105v-30l-5-40 15-100M55 223h240"/><path d="M110 210h100" stroke-width="8"/><path d="M255 60v75m-10-13 10 13 10-13M65 75v60m-10-13 10 13 10-13"/>']
];
explorer($('#realism-explorer'),realismData.map(r=>r[0]),realismData.map(([label,title,wrong,check,prompt,caption,drawing])=>panel(`<div class="realism-grid"><div><svg class="realism-diagram" viewBox="0 0 340 250" role="img" aria-label="Illustrative diagram: ${caption}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg><p class="realism-caption">${caption}</p></div><div class="realism-diagnosis"><h3>${title}</h3><span class="tag">WHAT BREAKS THE ILLUSION</span><p>${wrong}</p><span class="tag">WHAT TO CHECK</span><p>${check}</p></div></div><div class="prompt-card realism-prompt"><span class="tag">EXAMPLE CORRECTION</span><blockquote>${prompt}</blockquote></div>`)));
$('#slide-13').dataset.palette='teal';
// Colour provides orientation without painting every surface purple.
const palettes={2:'midnight',4:'midnight',5:'plum',6:'plum',7:'plum',9:'teal',10:'midnight',11:'teal',12:'amber',13:'teal',14:'teal'};
Object.entries(palettes).forEach(([n,p])=>$('#slide-'+n).dataset.palette=p);
// Functional glass sits on controls, never on the prompt text or image.
if(window.liquidGlass&&!matchMedia('(prefers-reduced-transparency:reduce),(prefers-contrast:more)').matches)$$('.explore-tabs.glass').forEach(el=>window.liquidGlass(el,{scale:-50,chroma:2,blur:0,fallbackBlur:0,saturate:1.08,border:.055}));
// Move the existing transport using its counter; no buttons or dimensions change.
const nav=$('.transport'),grip=$('#counter');grip.classList.add('nav-grip');grip.tabIndex=0;grip.setAttribute('role','button');grip.setAttribute('aria-label','Move slide controls. Drag, or use arrow keys. Home resets.');grip.title='Drag to move · arrow keys to move · double-click to reset';
let drag=null,position=null;
function move(x,y){const r=nav.getBoundingClientRect();position={x:Math.max(8,Math.min(innerWidth-r.width-8,x)),y:Math.max(8,Math.min(innerHeight-r.height-8,y))};nav.style.position='fixed';nav.style.left=position.x+'px';nav.style.top=position.y+'px';nav.style.margin='0';}
function reset(){position=null;['position','left','top','margin'].forEach(p=>nav.style.removeProperty(p));}
grip.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=nav.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top,id:e.pointerId};grip.setPointerCapture(e.pointerId);nav.classList.add('dragging');e.preventDefault();});
grip.addEventListener('pointermove',e=>{if(drag&&e.pointerId===drag.id)move(e.clientX-drag.x,e.clientY-drag.y);});
function stop(){drag=null;nav.classList.remove('dragging');}
grip.addEventListener('pointerup',stop);grip.addEventListener('pointercancel',stop);grip.addEventListener('lostpointercapture',stop);grip.addEventListener('dblclick',reset);
grip.addEventListener('keydown',e=>{const delta={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]}[e.key];if(delta){e.preventDefault();e.stopPropagation();const r=nav.getBoundingClientRect();move(r.left+delta[0],r.top+delta[1]);}else if(e.key==='Home'||e.key==='Enter'){e.preventDefault();e.stopPropagation();reset();}});addEventListener('resize',()=>{if(position)move(position.x,position.y);});
})();
