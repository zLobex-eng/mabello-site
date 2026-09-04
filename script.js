(()=>{
 const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
 const body=document.body, intro=$('#intro'), introCount=$('#introCount'), introLine=$('#introLine');
 body.classList.add('intro-lock');
 if(!reduce){
   let n=0; const timer=setInterval(()=>{ n=Math.min(100,n+Math.ceil((100-n)*.12)+1); introCount.textContent=String(n).padStart(2,'0'); introLine.style.width=n+'%'; if(n>=100){clearInterval(timer); setTimeout(()=>{intro.classList.add('out');body.classList.remove('intro-lock')},180)} },36);
 }else{intro.style.display='none';body.classList.remove('intro-lock')}

 const topbar=$('#topbar'), progress=$('#scrollProgress'), backTop=$('#backTop'), menuBtn=$('#menuBtn'), mobileNav=$('#mobileNav');
 let lastY=scrollY, ticking=false;
 function update(){
   const y=scrollY, max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
   progress.style.width=Math.min(100,y/max*100)+'%'; topbar.classList.toggle('scrolled',y>20); backTop.classList.toggle('show',y>innerHeight*.7);
   if(y>260 && y>lastY+8 && !mobileNav.classList.contains('open')) topbar.classList.add('hidden'); else if(y<lastY-6||y<260) topbar.classList.remove('hidden'); lastY=y;
   if(!reduce){
     const hero=$('.hero'), sym=$('.hero-symbol'); if(hero&&y<hero.offsetHeight*1.15){const p=Math.min(1,y/hero.offsetHeight); if(sym) sym.style.transform=`translateY(${p*42}px) rotate(${p*8}deg)`}
     const st=$('.statement'), bg=$('#statementBg'), orb=$('#statementOrb'); if(st&&bg&&orb){const r=st.getBoundingClientRect(), p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height))); bg.style.transform=`translateX(${(p-.5)*-18}vw)`; orb.style.transform=`translateY(${(p-.5)*-34}px) rotate(${(p-.5)*6}deg)`}
     updateHorizontal();
   }
   ticking=false;
 }
 addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true}); addEventListener('resize',update,{passive:true});

 // Revelações de seção
 const reveal=[...$$('.reveal-up'),...$$('.reveal-mask')]; reveal.forEach((el,i)=>el.style.setProperty('--delay',`${(i%4)*55}ms`));
 if('IntersectionObserver' in window&&!reduce){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -5%'}); reveal.forEach(el=>io.observe(el))} else reveal.forEach(el=>el.classList.add('show'));

 // Menu mobile
 const closeMenu=()=>{mobileNav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menuBtn.classList.remove('open')};
 menuBtn.addEventListener('click',()=>{const o=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(o));menuBtn.classList.toggle('open',o);topbar.classList.remove('hidden')});
 $$('#mobileNav a').forEach(a=>a.addEventListener('click',closeMenu)); addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

 // Navegação ativa
 const links=$$('.nav a[href^="#"]'); const pairs=links.map(a=>[a,$(a.getAttribute('href'))]).filter(x=>x[1]);
 if('IntersectionObserver' in window){const nio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.remove('active'));const p=pairs.find(x=>x[1]===e.target);if(p)p[0].classList.add('active')}}),{rootMargin:'-30% 0px -58%',threshold:0});pairs.forEach(x=>nio.observe(x[1]))}

 // Rolagem horizontal dos Labs — V7
 // A rolagem vertical continua movendo os cards para o lado, mas agora também
 // existem setas, arraste com o mouse e gesto horizontal no trackpad.
 const wrap=$('#horizontalWrap'), rail=$('#horizontalRail'), labsProgress=$('#labsProgress'), labsCounter=$('#labsCounter');
 const labsPrev=$('#labsPrev'), labsNext=$('#labsNext');
 let labsP=0, labsDragging=false, dragStartX=0, dragStartP=0;
 function labsMetrics(){
   if(!wrap||!rail)return {distance:1,maxX:0,pad:0};
   const pad=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pad'))||0;
   return {distance:Math.max(1,wrap.offsetHeight-innerHeight),maxX:Math.max(0,rail.scrollWidth-(innerWidth-pad*2)),pad};
 }
 function setLabsProgress(p, smooth=false){
   if(!wrap||innerWidth<=820)return;
   const m=labsMetrics(), clamped=Math.max(0,Math.min(1,p));
   const top=scrollY+wrap.getBoundingClientRect().top;
   scrollTo({top:top+clamped*m.distance,behavior:smooth&&!reduce?'smooth':'auto'});
 }
 function updateHorizontal(){
   if(!wrap||!rail||innerWidth<=820)return;
   const r=wrap.getBoundingClientRect(), m=labsMetrics();
   const p=Math.max(0,Math.min(1,-r.top/m.distance)); labsP=p;
   rail.style.transform=`translate3d(${-p*m.maxX}px,0,0)`;
   if(labsProgress)labsProgress.style.width=(p*100)+'%';
   const count=$$('.showcase',rail).length||3, idx=Math.min(count-1,Math.round(p*(count-1)));
   if(labsCounter)labsCounter.textContent=String(idx+1).padStart(2,'0');
   if(labsPrev)labsPrev.disabled=p<=.015; if(labsNext)labsNext.disabled=p>=.985;
 }
 function goLabs(step){
   const count=$$('.showcase',rail).length||3;
   const current=Math.round(labsP*(count-1));
   setLabsProgress((Math.max(0,Math.min(count-1,current+step)))/(count-1),true);
 }
 if(labsPrev)labsPrev.addEventListener('click',()=>goLabs(-1));
 if(labsNext)labsNext.addEventListener('click',()=>goLabs(1));
 if(rail&&fine&&!reduce){
   rail.addEventListener('pointerdown',e=>{if(innerWidth<=820)return;labsDragging=true;dragStartX=e.clientX;dragStartP=labsP;rail.classList.add('dragging');rail.setPointerCapture(e.pointerId)});
   rail.addEventListener('pointermove',e=>{if(!labsDragging)return;const m=labsMetrics();setLabsProgress(dragStartP-(e.clientX-dragStartX)/Math.max(1,m.maxX),false)});
   const endDrag=e=>{if(!labsDragging)return;labsDragging=false;rail.classList.remove('dragging');try{rail.releasePointerCapture(e.pointerId)}catch(_){ }const count=$$('.showcase',rail).length||3;setLabsProgress(Math.round(labsP*(count-1))/(count-1),true)};
   rail.addEventListener('pointerup',endDrag);rail.addEventListener('pointercancel',endDrag);
   wrap.addEventListener('wheel',e=>{if(innerWidth<=820||Math.abs(e.deltaX)<Math.abs(e.deltaY)*.6)return;e.preventDefault();const m=labsMetrics();setLabsProgress(labsP+e.deltaX/Math.max(1,m.maxX),false)},{passive:false});
 }

 // Cursor, luz ambiente e magnetismo — V10: resposta rápida sem sensação de lag
 const cursor=$('#cursor'), ambient=$('#ambientLight'), kinetic=$('.kinetic-track');
 const lowPower=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4);
 if(lowPower) body.classList.add('lite-motion');
 let targetX=-100,targetY=-100,haloX=-100,haloY=-100,pointerRAF=0,hudLast=0,lastPointerTs=0;
 if(fine&&!reduce){
   body.classList.add('pointer-active');
   const hudCoords=document.getElementById('hudCoords'), hudFps=document.getElementById('hudFps');
   const renderPointer=(ts)=>{
     pointerRAF=0;
     // O anel fica praticamente colado ao mouse. O halo mantém só uma pequena inércia visual.
     if(cursor) cursor.style.transform=`translate3d(${targetX}px,${targetY}px,0) translate(-50%,-50%)`;
     haloX += (targetX-haloX)*.34; haloY += (targetY-haloY)*.34;
     if(ambient&&!lowPower) ambient.style.transform=`translate3d(${haloX}px,${haloY}px,0) translate(-50%,-50%)`;
     if(hudCoords&&ts-hudLast>110){hudCoords.textContent=`X ${String(Math.round(targetX)).padStart(4,'0')} · Y ${String(Math.round(targetY)).padStart(4,'0')}`;hudLast=ts}
     if(Math.abs(targetX-haloX)>.45||Math.abs(targetY-haloY)>.45) pointerRAF=requestAnimationFrame(renderPointer);
   };
   addEventListener('pointermove',e=>{
     targetX=e.clientX;targetY=e.clientY;
     const now=performance.now();
     if(hudFps&&now-lastPointerTs>0){const dt=now-lastPointerTs;hudFps.textContent=dt<28?'FLUIDO':dt<48?'ESTÁVEL':'ECO';}
     lastPointerTs=now;
     if(!pointerRAF)pointerRAF=requestAnimationFrame(renderPointer)
   },{passive:true});
   $$('a,button,.service-row,.showcase').forEach(el=>{el.addEventListener('pointerenter',()=>cursor?.classList.add('hover'));el.addEventListener('pointerleave',()=>cursor?.classList.remove('hover'))});
   $$('.magnetic').forEach(el=>{let raf=0,ex=0,ey=0;el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();ex=e.clientX-r.left-r.width/2;ey=e.clientY-r.top-r.height/2;if(!raf)raf=requestAnimationFrame(()=>{el.style.transform=`translate3d(${ex*.05}px,${ey*.05}px,0)`;raf=0})});el.addEventListener('pointerleave',()=>{el.style.transform=''})});
   $$('.showcase').forEach(card=>{let raf=0,cx=0,cy=0,spotX=50,spotY=50;card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();cx=(e.clientX-r.left)/r.width-.5;cy=(e.clientY-r.top)/r.height-.5;spotX=((e.clientX-r.left)/r.width*100).toFixed(1);spotY=((e.clientY-r.top)/r.height*100).toFixed(1);if(!raf)raf=requestAnimationFrame(()=>{card.style.setProperty('--spot-x',spotX+'%');card.style.setProperty('--spot-y',spotY+'%');const shell=$('.project-shell',card),identity=$('.identity-m',card),browser=$('.site-browser',card),version=$('.site-version',card);if(shell)shell.style.transform=`rotate(-2deg) translate3d(${cx*5}px,${cy*4}px,0)`;if(identity)identity.style.transform=`translate3d(${cx*6}px,${cy*5}px,0)`;if(browser)browser.style.transform=`rotate(-1.5deg) translate3d(${cx*5}px,${cy*4}px,0)`;if(version)version.style.transform=`translate3d(${cx*-5}px,${cy*-4}px,0)`;raf=0})});card.addEventListener('pointerleave',()=>{$$('.project-shell,.identity-m,.site-browser,.site-version',card).forEach(el=>el.style.transform='')})});
   $$('.statement-orb,.contact-orb').forEach(el=>{let raf=0,rx=0,ry=0;el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();rx=(e.clientX-r.left)/r.width-.5;ry=(e.clientY-r.top)/r.height-.5;if(!raf)raf=requestAnimationFrame(()=>{el.style.transform=`perspective(700px) rotateX(${ry*-2.8}deg) rotateY(${rx*2.8}deg) translateZ(2px)`;raf=0})});el.addEventListener('pointerleave',()=>el.style.transform='')});
 }
 let prevScroll=scrollY; addEventListener('scroll',()=>{if(kinetic&&!reduce){const dir=scrollY>=prevScroll?1:-1;kinetic.style.animationDirection=dir>0?'normal':'reverse';prevScroll=scrollY}},{passive:true});
 backTop.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
 update();
})();
// ===== V10 / REDE VISUAL OTIMIZADA, HUD E TERMINAL =====
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const canvas=document.getElementById('heroNetwork');
 if(canvas && !reduce && !document.body.classList.contains('lite-motion')){
   const ctx=canvas.getContext('2d',{alpha:true}); let w=0,h=0,dpr=Math.min(1.15,devicePixelRatio||1),pts=[],mx=-9999,my=-9999,raf=0,visible=true,last=0;
   const resize=()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.max(18,Math.min(34,Math.round(w/50)));pts=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h*.88,vx:(Math.random()-.5)*.13,vy:(Math.random()-.5)*.10,r:Math.random()*.9+.55}))};
   const hero=canvas.closest('.hero'); hero?.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true}); hero?.addEventListener('pointerleave',()=>{mx=my=-9999});
   if('IntersectionObserver' in window&&hero){new IntersectionObserver(es=>{visible=es[0]?.isIntersecting??true;if(visible&&!raf)raf=requestAnimationFrame(draw)},{rootMargin:'120px'}).observe(hero)}
   function draw(ts){raf=0;if(!visible||document.hidden)return;if(ts-last<40){raf=requestAnimationFrame(draw);return}last=ts;ctx.clearRect(0,0,w,h);for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h*.9)p.vy*=-1;const dx=p.x-mx,dy=p.y-my,md2=dx*dx+dy*dy;if(md2<14400){const inv=1/Math.sqrt(md2||1);p.x+=dx*inv*.12;p.y+=dy*inv*.12}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(69,165,255,.38)';ctx.fill()}const lim=106,lim2=lim*lim;for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;if(d2<lim2){const d=Math.sqrt(d2);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(50,145,255,${(1-d/lim)*.075})`;ctx.lineWidth=.65;ctx.stroke()}}}raf=requestAnimationFrame(draw)}
   resize();raf=requestAnimationFrame(draw);let rr=0;addEventListener('resize',()=>{clearTimeout(rr);rr=setTimeout(resize,120)},{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&visible&&!raf)raf=requestAnimationFrame(draw)});
 }
 const hudSection=document.getElementById('hudSection');
 const sections=[...document.querySelectorAll('main section[id]')];
 if(hudSection&&sections.length&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)hudSection.textContent=(e.target.id||'INÍCIO').toUpperCase()}),{rootMargin:'-42% 0px -48%'});sections.forEach(s=>io.observe(s))}
 const form=document.getElementById('terminalForm'),input=document.getElementById('terminalInput'),body=document.getElementById('terminalBody');
 if(form&&input&&body){
   const print=(html,cls='terminal-output')=>{const p=document.createElement('p');p.className=cls;p.innerHTML=html;body.appendChild(p);body.scrollTop=body.scrollHeight};
   const nav=(id,label)=>{print(`Abrindo <strong>${label}</strong>...`,'terminal-success');setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:reduce?'auto':'smooth'}),220)};
   const commands={
     ajuda:()=>print('Comandos: <strong>sobre</strong>, <strong>labs</strong>, <strong>servicos</strong>, <strong>processo</strong>, <strong>core</strong>, <strong>lobex</strong>, <strong>contato</strong>, <strong>mabello</strong>, <strong>status</strong>, <strong>versao</strong>, <strong>limpar</strong>.'),
     sobre:()=>nav('sobre','Sobre'),labs:()=>nav('labs','MABELLO Labs'),servicos:()=>nav('servicos','Serviços'),processo:()=>nav('processo','Processo'),core:()=>nav('core','MABELLO Core'),lobex:()=>nav('lobex','Lobex'),contato:()=>nav('contato','Contato'),
     mabello:()=>print('<strong>Tecnologia que conecta. Soluções que transformam.</strong>','terminal-success'),
     status:()=>print('Interface <strong>online</strong> · movimento adaptativo · modo de acessibilidade disponível.','terminal-success'),
     versao:()=>print('<strong>MABELLO V10</strong> · edição de polimento final.','terminal-success'),
     limpar:()=>{body.innerHTML=''}
   };
   addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement?.tagName||'')){e.preventDefault();input.focus();input.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}});
   form.addEventListener('submit',e=>{e.preventDefault();const cmd=input.value.trim().toLowerCase();if(!cmd)return;print(`<span>mabello@core</span>:~$ <b>${cmd.replace(/[<>]/g,'')}</b>`,'');input.value='';if(commands[cmd])commands[cmd]();else print(`Comando não encontrado: <strong>${cmd.replace(/[<>]/g,'')}</strong>. Digite <strong>ajuda</strong>.`,'terminal-error')});
 }
})();
