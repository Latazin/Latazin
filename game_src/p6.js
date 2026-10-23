/* =====================================================================
   CÂMERA
   ===================================================================== */
const cam={x:0,y:200,z:1.2,tx:null,ty:null,tz:null};
function resize(){DPR=Math.min(1.6,window.devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);}
window.addEventListener('resize',resize);
function w2s(wx,wy){return [(wx-cam.x)*cam.z+W/2,(wy-cam.y)*cam.z+H/2];}
function s2w(sx,sy){return [(sx-W/2)/cam.z+cam.x,(sy-H/2)/cam.z+cam.y];}
function sheetH(){const s=$('#sheet');return s.classList.contains('open')&&W<760?s.offsetHeight:0;}
function camTo(wx,wy,z){const o=sheetH();const zz=z||cam.z;cam.tx=wx;cam.ty=wy+(o/2-30)/zz;if(z)cam.tz=z;}
function clampCam(){cam.x=clamp(cam.x,-HT*HW-40,WT*HW+40);cam.y=clamp(cam.y,-60,(WT+HT)*HH+60);cam.z=clamp(cam.z,0.4,2.4);}
function goHome(){const [wx,wy]=bWorld(pref());camTo(wx,wy-20,1.25);}

/* =====================================================================
   CHÃO (cache) — ruas mudam com o estilo e o nível do bairro
   ===================================================================== */
const GOFF={x:-HT*HW-12,y:-14};const GW=(WT+HT)*HW+24,GH=(WT+HT)*HH+72;const GS=2;
const gcv=document.createElement('canvas');gcv.width=GW*GS;gcv.height=GH*GS;const gctx=gcv.getContext('2d');let groundDirty=true;
function tilePoly(x,y){return [proj(x,y),proj(x+1,y),proj(x+1,y+1),proj(x,y+1)];}
function distUnlockedG(gx,gy){if(gx<0||gy<0||gx>=GXN||gy>=GYN)return false;const d=gy*GXN+gx;return d!==11&&S.unlocked.includes(d);}
function roadActive(x,y){const gx=Math.floor(x/DS),gy=Math.floor(y/DS);
  if(x%DS===0&&y%DS===0)return distUnlockedG(gx,gy)||distUnlockedG(gx-1,gy)||distUnlockedG(gx,gy-1)||distUnlockedG(gx-1,gy-1);
  if(y%DS===0)return distUnlockedG(gx,gy)||distUnlockedG(gx,gy-1);return distUnlockedG(gx,gy)||distUnlockedG(gx-1,gy);}
function roadOwner(x,y){const gx=Math.min(GXN-1,Math.floor(x/DS)),gy=Math.min(GYN-1,Math.floor(y/DS));let d=gy*GXN+gx;if(!S.unlocked.includes(d)){if(gy>0&&S.unlocked.includes(d-GXN))d-=GXN;else if(gx>0&&S.unlocked.includes(d-1))d-=1;}return d;}
function drawGround(){
  const prevX=X,pt=TINT;X=gctx;TINT=null;X.setTransform(GS,0,0,GS,-GOFF.x*GS,-GOFF.y*GS);X.clearRect(GOFF.x,GOFF.y,GW,GH);
  const a=proj(0,HT),b=proj(WT,HT),c=proj(WT,0);const Tk=38;
  poly([a,b,[b[0],b[1]+Tk],[a[0],a[1]+Tk]],'#b07a4a');poly([b,c,[c[0],c[1]+Tk],[b[0],b[1]+Tk]],'#8d5e36');
  poly([a,b,[b[0],b[1]+7],[a[0],a[1]+7]],'#6cc04a',false);poly([b,c,[c[0],c[1]+7],[b[0],b[1]+7]],'#58a63c',false);
  for(let i=0;i<14;i++){const t=hash(i*17)%1000/1000;ell(lerp(a[0],b[0],t),lerp(a[1],b[1],t)+16+hash(i)%14,3,2,'#9c6a3e',false);}
  const avAll=tk('tra4')||prjDone('metro');
  for(let y=0;y<HT;y++)for(let x=0;x<WT;x++){const tp=tilePoly(x,y);
    if(isRoad(x,y)){const on=roadActive(x,y);const d=roadOwner(x,y);const R=ROADS.find(r=>r.id===(S.road[d]||'asfalto'))||ROADS[0];const col=on?R.c:'#a3a7bd';poly(tp,col,false);
      X.strokeStyle='rgba(255,255,255,.14)';X.lineWidth=.8;X.beginPath();X.moveTo(...tp[0]);for(let k=1;k<4;k++)X.lineTo(...tp[k]);X.closePath();X.stroke();
      const isX=x%DS===0&&y%DS===0;const hor=y%DS===0;
      if(on&&R.id==='pedra'){for(let k=0;k<6;k++){const h=hash(x*31+y*17+k);const p=proj(x+.15+(h%70)/100,y+.15+((h>>7)%70)/100);ell(p[0],p[1],2.2,1.1,'rgba(255,255,255,.18)',false);}}
      if(on&&R.id==='tijolo'){X.strokeStyle='rgba(255,230,210,.35)';X.lineWidth=.8;for(let k=1;k<4;k++){X.beginPath();X.moveTo(...proj(x+k/4,y));X.lineTo(...proj(x+k/4,y+1));X.stroke();}}
      if(on&&R.id==='ouro'){X.fillStyle='rgba(255,255,255,.25)';X.beginPath();X.moveTo(...proj(x+.2,y+.2));X.lineTo(...proj(x+.4,y+.2));X.lineTo(...proj(x+.3,y+.5));X.closePath();X.fill();}
      if(!isX&&on){const av=avAll||(C.devL[d]||0)>=3;
        if(av){X.strokeStyle='rgba(255,255,255,.85)';X.lineWidth=1.2;X.beginPath();if(hor){X.moveTo(...proj(x,y+.08));X.lineTo(...proj(x+1,y+.08));X.moveTo(...proj(x,y+.92));X.lineTo(...proj(x+1,y+.92));}else{X.moveTo(...proj(x+.08,y));X.lineTo(...proj(x+.08,y+1));X.moveTo(...proj(x+.92,y));X.lineTo(...proj(x+.92,y+1));}X.stroke();
          X.strokeStyle='#5fbf4f';X.lineWidth=2.4;X.beginPath();if(hor){X.moveTo(...proj(x+.05,y+.5));X.lineTo(...proj(x+.95,y+.5));}else{X.moveTo(...proj(x+.5,y+.05));X.lineTo(...proj(x+.5,y+.95));}X.stroke();}
        else if((C.devL[d]||0)>=1){X.strokeStyle=R.id==='neon'?'rgba(255,79,216,.9)':'rgba(255,236,150,.85)';X.lineWidth=1.6;X.setLineDash([5,5]);X.beginPath();if(hor){X.moveTo(...proj(x+.1,y+.5));X.lineTo(...proj(x+.9,y+.5));}else{X.moveTo(...proj(x+.5,y+.1));X.lineTo(...proj(x+.5,y+.9));}X.stroke();X.setLineDash([]);}
        if(R.id==='neon'){X.strokeStyle='rgba(76,240,255,.9)';X.lineWidth=1;X.beginPath();if(hor){X.moveTo(...proj(x,y+.02));X.lineTo(...proj(x+1,y+.02));}else{X.moveTo(...proj(x+.02,y));X.lineTo(...proj(x+.02,y+1));}X.stroke();}}
      if(isX&&on&&(avAll||(C.devL[d]||0)>=2)){X.strokeStyle='rgba(255,255,255,.8)';X.lineWidth=1.6;for(let k=0;k<4;k++){X.beginPath();X.moveTo(...proj(x+.15+k*.2,y+.08));X.lineTo(...proj(x+.15+k*.2,y+.25));X.stroke();}}
      continue;}
    const d=distOf(x,y);
    if(d===11){poly(tp,(x+y)%2?'#5fc6f2':'#62caf5',false);continue;}
    const D=DIST[d];const un=S.unlocked.includes(d);const lv=un?(C.devL[d]||0):0;let gc=un?D.g:mix(D.g,'#b9b3cf',.55);if(un&&lv===0)gc=mix(D.g,'#c2b38f',.35);
    gc=shade(gc,((x+y)%2?.04:-.02));poly(tp,gc,false);const cc=proj(x+.5,y+.5);
    if(un&&(x%DS===1||y%DS===1)){X.strokeStyle=lv>=2?'rgba(255,255,255,.55)':'rgba(255,255,255,.28)';X.lineWidth=lv>=2?2:1.2;X.beginPath();if(x%DS===1){X.moveTo(...proj(x,y));X.lineTo(...proj(x,y+1));}if(y%DS===1){X.moveTo(...proj(x,y));X.lineTo(...proj(x+1,y));}X.stroke();}
    if(un&&lv===0&&hash(x*13+y*29)%3===0){for(let k=0;k<4;k++){const h=hash(x*7+y*11+k);const px=cc[0]+(h%24)-12,py=cc[1]+((h>>5)%10)-5;X.strokeStyle='#7a8a3a';X.lineWidth=1;X.beginPath();X.moveTo(px,py);X.lineTo(px-2,py-5);X.moveTo(px,py);X.lineTo(px+1,py-6);X.moveTo(px,py);X.lineTo(px+3,py-4);X.stroke();}}
    else if(un&&hash(x*97+y*31)%4===0){const h=hash(x*13+y*7);for(let k=0;k<3;k++)ell(cc[0]+(h>>k*3)%20-10,cc[1]+(h>>k*4)%8-4,1.3,1,['#ffffff','#ffe066','#ff8fab'][k],false);}}
  X.setTransform(1,0,0,1,0,0);X=prevX;TINT=pt;groundDirty=false;}

/* =====================================================================
   VEÍCULOS E PEDESTRES
   ===================================================================== */
let EDGES=[];let agents=[];let aid=0;
function edgeOK(ax,ay,bx,by){if(ay===by){const ix=Math.min(ax,bx);return distUnlockedG(ix,ay)||distUnlockedG(ix,ay-1);}const iy=Math.min(ay,by);return distUnlockedG(ax,iy)||distUnlockedG(ax-1,iy);}
function buildEdges(){EDGES=[];for(let y=0;y<=GYN;y++)for(let x=0;x<=GXN;x++){if(x<GXN&&edgeOK(x,y,x+1,y))EDGES.push([x,y,x+1,y]);if(y<GYN&&edgeOK(x,y,x,y+1))EDGES.push([x,y,x,y+1]);}}
const CARC=['#ff5d6c','#5aa9ff','#ffd23f','#2fd08a','#ff9f43','#ffffff','#9b5de5'];
function newAgent(k){const e=pick(EDGES);if(!e)return null;const rev=Math.random()<.5;const car=k!=='ped'&&k!=='vip';
  return {k,car,fx:rev?e[2]:e[0],fy:rev?e[3]:e[1],tx:rev?e[0]:e[2],ty:rev?e[1]:e[3],p:Math.random(),sp:car?(k==='truck'?rnd(.7,1):k==='bus'?rnd(.6,.9):rnd(.9,1.6)):rnd(.25,.45)*(k==='vip'?.7:1),c:pick(CARC),sk:pick(['#ffd7b5','#e0ac69','#8d5524','#f1c27d']),sh:pick(CARC),id:aid++,_born:TIME};}
function agentTargets(){const n=S.unlocked.length;return {car:clamp(Math.round(4+n*1.4+C.trafD*.35),6,22),bus:(tk('tra2')||countType('onibus'))?clamp(2+C.transit*1.5,0,6):0,truck:clamp(Math.round(C.deliv/8),0,7),ped:clamp(Math.round(6+S.pop/32+C.V/26),6,38)};}
function syncAgents(force){if(force){buildEdges();agents=agents.filter(a=>a.k==='vip');}if(!EDGES.length)buildEdges();const tg=agentTargets();
  for(const k in tg){const cur=agents.filter(a=>a.k===k);let diff=tg[k]-cur.length;if(!force)diff=clamp(diff,-2,2);
    if(diff>0)for(let i=0;i<diff;i++){const a=newAgent(k);if(a)agents.push(a);}else if(diff<0){for(let i=0;i<-diff;i++){const idx=agents.indexOf(cur[i]);if(idx>=0)agents.splice(idx,1);}}}}
function spawnVip(){const a=newAgent('vip');if(a)agents.push(a);}
function stepAgents(dt){const slow=1/(1+C.cg*1.5);for(const a of agents){a.p+=a.sp*dt/DS*(a.car?slow:1);
  if(a.p>=1){a.p-=1;const nx=a.tx,ny=a.ty;const opts=[];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x2=nx+dx,y2=ny+dy;if(x2<0||y2<0||x2>GXN||y2>GYN)continue;if(x2===a.fx&&y2===a.fy)continue;if(edgeOK(nx,ny,x2,y2))opts.push([x2,y2]);}
    if(!opts.length)opts.push([a.fx,a.fy]);const o=pick(opts);a.fx=nx;a.fy=ny;a.tx=o[0];a.ty=o[1];}}
  agents=agents.filter(a=>a.k!=='vip'||TIME-a._born<45);}
function agentPos(a){const dx=a.tx-a.fx,dy=a.ty-a.fy;let u=(a.fx+dx*a.p)*DS+.5,v=(a.fy+dy*a.p)*DS+.5;const lane=a.car?.2:.42;const side=(a.id%2?1:-1);
  if(dx!==0)v+=a.car?lane*Math.sign(dx):lane*side;else u-=a.car?lane*Math.sign(dy):lane*side;return [u,v,dx,dy];}
function drawCar(a,u,v,dx,dy){const [x,y]=proj(u,v);const cs=S.cos.eq.car;let c=a.c;if(cs==='car_gold')c='#ffc21a';else if(cs==='car_rainbow')c=CARC[(a.id+Math.floor(TIME*2))%CARC.length];
  const isBus=a.k==='bus'||(cs==='car_bus'&&a.id%2===0);const L=a.k==='truck'?.4:isBus?.46:.3,Wd=.16;const w=dx!==0?L:Wd,d=dx!==0?Wd:L;ell(x,y,10,5,'rgba(43,35,80,.18)',false);
  if(a.k==='truck'){box(x,y,w,d,4,'#5b6378',1.5);const off2=dx!==0?[Math.sign(dx)*.12,0]:[0,Math.sign(dy)*.12];const [fx2,fy2]=P(x,y,off2[0],off2[1],0);box(fx2,fy2,dx!==0?.12:.15,dx!==0?.15:.12,6,'#ff7a1a',5);const [bx2,by2]=P(x,y,-off2[0]*.5,-off2[1]*.5,0);box(bx2,by2,dx!==0?.24:.15,dx!==0?.15:.24,8,'#e6d3b3',5);}
  else if(isBus){const col=tk('tra2')?'#2fd08a':'#ffc21a';const g=box(x,y,w,d,9,col,1.5);for(let i=0;i<4;i++){face(g,0,(i+.15)/4,(i+.8)/4,4,7,'#dcf5ff');face(g,1,(i+.15)/4,(i+.8)/4,4,7,'#dcf5ff');}if(tk('tra2'))line(x,y-12,x,y-16,'#6b5a8f',1);}
  else{box(x,y,w,d,5,c[0]==='#'?c:'#ff5d6c',1.5);box(x,y,w*.6,d*.6,4,'#d8f4ff',6.5);}
  if(S.ess>=15&&!PREVIEW)glow(x,y-3,9,'rgba(255,90,220,.45)');
  if(NIGHT>.3){const hd=dx!==0?[Math.sign(dx)*HW*L*.5,Math.sign(dx)*HH*L*.5]:[-Math.sign(dy)*HW*L*.5,Math.sign(dy)*HH*L*.5];glow(x+hd[0]*1.6,y+hd[1]*1.6-3,12,'rgba(255,245,190,.8)');}}
function drawPed(a,u,v){const [x,y]=proj(u,v);if(a.k==='vip'){const pg=TINT;TINT=gold;person(x,y,'#ffd23f','#ffe0bd',a.id);TINT=pg;X.fillStyle='#2b2350';X.fillRect(x-2.5,y-17,5,5);X.fillRect(x-4,y-12.5,8,1.5);glow(x,y-8,16,'rgba(255,220,100,.8)');if(Math.random()<.2)parts.push({k:'spark',x:x+rnd(-6,6),y:y-rnd(4,16),vx:0,vy:-12,t:0,life:.6,c:'#fff3a8'});return;}
  person(x,y,a.sh,a.sk,a.id);}

/* =====================================================================
   EVENTOS RÁPIDOS (moedas, dourado, rush...)
   ===================================================================== */
let evTimer=35,meteor=null,meteorT=50,superChest=null;
const EVDEF={
  rain:{n:'Chuva de Moedas!',sub:'Toque nas moedas espalhadas pela cidade',dur:10,cls:''},
  golden:{n:'Prédio Dourado!',sub:'Um prédio produz 7× — toque nele',dur:30,cls:''},
  rush:{n:'City Rush!',sub:'A cidade inteira produz 3×',dur:20,cls:'rush'},
  mega:{n:'Mega Upgrade!',sub:'Toque no prédio com a seta arco-íris: +10 níveis grátis',dur:25,cls:'purple'},
  inst:{n:'Construção Instantânea!',sub:'Obras terminam na hora por 60s',dur:60,cls:'blue'},
  chest:{n:'Superbaú apareceu!',sub:'Encontre o baú brilhante na cidade',dur:25,cls:'purple'},
};
function builtList(){return S.buildings.filter(b=>isReady(b)&&b.t!=='prj'&&TYPES[b.t].inc>0);}
function startEvent(k){const L=builtList();if((k==='golden'||k==='mega')&&L.filter(b=>b.t!=='pref').length<1)k='rain';
  ev={k,t:0,dur:EVDEF[k].dur};
  if(k==='rain'){worldCoins=[];const tiles=[];for(const d of S.unlocked)for(const [x,y] of plotsOf(d))tiles.push([x,y]);for(let i=0;i<14;i++){const [x,y]=pick(tiles);const [wx,wy]=proj(x+rnd(.2,.8),y+rnd(.2,.8));worldCoins.push({x:wx,y:wy,z:rnd(200,320),vz:0,t:0,spin:rnd(0,6)});}}
  if(k==='golden'||k==='mega'){ev.bid=pick(L.filter(b=>b.t!=='pref')).id;dirty=true;}
  if(k==='inst'){S.instUntil=Date.now()+60000;for(const b of S.buildings)if(b.ready>Date.now()){b.ready=Date.now();finishBuild(b);}dirty=true;}
  if(k==='chest'){const tiles=[];for(const d of S.unlocked)for(const [x,y] of plotsOf(d))if(!occ.has(x+','+y))tiles.push([x,y]);const t=tiles.length?pick(tiles):[2,4];const [wx,wy]=proj(t[0]+.5,t[1]+.5);superChest={x:wx,y:wy,t:0};}
  if(k==='rush')dirty=true;sfx('event');renderEvBar();}
function endEvent(){if(!ev)return;if(ev.k==='rush'||ev.k==='golden')dirty=true;if(ev.k==='chest')superChest=null;if(ev.k==='rain')worldCoins=[];ev=null;renderEvBar();}
function eventTick(dt){
  if(ev){ev.t+=dt;if(ev.t>=ev.dur)endEvent();}
  else{evTimer-=dt;if(evTimer<=0&&S.tut>=4){const r=Math.random();const k=r<.24?'rain':r<.46?'golden':r<.64?'rush':r<.8?'mega':r<.92?'inst':'chest';startEvent(k);evTimer=rnd(60,110);}}
  meteorT-=dt*(S.ess>=50?2:1);if(!meteor&&meteorT<=0&&S.tut>=4){const fromL=Math.random()<.5;meteor={x:fromL?-40:W+40,y:rnd(H*.2,H*.44),vx:(fromL?1:-1)*rnd(90,130),vy:rnd(8,20),t:0};meteorT=rnd(60,100);sfx('meteor');}
  if(meteor){meteor.t+=dt;meteor.x+=meteor.vx*dt;meteor.y+=meteor.vy*dt;if(meteor.x<-80||meteor.x>W+80)meteor=null;}}
function renderEvBar(){const el=$('#evBar');let h='';
  if(ev){const D=EVDEF[ev.k];h+=`<div class="ev ${D.cls}">${D.n}<div class="sub">${D.sub}</div><div class="bar"><i id="evProg" style="width:100%"></i></div></div>`;}
  if(sev){const e=SEV.find(x=>x.id===sev.id);if(sev.pending)h+=`<div class="ev story" id="sevChip">${portrait(e.ch)}<div><b style="font-family:var(--display);font-weight:400">${e.t}</b><div class="sub">Toque para decidir · ${Math.ceil(sev.wait)}s</div></div></div>`;
    else if(sev.obj)h+=`<div class="ev story" id="sevChip">${portrait(e.ch)}<div><b style="font-family:var(--display);font-weight:400">${e.t}</b><div class="sub" id="sevSub">${sev.obj.txt}: ${fmt(Math.max(0,sev.obj.prog))}/${fmt(sev.obj.need)}</div><div class="bar"><i id="sevProg" style="width:100%"></i></div></div></div>`;}
  el.innerHTML=h;$('#side').classList.toggle('low',!!(ev||sev));const c=$('#sevChip');if(c)c.onclick=()=>{if(sev&&sev.pending)openEvent();};}

/* =====================================================================
   INPUT
   ===================================================================== */
const ptrs=new Map();let drag=null,pinch=null;
cv.addEventListener('pointerdown',e=>{audioInit();cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===1)drag={sx:e.clientX,sy:e.clientY,cx:cam.x,cy:cam.y,moved:false};
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),z:cam.z};drag=null;}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&ptrs.size===2){const [a,b]=[...ptrs.values()];cam.z=clamp(pinch.z*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d,.4,2.4);cam.tz=null;return;}
  if(drag){const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(Math.hypot(dx,dy)>8){drag.moved=true;cv.classList.add('drag');}if(drag.moved){cam.x=drag.cx-dx/cam.z;cam.y=drag.cy-dy/cam.z;cam.tx=null;cam.ty=null;clampCam();}}});
function endPtr(e){if(!ptrs.has(e.pointerId))return;ptrs.delete(e.pointerId);cv.classList.remove('drag');if(drag&&!drag.moved&&ptrs.size===0)tap(e.clientX,e.clientY);if(ptrs.size<2)pinch=null;if(ptrs.size===0)drag=null;}
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
cv.addEventListener('wheel',e=>{e.preventDefault();const [wx,wy]=s2w(e.clientX,e.clientY);cam.z=clamp(cam.z*Math.exp(-e.deltaY*.0015),.4,2.4);const [wx2,wy2]=s2w(e.clientX,e.clientY);cam.x+=wx-wx2;cam.y+=wy-wy2;cam.tz=null;clampCam();},{passive:false});
window.addEventListener('keydown',e=>{if(e.target.tagName==='TEXTAREA'||e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();const s=40/cam.z;
  if(k==='arrowleft'||k==='a')cam.x-=s;else if(k==='arrowright'||k==='d')cam.x+=s;else if(k==='arrowup'||k==='w')cam.y-=s;else if(k==='arrowdown'||k==='s')cam.y+=s;
  else if(k==='+'||k==='=')cam.z=clamp(cam.z*1.12,.4,2.4);else if(k==='-')cam.z=clamp(cam.z/1.12,.4,2.4);else if(k==='h')goHome();else if(k==='b')openSheet('build');else if(k==='u')openSheet('upgrade');else if(k==='c')openSheet('city');else if(k==='p')openSheet('research');
  else if(k==='escape'){closeModal();closeSheet();heatMode=null;renderHeatChip();}else return;cam.tx=null;cam.ty=null;clampCam();});
function tap(sx,sy){const [wx,wy]=s2w(sx,sy);
  if(meteor&&Math.hypot(sx-meteor.x,sy-meteor.y)<40){const v=Math.max(100,ipsBase*(S.ess>=50?120:60));earn(v);const g=ri(1,3);S.gems+=g;flyCoins(meteor.x,meteor.y,10);
    floatText(...s2w(meteor.x,meteor.y),'+'+fmt(v)+'  +'+g+' joias','#fff3a8',18);sparkle(...s2w(meteor.x,meteor.y),20);meteor=null;S.cnt.met++;eventTap();sfx('chest');vib(25);checkAch();return;}
  const R=34/cam.z;
  for(const a of agents)if(a.k==='vip'){const [u,v]=agentPos(a);const [ax,ay]=proj(u,v);if(Math.hypot(wx-ax,wy-(ay-8))<Math.max(R,22)){agents.splice(agents.indexOf(a),1);burst(ax,ay-10,40);sfx('unlock');if(sev&&sev.obj&&sev.obj.k==='vip')sev.obj.prog=1;else{S.gems+=10;toast('+10 joias','p');}return;}}
  for(const b of S.buildings){if(b.bub>0&&b._bx!==undefined&&Math.hypot(wx-b._bx,wy-b._by)<Math.max(R,20)){collectBubble(b);return;}}
  if(ev&&ev.k==='rain'){for(let i=0;i<worldCoins.length;i++){const c=worldCoins[i];if(c.z<40&&Math.hypot(wx-c.x,wy-(c.y-8))<Math.max(R,16)){const v=Math.max(10,ipsBase*4);earn(v);floatText(c.x,c.y-20,'+'+fmt(v),'#ffd23f',15);flyCoins(...w2s(c.x,c.y-8),3);sfx('coin');worldCoins.splice(i,1);if(!ev.tapped){ev.tapped=1;eventTap();}return;}}}
  if(superChest&&Math.hypot(wx-superChest.x,wy-(superChest.y-14))<Math.max(R,26)){burst(superChest.x,superChest.y-14,40);superChest=null;eventTap();grantChest('super');endEvent();return;}
  let hit=null,hd=-1;for(const b of S.buildings){const [cx,cy]=bWorld(b);const top=b._top||30;if(wx>cx-30&&wx<cx+30&&wy<cy+14&&wy>cy-top-6){const d=b.x+b.y;if(d>hd){hd=d;hit=b;}}}
  if(hit){
    if(ev&&ev.k==='mega'&&ev.bid===hit.id){hit.lvl+=10;S.maxLv=Math.max(S.maxLv,hit.lvl);dirty=true;const [cx,cy]=bWorld(hit);burst(cx,cy-30,50);floatText(cx,cy-70,'+10 níveis!','#c9a8ff',20);showBanner('Mega Upgrade!',TYPES[hit.t].n);sfx('unlock');eventTap();endEvent();checkAch();return;}
    if(ev&&ev.k==='golden'&&ev.bid===hit.id&&TIME-(ev.lt||0)>.35){ev.lt=TIME;const v=Math.max(20,bIncome(hit)*2);earn(v);const [cx,cy]=bWorld(hit);floatText(cx,cy-(hit._top||30)-20,'+'+fmt(v),'#ffd23f',18);flyCoins(...w2s(cx,cy-30),6);sfx('coin');if(!ev.tapped){ev.tapped=1;eventTap();}}
    hit._bounce=TIME;sfx('click');openBuilding(hit);return;}
  const u=Math.floor((wx/HW+wy/HH)/2),v=Math.floor((wy/HH-wx/HW)/2);const d=distOf(u,v);
  if(d>=0&&d<=15&&d!==11&&!isRoad(u,v)){if(!S.unlocked.includes(d)){sfx('click');openSheet('districts');return;}if(plotFree(u,v)){targetPlot=[u,v];sfx('click');openSheet('build');return;}}
  targetPlot=null;}

/* =====================================================================
   SIMULAÇÃO DE TEMPO
   ===================================================================== */
let dispCoins=0,uiT=0,saveT=0,ipsT=0,achT=0,devT=0,ctxT=6,agT=5,histT=0;
function econ(dt){
  if(dirty)recalc();
  const tgt=C.hcap*(.5+.5*S.happy/100)*C.mpop;S.pop+=(tgt-S.pop)*Math.min(1,dt*.06);if(!(S.pop>=0))S.pop=0;
  S.happy+=(C.happyT-S.happy)*Math.min(1,dt*.12);
  const v=ips*dt;if(v>0)earn(v);else if(v<0)S.coins=Math.max(0,S.coins+v);
  S.rp+=C.rp*dt;S.crys+=C.crys*dt;S.played+=dt;sessionT+=dt;S.chestT=Math.max(0,S.chestT-dt);
  const now=Date.now();
  for(const b of S.buildings){
    if(b.ready&&b.ready<=now&&b._wasBusy){b._wasBusy=false;finishBuild(b);}
    if(b.ready>now){b._wasBusy=true;continue;}if(b.t==='prj'||!b._inc)continue;
    if(b.nextBub===undefined)b.nextBub=rnd(5,20);
    if(!(b.bub>0)){b.nextBub-=dt;if(b.nextBub<=0&&S.tut>=1){b.bub=Math.max(1,bIncome(b)*12);b.bubT=TIME;}}
    else if(hasCU('robo')&&TIME-(b.bubT||0)>3)collectBubble(b,true);}}
function update(dt){
  TIME+=dt;if(combo.t>0){combo.t-=dt;if(combo.t<=0)combo.n=0;}
  eventTick(dt);sevTick(dt);sayTick(dt);stepAgents(dt);
  if(cam.tx!==null&&cam.tx!==undefined){cam.x=lerp(cam.x,cam.tx,1-Math.pow(.004,dt));cam.y=lerp(cam.y,cam.ty,1-Math.pow(.004,dt));if(Math.hypot(cam.x-cam.tx,cam.y-cam.ty)<.5)cam.tx=null;}
  if(cam.tz){cam.z=lerp(cam.z,cam.tz,1-Math.pow(.01,dt));if(Math.abs(cam.z-cam.tz)<.003)cam.tz=null;}clampCam();
  for(const p of parts){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.g)p.vy+=220*dt;if(p.k==='smoke'||p.k==='steam'){p.vx*=.98;p.r+=dt*(p.k==='smoke'?3:1.5);}}parts=parts.filter(p=>p.t<p.life);if(parts.length>220)parts.splice(0,parts.length-220);
  for(const f of floats)f.t+=dt;floats=floats.filter(f=>f.t<1.4);
  for(const c of confetti){c.t+=dt;c.x+=c.vx*dt+Math.sin(c.t*3+c.r)*20*dt;c.y+=c.vy*dt;c.r+=c.vr*dt;}confetti=confetti.filter(c=>c.t<c.life&&c.y<H+40);if(confetti.length>160)confetti.splice(0,confetti.length-160);
  let arrived=0;for(const f of fly){f.t+=dt;if(f.t>=f.d&&!f.done){f.done=true;arrived++;}}fly=fly.filter(f=>!f.done);if(arrived){const cp=$('#coinPill');cp.classList.remove('pop');void cp.offsetWidth;cp.classList.add('pop');sfx('coin');}
  for(const c of worldCoins){c.t+=dt;if(c.z>0){c.vz-=500*dt;c.z+=c.vz*dt;if(c.z<=0){c.z=0;c.vz=Math.abs(c.vz)>60?-c.vz*.4:0;}}}
  if(unlockAnim){unlockAnim.t+=dt;if(unlockAnim.t>3)unlockAnim=null;}if(superChest)superChest.t+=dt;if(ceremony&&TIME-ceremony.t0>3.4)ceremony=null;
  dispCoins=S.coins<dispCoins?S.coins:lerp(dispCoins,S.coins,1-Math.pow(.0005,dt));if(Math.abs(dispCoins-S.coins)<1)dispCoins=S.coins;
  uiT-=dt;if(uiT<=0){uiT=.25;updHUD();}
  ipsT-=dt;if(ipsT<=0){ipsT=.5;dirty=true;}
  saveT-=dt;if(saveT<=0){saveT=10;save();}
  devT-=dt;if(devT<=0){devT=2;updateDev();if(heatMode)computeHeat();}
  ctxT-=dt;if(ctxT<=0){ctxT=6;ctxTick();}
  agT-=dt;if(agT<=0){agT=5;syncAgents(false);}
  histT-=dt;if(histT<=0){histT=5;hist.push(Math.max(0,ips));if(hist.length>60)hist.shift();}
  achT-=dt;if(achT<=0){achT=2;checkAch();updateDots();const r=rankOf(S.pop);if(r>(S.rank||0)){S.rank=r;showBanner(RANKS[r][1],'A cidade cresceu!');screenConfetti(100);sfx('unlock');
    const nw=Object.keys(CHARS).filter(ch=>CHAR_UNLOCK[ch]===r);setTimeout(()=>say('lucia','Somos oficialmente '+RANKS[r][1]+'! Liberado: '+RANK_UNLOCK[r]+'.'+(nw.length?' Chegou gente nova: '+nw.map(c=>CHARS[c].n).join(' e ')+'.':''),9),1500);}
    if(!S.seen2&&$('#modal').hidden)v2Intro();}}
function updHUD(){$('#coinTxt').textContent=fmt(dispCoins);const it=$('#ipsTxt');it.textContent=(ips>=0?'+':'')+fmt(ips)+'/s'+(combo.n>1?'  combo ×'+(1+Math.min(2,combo.n*.1)).toFixed(1):'');it.classList.toggle('neg',ips<0);$('#gemTxt').textContent=S.gems;
  const cb=$('#chestBtn');if(S.chestT<=0){cb.classList.add('ready');$('#chestTxt').textContent='Abrir!';}else{cb.classList.remove('ready');$('#chestTxt').textContent=fmtTime(S.chestT);}
  let bh='';if(gemBoostOn())bh+=`<div class="boost">2× ${fmtTime((S.gemBoost-Date.now())/1000)}</div>`;if(sessionBonus()>0)bh+=`<div class="boost" style="background:#2fd08a;box-shadow:0 2px 0 #179a62">+${Math.round(sessionBonus()*100)}%</div>`;$('#boosts').innerHTML=bh;
  if(ev){const p=$('#evProg');if(p)p.style.width=(100*(1-ev.t/ev.dur))+'%';}
  if(sev){if(sev.pending){const s=$('#sevChip .sub');if(s)s.textContent='Toque para decidir · '+Math.ceil(sev.wait)+'s';}else if(sev.obj){const s=$('#sevSub');if(s)s.textContent=sev.obj.txt+': '+fmt(Math.max(0,sev.obj.prog))+'/'+fmt(sev.obj.need);const p=$('#sevProg');if(p)p.style.width=(100*clamp((sev.obj.until-TIME)/sev.obj.dur,0,1))+'%';}}
  stripRender();if(sheetMode)refreshButtons();
  if(sheetMode==='bld'){const b=S.buildings.find(x=>x.id===selB);if(b){const busy=b.ready>Date.now();const rs=busy?Math.ceil((b.ready-Date.now())/1000):-1;if(rs!==b._lastRem){b._lastRem=rs;if(busy||b._lastBusy)renderSheet(true);}b._lastBusy=busy;}}}

/* =====================================================================
   MAPAS DE CALOR
   ===================================================================== */
let heat=[];
function computeHeat(){heat=[];if(!heatMode)return;const m=heatMode;let mx=1;
  if(m==='econ'){for(const b of S.buildings)mx=Math.max(mx,bIncome(b));}
  for(const d of S.unlocked){for(const [x,y] of plotsOf(d)){const b=occ.get(x+','+y);let v=null;
    if(m==='happy'){let s=S.happy/100;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const n=occ.get((x+dx)+','+(y+dy));if(!n||!isReady(n))continue;const tg=TYPES[n.t].tags;if(tg.includes('green')||tg.includes('ent'))s+=.04;if(tg.includes('polluter'))s-=.09;if(tg.includes('service'))s+=.03;}v=clamp(s,0,1);}
    else if(m==='service'){let s=0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const n=occ.get((x+dx)+','+(y+dy));if(n&&isReady(n)&&(TYPES[n.t].tags.includes('service')||n.t==='pref'))s+=Math.sqrt(sc(n))/(1+Math.max(Math.abs(dx),Math.abs(dy))*.3);}v=clamp(s/2.5,0,1);}
    else if(b&&isReady(b)&&b.t!=='prj'){const T=TYPES[b.t];if(m==='econ'&&T.inc)v=Math.log10(bIncome(b)+1)/Math.log10(mx+1);
      else if(m==='power'){if(T.f.pw>0)v=1.01;else if(T.f.pw<0)v=C.powEff<1?0:.5;}
      else if(m==='syn'&&b._s)v=clamp((b._s.m-1)*1.2+.5,0,1);}
    if(v!==null)heat.push([x,y,v]);}}
  if(m==='traffic'){const ratio=C.trafD/Math.max(1,C.trafC);const loads=[];let lm=0.0001;for(let y=0;y<HT;y++)for(let x=0;x<WT;x++){if(!isRoad(x,y)||!roadActive(x,y))continue;let l=0;
      for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const n=occ.get((x+dx)+','+(y+dy));if(!n||!isReady(n))continue;const f=TYPES[n.t].f;const s=TYPES[n.t].cat==='deco'?1:sc(n);l+=((f.pop||0)*.02+(f.jobs||0)*.01+(f.tour||0)*.03)*s;}loads.push([x,y,l]);lm=Math.max(lm,l);}
    for(const [x,y,l] of loads)heat.push([x,y,clamp(l/lm*Math.min(1.2,ratio+.15),0,1)]);}}
function heatColor(v){const m=heatMode;if(m==='power')return v>1?'rgba(255,200,40,.65)':v<.25?'rgba(255,80,90,.6)':'rgba(47,208,138,.55)';
  if(m==='service')return `rgba(142,92,255,${.12+v*.55})`;if(m==='econ')return `rgba(${255},${Math.round(220-v*120)},${Math.round(120-v*120)},${.15+v*.55})`;
  let r,g;const t=m==='traffic'?1-v:v;if(t<.5){r=255;g=Math.round(90+t*2*150);}else{r=Math.round(255-(t-.5)*2*210);g=208;}return `rgba(${r},${g},${m==='syn'&&Math.abs(v-.5)<.04?255:90},.55)`;}

/* =====================================================================
   RENDER
   ===================================================================== */
const stars=Array.from({length:70},()=>[Math.random(),Math.random()*.6,Math.random()*1.5+.5]);
const clouds=Array.from({length:7},()=>({x:Math.random(),y:Math.random()*.5,s:rnd(.6,1.3),v:rnd(.004,.012)}));
const rain=Array.from({length:90},()=>[Math.random(),Math.random(),rnd(.8,1.4)]);let flashT=0;
function skyCols(n){return [mix('#6fc8ff','#1b1650',n),mix('#bfe9ff','#3d2f7a',n),mix('#ffe9c4','#5a3d8a',n)];}
function render(){
  const cyc=(TIME/240)%1;NIGHT=clamp((Math.cos(cyc*Math.PI*2)*-1-.2)*1.2,0,1);NIGHT=NIGHT*NIGHT*(3-2*NIGHT);
  X=ctx;TINT=null;LIGHTS=[];X.setTransform(DPR,0,0,DPR,0,0);
  const sc2=skyCols(NIGHT);const gr=X.createLinearGradient(0,0,0,H);gr.addColorStop(0,sc2[0]);gr.addColorStop(.6,sc2[1]);gr.addColorStop(1,sc2[2]);X.fillStyle=gr;X.fillRect(0,0,W,H);
  if(NIGHT>.05){for(const [x,y,r] of stars){X.fillStyle='#fff';X.globalAlpha=NIGHT*(.5+.5*Math.sin(TIME*2+x*40));X.fillRect(x*W,y*H,r,r);}X.globalAlpha=1;}
  if(S.cos.eq.sky==='sky_aurora'&&NIGHT>.1){for(let k=0;k<3;k++){X.beginPath();for(let i=0;i<=20;i++){const x=i/20*W;const y=H*.14+k*24+Math.sin(i*.6+TIME*.7+k)*18;i?X.lineTo(x,y):X.moveTo(x,y);}X.strokeStyle=`hsla(${140+k*40},90%,65%,${.35*NIGHT})`;X.lineWidth=18;X.stroke();}}
  for(const c of clouds){c.x+=c.v*0.016;if(c.x>1.2)c.x=-.2;const x=c.x*W,y=c.y*H*.6+30;X.globalAlpha=(.75-NIGHT*.45)*(weather&&weather.k==='storm'?1.2:1);X.fillStyle=weather&&weather.k==='storm'?'#9aa0b5':'#fff';for(const [dx,dy,r] of [[0,0,22],[22,-8,26],[46,0,20],[20,6,22]]){X.beginPath();X.arc(x+dx*c.s,y+dy*c.s,r*c.s,0,Math.PI*2);X.fill();}X.globalAlpha=1;}
  X.setTransform(DPR*cam.z,0,0,DPR*cam.z,DPR*(W/2-cam.x*cam.z),DPR*(H/2-cam.y*cam.z));
  if(groundDirty)drawGround();X.drawImage(gcv,GOFF.x,GOFF.y,GW,GH);
  for(let y=13;y<18;y++)for(let x=19;x<24;x++){const [px,py]=proj(x+.5,y+.5);X.strokeStyle='rgba(255,255,255,.55)';X.lineWidth=1.2;const o=Math.sin(TIME*2+x+y)*3;X.beginPath();X.moveTo(px-8+o,py);X.quadraticCurveTo(px-4+o,py-3,px+o,py);X.stroke();}
  const [vx0,vy0]=s2w(-80,-320),[vx1,vy1]=s2w(W+80,H+160);const vis=(wx,wy)=>wx>vx0&&wx<vx1&&wy>vy0&&wy<vy1;
  if(heatMode){for(const [x,y,v] of heat){const tp=tilePoly(x,y);X.beginPath();X.moveTo(...tp[0]);for(let k=1;k<4;k++)X.lineTo(...tp[k]);X.closePath();X.fillStyle=heatColor(v);X.fill();}}
  if(targetPlot&&sheetMode==='build'){radius(targetPlot[0],targetPlot[1],2,'rgba(255,210,63,.8)');const tp=tilePoly(...targetPlot);X.beginPath();X.moveTo(...tp[0]);for(let k=1;k<4;k++)X.lineTo(...tp[k]);X.closePath();X.fillStyle=`rgba(255,255,255,${.35+.2*Math.sin(TIME*6)})`;X.fill();X.strokeStyle='#ffd23f';X.lineWidth=2.5;X.stroke();}
  let selb=null;if(sheetMode==='bld'&&selB){selb=S.buildings.find(b=>b.id===selB);if(selb){radius(selb.x,selb.y,2,'rgba(255,255,255,.7)');}}
  const D=[];
  for(const b of S.buildings){const [cx,cy]=bWorld(b);if(vis(cx,cy))D.push({d:b.x+b.y+1,b,cx,cy});}
  for(const d of S.unlocked){const D0=DIST[d];for(const [x,y] of plotsOf(d)){if(occ.has(x+','+y))continue;const h=hash(x*131+y*71);if(h%3===0)continue;const [cx,cy]=proj(x+.3+(h%40)/100,y+.3+((h>>6)%40)/100);if(vis(cx,cy))D.push({d:x+y+.9,deco:D0.deco,cx,cy,seed:h%97});}
    const lv=C.devL[d]||0;if(lv>=3){const gx=(d%GXN)*DS,gy=Math.floor(d/GXN)*DS;for(let i=1;i<DS;i+=2){const p1=[gx+i+.5,gy+.92],p2=[gx+.92,gy+i+.5];for(const [u,v] of [p1,p2]){const [cx,cy]=proj(u,v);if(vis(cx,cy))D.push({d:u+v,fn:lv>=4?()=>goldLamp(cx,cy):()=>tree(cx,cy,.55,treeCols()[0],treeCols()[1])});}}}}
  {const [fx,fy]=proj(1.5,1.5);D.push({d:3,fn:()=>dFountain(fx,fy)});const [sx,sy]=proj(1.5,5.5);D.push({d:7,fn:()=>dStatue(sx,sy)});}
  {const [bx,by]=proj(19+((TIME*.08)%1)*4.5,15.5);D.push({d:35,fn:()=>{ell(bx,by,9,4.5,'rgba(255,255,255,.4)',false);box(bx,by,.26,.14,4,'#ff5d6c');line(bx,by-4,bx,by-18,'#6b5a8f',1.2);poly([[bx,by-18],[bx+9,by-8],[bx,by-7]],'#ffffff');}});}
  for(const a of agents){const [u,v,dx,dy]=agentPos(a);const [wx,wy]=proj(u,v);if(!vis(wx,wy))continue;D.push({d:u+v,fn:a.car?()=>drawCar(a,u,v,dx,dy):()=>drawPed(a,u,v)});}
  for(let d=0;d<=15;d++){if(d===11||!DIST[d])continue;if(S.unlocked.includes(d)&&!(unlockAnim&&unlockAnim.d===d))continue;if(d===10&&S.ess<1)continue;if(d>=12&&!map1Done())continue;const gx=d%GXN,gy=Math.floor(d/GXN);const [cx,cy]=proj(gx*DS+3.5,gy*DS+3.5);if(!vis(cx,cy))continue;D.push({d:gx*DS+gy*DS+6.5,fog:d,cx,cy});}
  for(const d in C.cx){if(!S.unlocked.includes(+d))continue;D.push({d:-1,fn:()=>bunting(+d,C.cx[d])});}
  D.sort((a,b)=>a.d-b.d);
  for(const it of D){if(it.b)drawBuilding(it.b,it.cx,it.cy);else if(it.deco)deco(it.deco,it.cx,it.cy,it.seed);else if(it.fn)it.fn();else if(it.fog!==undefined)drawFog(it.fog,it.cx,it.cy);}
  if(selb&&selb._s){const [sx,sy]=bWorld(selb);X.setLineDash([4,4]);for(const [x,y,s] of selb._s.src){const [nx,ny]=proj(x+.5,y+.5);line(sx,sy-6,nx,ny-6,s>0?'rgba(47,208,138,.95)':'rgba(255,93,108,.95)',2.2);}X.setLineDash([]);}
  for(const c of worldCoins){const y=c.y-c.z-8;ell(c.x,c.y,6,3,'rgba(43,35,80,.2)',false);drawCoin(c.x,y+Math.sin(TIME*4+c.spin)*1.5,7,TIME*4+c.spin);}
  if(superChest){const s2=superChest;const b2=Math.abs(Math.sin(TIME*4))*6;glow(s2.x,s2.y-14,40,'rgba(200,150,255,.7)');ell(s2.x,s2.y,14,7,'rgba(43,35,80,.25)',false);
    X.save();X.translate(s2.x,s2.y-b2);X.rotate(Math.sin(TIME*8)*.08);box(0,0,.42,.32,12,'#b25cff');box(0,0,.44,.34,6,'#d6a3ff',12);ell(0,-14,3,3,'#ffd23f');X.restore();
    if(Math.random()<.3)parts.push({k:'spark',x:s2.x+rnd(-14,14),y:s2.y-rnd(10,30),vx:0,vy:-20,t:0,life:.7,c:'#e9d6ff'});}
  if(ceremony){const b=ceremony.b;const [cx,cy]=bWorld(b);const t=TIME-ceremony.t0;const A=P(cx,cy,-.45,.45,0),B=P(cx,cy,.45,.45,0);line(A[0],A[1],A[0],A[1]-14,'#ffd23f',2);line(B[0],B[1],B[0],B[1]-14,'#ffd23f',2);
    if(t<1.2){X.beginPath();X.moveTo(A[0],A[1]-11);X.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2-6,B[0],B[1]-11);X.strokeStyle='#ff3b5c';X.lineWidth=3;X.stroke();ell((A[0]+B[0])/2,(A[1]+B[1])/2-9,4,3,'#ff3b5c');}
    else{const f=Math.min(1,(t-1.2)*1.5);X.strokeStyle='#ff3b5c';X.lineWidth=3;X.beginPath();X.moveTo(A[0],A[1]-11);X.lineTo(lerp(A[0],(A[0]+B[0])/2,.6),lerp(A[1]-11,(A[1]+B[1])/2+4,f));X.moveTo(B[0],B[1]-11);X.lineTo(lerp(B[0],(A[0]+B[0])/2,.6),lerp(B[1]-11,(A[1]+B[1])/2+4,f));X.stroke();}}
  for(const p of parts){const a=1-p.t/p.life;if(p.k==='smoke'||p.k==='steam'){X.globalAlpha=a*(p.k==='steam'?.6:.55);X.fillStyle=p.c||mix('#ffffff','#9aa0b5',NIGHT*.5);X.beginPath();X.arc(p.x,p.y,p.r,0,Math.PI*2);X.fill();}
    else if(p.k==='spark'){X.globalAlpha=a;X.fillStyle=p.c;const s=3*a+1;X.beginPath();X.moveTo(p.x,p.y-s*1.6);X.lineTo(p.x+s*.5,p.y);X.lineTo(p.x,p.y+s*1.6);X.lineTo(p.x-s*.5,p.y);X.closePath();X.fill();X.beginPath();X.moveTo(p.x-s*1.6,p.y);X.lineTo(p.x,p.y+s*.5);X.lineTo(p.x+s*1.6,p.y);X.lineTo(p.x,p.y-s*.5);X.closePath();X.fill();}
    else if(p.k==='conf'){X.globalAlpha=a;X.fillStyle=p.c;X.save();X.translate(p.x,p.y);X.rotate(p.r+p.t*8);X.fillRect(-2.5,-1.5,5,3);X.restore();}}
  X.globalAlpha=1;
  if(unlockAnim){const d=unlockAnim.d,gx=d%GXN,gy=Math.floor(d/GXN);const t=unlockAnim.t;const [ax,ay]=proj(gx*DS+.5,gy*DS+3.5);const op=ease(clamp((t-.5)/1.2,0,1));const h=60;
    line(ax,ay,ax,ay-h,'#ffd23f',5);const [bx,by]=proj(gx*DS+.5,gy*DS+5.5);const [bx2,by2]=proj(gx*DS+.5,gy*DS+1.5);line(bx,by,bx,by-h,'#ff5d6c',5);line(bx2,by2,bx2,by2-h,'#ff5d6c',5);
    X.globalAlpha=1-op;poly([[bx2,by2-h+6],[ax,ay-h+6+op*30],[ax,ay-h+16+op*30],[bx2,by2-h+16]],'#ff5d6c');poly([[ax,ay-h+6+op*30],[bx,by-h+6],[bx,by-h+16],[ax,ay-h+16+op*30]],'#ff5d6c');X.globalAlpha=1;
    for(let i=0;i<6;i++)ball(bx2+(bx-bx2)*i/5,by2-h-8+(by-by2)*i/5+Math.sin(TIME*3+i)*3,5,['#ff5d6c','#ffd23f','#2fd08a','#5aa9ff','#9b5de5','#ff8fab'][i]);}
  for(const f of floats){const a=f.t<1?1:1-(f.t-1)/.4;const y=f.y-ease(Math.min(1,f.t))*36;const s=f.t<.15?f.s*(0.6+f.t/.15*.6):f.s*1.2-Math.min(.2,(f.t-.15))*f.s;
    X.globalAlpha=a;X.font=`${Math.max(8,s)}px "Lilita One",sans-serif`;X.textAlign='center';X.textBaseline='middle';X.lineWidth=4;X.strokeStyle='#2b2350';X.lineJoin='round';X.strokeText(f.txt,f.x,y);X.fillStyle=f.c;X.fillText(f.txt,f.x,y);}
  X.globalAlpha=1;
  X.setTransform(DPR,0,0,DPR,0,0);
  const storm=weather&&weather.k==='storm';const dark=NIGHT*.5+(storm?.22:0);if(dark>.02){X.fillStyle=`rgba(24,18,80,${dark})`;X.fillRect(0,0,W,H);}
  if(weather&&weather.k==='heat'){X.fillStyle='rgba(255,150,40,.13)';X.fillRect(0,0,W,H);const g2=X.createRadialGradient(W-40,40,10,W-40,40,160);g2.addColorStop(0,'rgba(255,240,170,.8)');g2.addColorStop(1,'rgba(255,200,80,0)');X.fillStyle=g2;X.fillRect(W-200,0,200,200);}
  X.setTransform(DPR*cam.z,0,0,DPR*cam.z,DPR*(W/2-cam.x*cam.z),DPR*(H/2-cam.y*cam.z));
  X.globalCompositeOperation='lighter';
  const nl=Math.max(NIGHT,storm?.4:0);
  for(const L of LIGHTS){if(L.p){if(nl<.25&&!L.always)continue;X.globalAlpha=L.always?Math.max(.55,nl):nl;X.beginPath();X.moveTo(...L.p[0]);for(let k=1;k<4;k++)X.lineTo(...L.p[k]);X.closePath();X.fillStyle=L.c;X.fill();}
    else{X.globalAlpha=Math.max(.35,nl);const g=X.createRadialGradient(L.x,L.y,0,L.x,L.y,L.r);g.addColorStop(0,L.c);g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.fillRect(L.x-L.r,L.y-L.r,L.r*2,L.r*2);}}
  X.globalCompositeOperation='source-over';X.globalAlpha=1;
  if(S.set.ind&&cam.z>=.7)drawIndicators(vis);
  X.setTransform(DPR,0,0,DPR,0,0);
  if(storm){X.strokeStyle='rgba(200,220,255,.55)';X.lineWidth=1.2;X.beginPath();for(const r of rain){r[1]+=.03*r[2];if(r[1]>1)r[1]-=1;const x=r[0]*W+r[1]*40,y=r[1]*H;X.moveTo(x,y);X.lineTo(x-5,y+14);}X.stroke();
    if(Math.random()<.004){flashT=.12;sfx('thunder');}if(flashT>0){flashT-=.016;X.fillStyle=`rgba(255,255,255,${flashT*3})`;X.fillRect(0,0,W,H);}}
  if((S.cos.eq.sky==='sky_fire'&&NIGHT>.4)||TIME<fwUntil)fireworks();
  {const n=S.cos.eq.sky==='sky_balloon'?4:1;for(let i=0;i<n;i++){const x=((TIME*12+i*260)%(W+200))-100,y=H*.28+Math.sin(TIME*.5+i*2)*20+i*30;balloon(x,y,S.cos.eq.sky==='sky_balloon'?`hsl(${(i*90+TIME*20)%360},85%,62%)`:'#ff5d6c');}}
  {const np=prjDone('aero')?3:1;for(let i=0;i<np;i++){const px=((TIME*40+i*330)%(W+400))-200,py=H*.14+i*24+Math.sin(TIME*.3+i)*10;plane(px,py);}}
  if(meteor){const m=meteor;const dir=Math.sign(m.vx);for(let i=0;i<10;i++){X.globalAlpha=(1-i/10)*.6;X.fillStyle=i%2?'#fff3a8':'#ffb703';X.beginPath();X.arc(m.x-dir*i*7,m.y-i*1.2,10-i*.8,0,Math.PI*2);X.fill();}X.globalAlpha=1;
    const g=X.createRadialGradient(m.x,m.y,0,m.x,m.y,30);g.addColorStop(0,'rgba(255,240,160,.9)');g.addColorStop(1,'rgba(255,200,0,0)');X.fillStyle=g;X.fillRect(m.x-30,m.y-30,60,60);star(m.x,m.y,13,6,TIME*5,'#ffd23f');}
  for(const f of fly){if(f.t<0)continue;const t=ease(f.t/f.d);const x=(1-t)*(1-t)*f.sx+2*(1-t)*t*f.cx+t*t*f.tx,y=(1-t)*(1-t)*f.sy+2*(1-t)*t*f.cy+t*t*f.ty;drawCoin(x,y,9-t*3,TIME*10+f.sx);}
  for(const c of confetti){X.save();X.translate(c.x,c.y);X.rotate(c.r);X.fillStyle=c.c;X.globalAlpha=Math.min(1,(c.life-c.t)*2);X.fillRect(-c.w/2,-c.h/2,c.w,c.h*Math.abs(Math.cos(c.t*6+c.r)));X.restore();}X.globalAlpha=1;
  if(combo.n>=3){X.font='22px "Lilita One",sans-serif';X.textAlign='center';X.lineWidth=5;X.strokeStyle='#2b2350';const s=1+Math.max(0,combo.t-2.2)*.6;X.save();X.translate(W/2,H*.32);X.scale(s,s);X.strokeText('COMBO ×'+combo.n,0,0);X.fillStyle='#ff8fab';X.fillText('COMBO ×'+combo.n,0,0);X.restore();}}
function radius(x,y,r,col){const A=proj(x-r,y-r),B=proj(x+r+1,y-r),C2=proj(x+r+1,y+r+1),D2=proj(x-r,y+r+1);X.beginPath();X.moveTo(...A);X.lineTo(...B);X.lineTo(...C2);X.lineTo(...D2);X.closePath();X.setLineDash([6,5]);X.strokeStyle=col;X.lineWidth=2;X.stroke();X.setLineDash([]);X.fillStyle='rgba(255,255,255,.08)';X.fill();}
function goldLamp(x,y){line(x,y,x,y-18,'#b88300',1.6);ell(x,y-19,2.4,2.4,'#fff3a8');if(NIGHT>.2)glow(x,y-19,14,'rgba(255,220,120,.85)');const wv=Math.sin(TIME*4+x)*1.5;poly([[x,y-17],[x+6,y-15+wv],[x,y-13]],'#ff5d6c',false);}
function bunting(d,ids){const gx=(d%GXN)*DS,gy=Math.floor(d/GXN)*DS;const col=CPLX.find(c=>c.id===ids[0]).col;const pts=[proj(gx+1,gy+1),proj(gx+DS,gy+1),proj(gx+DS,gy+DS),proj(gx+1,gy+DS)];
  for(let s=0;s<2;s++){const A=pts[s],B=pts[s+1];const n=8;for(let i=0;i<n;i++){const t=(i+.5)/n;const x=lerp(A[0],B[0],t),y=lerp(A[1],B[1],t)-20+Math.sin(t*Math.PI)*5;poly([[x-3,y],[x+3,y],[x,y+5]],i%2?col:'#ffffff',false);}
    X.beginPath();X.moveTo(A[0],A[1]-20);X.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2-14,B[0],B[1]-20);X.strokeStyle='rgba(43,35,80,.4)';X.lineWidth=.8;X.stroke();}}
function drawIndicators(vis){const now=Date.now();for(const b of S.buildings){if(b.ready>now||b.t==='prj')continue;const T=TYPES[b.t];if(T.cat==='deco')continue;const [cx,cy]=bWorld(b);if(!vis(cx,cy))continue;
  let ic=null,col='#ff5d6c';const d=distOf(b.x,b.y);
  if(S.dmg[d]>now)ic='!';else if(T.f.pw<0&&C.powEff<.9)ic='⚡';else if(T.f.gd&&C.supply<.6)ic='▣';else if(T.f.jobs&&C.staff<.5&&S.pop>30&&b.t!=='pref'&&T.cat!=='res')ic='☺';
  else if(b._s&&b._s.m>=1.12){ic='▲';col='#2fd08a';}else if(b._s&&b._s.m<=.9){ic='▼';col='#ff5d6c';}
  if(!ic)continue;const x=cx+16,y=cy-6;X.beginPath();X.arc(x,y,5.5,0,Math.PI*2);X.fillStyle=col;X.fill();X.strokeStyle='#fff';X.lineWidth=1.5;X.stroke();X.font='7px "Lilita One",sans-serif';X.fillStyle='#fff';X.textAlign='center';X.textBaseline='middle';X.fillText(ic,x,y+.5);}}
let fws=[],fwT=0;
function fireworks(){fwT-=.016;if(fwT<=0){fwT=rnd(.5,1.2);const x=rnd(W*.1,W*.9),y=rnd(H*.08,H*.3),c=`hsl(${ri(0,360)},100%,65%)`;for(let i=0;i<28;i++){const a=i/28*Math.PI*2;fws.push({x,y,vx:Math.cos(a)*rnd(60,90),vy:Math.sin(a)*rnd(60,90),t:0,c});}}
  X.globalCompositeOperation='lighter';for(const p of fws){p.t+=.016;p.x+=p.vx*.016;p.y+=p.vy*.016;p.vy+=40*.016;X.globalAlpha=Math.max(0,1-p.t/1.3);X.fillStyle=p.c;X.fillRect(p.x-1.5,p.y-1.5,3,3);}fws=fws.filter(p=>p.t<1.3);X.globalAlpha=1;X.globalCompositeOperation='source-over';}
function balloon(x,y,c){line(x,y+16,x,y+26,'rgba(43,35,80,.6)',1);X.beginPath();X.ellipse(x,y,12,15,0,0,Math.PI*2);X.fillStyle=c;X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();X.fillStyle='rgba(255,255,255,.5)';X.beginPath();X.ellipse(x-4,y-5,3,5,-.3,0,Math.PI*2);X.fill();X.fillStyle='#b07a4a';X.fillRect(x-4,y+24,8,6);}
function plane(x,y){X.fillStyle='#ffffff';X.strokeStyle=OUT;X.lineWidth=1.3;X.beginPath();X.ellipse(x,y,18,5,0,0,Math.PI*2);X.fill();X.stroke();X.beginPath();X.moveTo(x-2,y);X.lineTo(x-10,y+10);X.lineTo(x+2,y+1);X.closePath();X.fillStyle='#ff5d6c';X.fill();X.stroke();
  X.beginPath();X.moveTo(x-14,y-2);X.lineTo(x-18,y-10);X.lineTo(x-10,y-3);X.closePath();X.fill();X.stroke();line(x-60,y,x-22,y,'rgba(255,255,255,.6)',3);if(NIGHT>.3&&Math.sin(TIME*8)>0){X.fillStyle='#ff4d6d';X.beginPath();X.arc(x+16,y,2,0,Math.PI*2);X.fill();}}
function drawCoin(x,y,r,spin){const sx=Math.abs(Math.cos(spin));X.save();X.translate(x,y);X.scale(Math.max(.25,sx),1);X.beginPath();X.arc(0,0,r,0,Math.PI*2);X.fillStyle='#e9a400';X.fill();X.beginPath();X.arc(0,-.8,r*.86,0,Math.PI*2);X.fillStyle='#ffd34d';X.fill();X.strokeStyle='#b97a00';X.lineWidth=1.2;X.stroke();
  X.beginPath();X.arc(0,-.8,r*.5,0,Math.PI*2);X.strokeStyle='#e9a400';X.lineWidth=1.5;X.stroke();X.fillStyle='rgba(255,255,255,.7)';X.beginPath();X.ellipse(-r*.35,-r*.4,r*.18,r*.3,0,0,Math.PI*2);X.fill();X.restore();}
function treeCols(){const t=S.cos.eq.tree;if(t==='tree_sakura')return['#ffb7d5','#ff8fc0'];if(t==='tree_autumn')return['#ffb347','#ff7b39'];if(t==='tree_candy')return['#c8a8ff','#7ef0e0'];return['#5fd35f','#3cb44b'];}
function deco(style,x,y,seed){const sw=Math.sin(TIME*1.6+seed)*1.5;
  switch(style){
    case 'round':case 'lamp':{const [c1,c2]=treeCols();ell(x,y,7,3.5,'rgba(43,35,80,.16)',false);line(x,y,x,y-9,'#8b5a2b',3);ball(x+sw,y-15,8,seed%2?c1:c2);ball(x+sw-4,y-12,5,c1);
      if(style==='lamp'&&seed%3===0){const lx=x+10,ly=y+3;line(lx,ly,lx,ly-20,'#4a4a6a',1.6);ell(lx,ly-21,2.6,2.6,'#fff6c2');if(NIGHT>.2)glow(lx,ly-21,16,'rgba(255,230,150,.8)');}break;}
    case 'pine':pine(x,y,1,'#2e9e5b');break;
    case 'cypress':{const [c1]=treeCols();ell(x,y,5,2.5,'rgba(43,35,80,.16)',false);X.beginPath();X.ellipse(x+sw*.5,y-13,5,13,0,0,Math.PI*2);X.fillStyle=S.cos.eq.tree?c1:'#2f9e6a';X.fill();X.strokeStyle=OUT;X.lineWidth=1.2;X.stroke();break;}
    case 'neon':{line(x,y,x,y-22,'#2b2350',2);const hue=(seed*47+TIME*40)%360;X.beginPath();X.arc(x,y-24,4,0,Math.PI*2);X.fillStyle=`hsl(${hue},100%,65%)`;X.fill();glow(x,y-24,18,`hsla(${hue},100%,65%,.8)`);break;}
    case 'crystal':{ell(x,y,6,3,'rgba(43,35,80,.16)',false);const c=seed%2?'#7df9ff':'#c9a8ff';poly([[x-5,y-2],[x-2,y-20],[x+1,y-2]],c);poly([[x,y-1],[x+4,y-14],[x+7,y-1]],shade(c,-.15));if(NIGHT>.2)glow(x,y-10,14,'rgba(160,240,255,.6)');break;}
    case 'palm':palm(x,y,1);break;
    case 'holo':{ell(x,y,6,3,'rgba(80,200,255,.3)',false);const hy=y-16+Math.sin(TIME*2+seed)*2;X.beginPath();X.moveTo(x,hy-9);X.lineTo(x+7,hy);X.lineTo(x,hy+9);X.lineTo(x-7,hy);X.closePath();X.fillStyle='rgba(120,220,255,.55)';X.fill();X.strokeStyle='#4cc9f0';X.stroke();glow(x,hy,14,'rgba(76,201,240,.6)');break;}
    case 'cloud':{const yy=y-6+Math.sin(TIME+seed)*1.5;ball(x-5,yy,5,'#ffffff');ball(x+4,yy-1,6,'#ffffff');ball(x,yy-5,5,'#ffffff');break;}
    case 'star':{const yy=y-14+Math.sin(TIME*1.5+seed)*3;star(x,yy,6,2.5,TIME*.5+seed,'#ffd166');glow(x,yy,14,'rgba(255,209,102,.7)');break;}}}
function dFountain(cx,cy){cyl(cx,cy,16,0,6,'#c9d3e8');ell(cx,cy-6,13,6.5,'#6fd0ff',false);cyl(cx,cy,3,6,10,'#c9d3e8');
  for(let i=0;i<10;i++){const p=(TIME*1.2+i/10)%1;const a=i/10*Math.PI*2;const r=p*11;ell(cx+Math.cos(a)*r,cy-16-Math.sin(p*Math.PI)*12+Math.sin(a)*r*.5+p*8,1.6,1.6,'#e0f7ff',false);}}
function dStatue(cx,cy){box(cx,cy,.4,.4,8,'#c9d3e8');const s=S.cos.eq.statue;const y=cy-8;
  if(s==='statue_founder'){const pg=TINT;TINT=gold;ell(cx,y-2,4,2,'#d9a300');box(cx,y,.1,.1,12,'#e0b030',2);ball(cx,y-18,4,'#f2c040');line(cx+2,y-12,cx+8,y-20,'#d9a300',2.5);TINT=pg;}
  else if(s==='statue_duck'){ball(cx,y-7,9,'#ffd23f');ball(cx+5,y-17,5.5,'#ffd23f');poly([[cx+9,y-17],[cx+15,y-15],[cx+9,y-14]],'#ff8f1f');ell(cx+6,y-18.5,1.1,1.1,'#2b2350',false);}
  else if(s==='statue_robot'){box(cx,y,.2,.14,12,'#9aa7c7');box(cx,y-12,.16,.14,8,'#b7c2dc');ell(cx-2,y-21,1.4,1.4,'#7df9ff',false);ell(cx+3,y-22,1.4,1.4,'#7df9ff',false);line(cx,y-26,cx,y-32,'#6b7699',1.4);ell(cx,y-33,1.8,1.8,'#ff4d6d',false);}
  else{ell(cx,y,9,4.5,'#5fd35f',false);for(let i=0;i<6;i++)ell(cx+Math.cos(i)*6,y+Math.sin(i)*2.5-2,1.8,1.8,['#ff6fa0','#ffd23f','#fff'][i%3],false);}}
const STAGES=['Preparando o terreno','Fundação','Estrutura','Acabamento','Inauguração'];
function dStages(b,cx,cy,prog){const T=TYPES[b.t];const st=Math.min(4,Math.floor(prog*5));
  if(st===0){poly(tilePolyAt(cx,cy,.8),'#b58a5a');for(let i=0;i<4;i++){const p=P(cx,cy,[-.36,.36,.36,-.36][i],[-.36,-.36,.36,.36][i],0);poly([[p[0]-2.5,p[1]],[p[0],p[1]-7],[p[0]+2.5,p[1]]],'#ff7a1a',false);}const [ex,ey]=off(cx,cy,.1,.1);ell(ex,ey-3,8,4,'#8b6a43');box(ex-10,ey,.14,.1,4,'#ffc21a',1);return 14;}
  if(st===1){box(cx,cy,.74,.74,4,'#b8bccb');for(let i=0;i<6;i++){const p=P(cx,cy,-.3+(i%3)*.3,-.3+Math.floor(i/3)*.6,4);line(p[0],p[1],p[0],p[1]-10,'#c0563c',1.4);}return 16;}
  if(st===2){const h=8+((prog-.4)/.3)*26;box(cx,cy,.74,.74,4,'#b8bccb');const g={cx,cy,a:.32,b:.32,z0:4,h};for(const [a,bb] of [[-.32,.32],[.32,.32],[.32,-.32]]){const p0=P(cx,cy,a,bb,4),p1=P(cx,cy,a,bb,4+h);line(p0[0],p0[1],p1[0],p1[1],'#e0a64a',2);}
    for(let k=1;k<4;k++){const z=h*k/4;line(...fp(g,0,0,z),...fp(g,0,1,z),'#e0a64a',1.5);line(...fp(g,1,0,z),...fp(g,1,1,z),'#e0a64a',1.5);}crane(cx,cy);return h+20;}
  X.save();X.globalAlpha=st===3?.55:1;const top=T.draw(b,cx,cy,1,0);X.restore();
  if(st===3){const g={cx,cy,a:.4,b:.4,z0:0,h:top*.8};for(const [a,bb] of [[-.4,.4],[.4,.4],[.4,-.4]]){const p0=P(cx,cy,a,bb,0),p1=P(cx,cy,a,bb,top*.8);line(p0[0],p0[1],p1[0],p1[1],'#e0a64a',1.6);}for(let k=1;k<4;k++){const z=top*.8*k/4;line(...fp(g,0,0,z),...fp(g,0,1,z),'#e0a64a',1.2);}crane(cx,cy);}
  else{const A=P(cx,cy,-.45,.45,0),B=P(cx,cy,.45,.45,0);line(A[0],A[1],A[0],A[1]-12,'#ffd23f',2);line(B[0],B[1],B[0],B[1]-12,'#ffd23f',2);X.beginPath();X.moveTo(A[0],A[1]-9);X.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2-4,B[0],B[1]-9);X.strokeStyle='#ff3b5c';X.lineWidth=3;X.stroke();}
  return top;}
function crane(cx,cy){const [kx,ky]=off(cx,cy,.3,-.3);line(kx,ky-3,kx,ky-56,'#ffb703',3);const a=Math.sin(TIME*.8)*.6;line(kx,ky-56,kx+Math.cos(a)*30,ky-56+Math.sin(a)*6,'#ffb703',3);const hx=kx+Math.cos(a)*24;line(hx,ky-56+Math.sin(a)*5,hx,ky-38,'#6b5a8f',1);box(hx,ky-32,.1,.1,5,'#c97b3c');}
function drawBuilding(b,cx,cy){
  const T=TYPES[b.t];const now=Date.now();const busy=b.ready>now;const tier=tierOf(b.lvl);const hf=1+.09*Math.min(tier,6);
  if(T.cat!=='deco')ell(cx,cy+2,26,13,'rgba(43,35,80,.16)',false);
  X.save();let bt=TIME-(b._bounce===undefined?-9:b._bounce);if(bt<0)bt=9;let sy=1,sx=1;if(bt<1){const k=Math.sin(bt*20)*Math.exp(-bt*6);sy=1+.2*k;sx=1-.12*k;}
  let born=TIME-(b._born===undefined?-9:b._born);if(born<0)born=9;let drop=0;if(born<.5&&!busy)drop=(1-ease(born/.5))*120;
  X.translate(cx,cy);X.scale(sx,sy);X.translate(-cx,-cy-drop);
  const golden=ev&&ev.k==='golden'&&ev.bid===b.id;TINT=golden?gold:b.skin&&SKINS[b.skin]?SKINS[b.skin].r:(tier>=6&&b.t!=='dourada'&&Math.sin(TIME*1.5+b.id)>.96?gold:null);
  let top;const tot=Math.max(1,b.bt0||buildTime(b.t)||10);const prog=busy?1-clamp((b.ready-now)/1000/tot,0,1):1;
  if(b.t==='prj'){top=T.draw(b,cx,cy,1,0);if(busy)crane(cx,cy);}
  else if(busy)top=dStages(b,cx,cy,prog);else top=T.draw(b,cx,cy,hf,tier);
  if(b.skin&&!busy)skinFx(b,cx,cy,top);
  TINT=null;X.restore();b._top=top;
  if(busy){const p=prog;const lbl=b.t==='prj'?(PRJM[b.pid].st[(S.prj[b.pid]||{s:0}).s]||{n:''}).n:STAGES[Math.min(4,Math.floor(p*5))];
    rr(cx-22,cy-top-12,44,7,3.5);X.fillStyle='#fff';X.fill();X.strokeStyle=OUT;X.lineWidth=1;X.stroke();rr(cx-21,cy-top-11,42*p,5,2.5);X.fillStyle='#2fd08a';X.fill();
    if(cam.z>.75){X.font='7px "Nunito",sans-serif';X.textAlign='center';X.textBaseline='bottom';X.lineWidth=2.5;X.strokeStyle='#fff';X.strokeText(lbl,cx,cy-top-14);X.fillStyle='#2b2350';X.fillText(lbl,cx,cy-top-14);}return;}
  if(T.cat==='deco'||b.t==='prj'){b._bx=undefined;return;}
  if(tier>=1){const y=cy-top+4;line(cx+14,y+10,cx+14,y-6,'#6b5a8f',1.2);const wv=Math.sin(TIME*6+b.id)*1.5;poly([[cx+14,y-6],[cx+22,y-3+wv],[cx+14,y]],DIST[Math.min(9,tier)].acc,false);}
  if(tier>=2&&T.cat==='com'&&(tk('com1')||tier>=3)){const [sx,sy]=P(cx,cy,-.3,.3,top*.55);rr(sx-9,sy-4,18,8,3);X.fillStyle=DIST[1].acc;X.fill();X.strokeStyle=OUT;X.lineWidth=1;X.stroke();X.font='6px "Lilita One",sans-serif';X.fillStyle='#fff';X.textAlign='center';X.textBaseline='middle';X.fillText('ABERTO',sx,sy+.5);if(NIGHT>.25)glow(sx,sy,14,'rgba(255,200,60,.7)');}
  if(tier>=2&&T.cat==='ind'&&T.f.goods){const A=P(cx,cy,-.45,.5,1),B=P(cx,cy,.45,.5,1);line(A[0],A[1],B[0],B[1],'#5b6378',4);const t=(TIME*.4+b.id*.1)%1;const p=[lerp(A[0],B[0],t),lerp(A[1],B[1],t)];box(p[0],p[1]+2,.1,.1,4,'#c99a5b',2);}
  if(tier>=3){const on=Math.sin(TIME*5+b.id)>0;ell(cx-12,cy-top+6,2,2,on?'#ff4d6d':'#7a2b3a',false);if(on)glow(cx-12,cy-top+6,9,'rgba(255,77,109,.8)');if(NIGHT>.3)glow(cx,cy-top*.5,top*.55,'rgba(255,220,140,.18)');}
  if(tier>=4&&Math.random()<.03)parts.push({k:'spark',x:cx+rnd(-22,22),y:cy-rnd(5,top),vx:0,vy:-8,t:0,life:.9,c:'#fff3a8'});
  if(tier>=5){const y=cy-top-6+Math.sin(TIME*2)*2;poly([[cx-7,y],[cx-7,y-6],[cx-3.5,y-3],[cx,y-8],[cx+3.5,y-3],[cx+7,y-6],[cx+7,y]],'#ffd23f');}
  if(RAR.indexOf(T.rar)>=3&&Math.random()<.04)parts.push({k:'spark',x:cx+rnd(-24,24),y:cy-rnd(5,top),vx:0,vy:-14,t:0,life:.8,c:T.rar==='lendário'?'#ffe066':'#e9d6ff'});
  if(golden){glow(cx,cy-top*.5,top*.9,'rgba(255,210,60,.6)');if(Math.random()<.25)parts.push({k:'spark',x:cx+rnd(-26,26),y:cy-rnd(0,top),vx:0,vy:-25,t:0,life:.8,c:'#fff3a8'});}
  if(ev&&ev.k==='mega'&&ev.bid===b.id){const y=cy-top-26+Math.sin(TIME*5)*5;const c=`hsl(${(TIME*200)%360},100%,60%)`;poly([[cx,y+12],[cx-10,y],[cx-4,y],[cx-4,y-10],[cx+4,y-10],[cx+4,y],[cx+10,y]],c);glow(cx,y,24,'rgba(255,255,255,.6)');}
  if(b.bub>0){const bob=Math.sin(TIME*3+b.id)*3;const pop=Math.min(1,(TIME-(b.bubT||0))*4);const bx=cx,by=cy-top-14+bob;b._bx=bx;b._by=by;
    X.save();X.translate(bx,by);X.scale(pop,pop);X.beginPath();X.arc(0,0,13,0,Math.PI*2);X.fillStyle='rgba(255,255,255,.92)';X.fill();X.strokeStyle=OUT;X.lineWidth=1.5;X.stroke();X.beginPath();X.moveTo(-4,11);X.lineTo(0,17);X.lineTo(4,11);X.fill();X.restore();
    drawCoin(bx,by,8*pop,TIME*3+b.id);if(S.tut===0&&b.t==='casa'){const s=1+Math.sin(TIME*8)*.15;X.beginPath();X.arc(bx,by,18*s,0,Math.PI*2);X.strokeStyle='#ffd23f';X.lineWidth=3;X.stroke();}}
  else b._bx=undefined;}
function skinFx(b,cx,cy,top){const k=b.skin;if(k==='doces'){for(let i=0;i<8;i++){const h=hash(b.id*9+i);ell(cx-14+(h%28),cy-top*.3-((h>>5)%Math.max(1,Math.floor(top*.6))),1.3,.7,COL4[i%4],false);}}
  else if(k==='brinq'){for(let i=0;i<3;i++){const p=P(cx,cy,-.3+i*.3,.4,top*.3);ell(p[0],p[1],1.8,1.8,'#c0c8d8');}}
  else if(k==='neon'){glow(cx,cy-top*.5,top*.7,'rgba(255,79,216,.35)');}
  else if(k==='fant'){if(Math.random()<.1&&!PREVIEW)parts.push({k:'spark',x:cx+rnd(-20,20),y:cy-rnd(5,top),vx:0,vy:-10,t:0,life:.8,c:'#c9a8ff'});}
  else if(k==='scifi'){const y=cy-((TIME*20+b.id*7)%Math.max(10,top));line(cx-18,y,cx+18,y,'rgba(76,240,255,.8)',1.4);glow(cx,y,12,'rgba(76,240,255,.5)');}}
function drawFog(d,cx,cy){const D=DIST[d];let a=1;if(unlockAnim&&unlockAnim.d===d)a=1-clamp(unlockAnim.t/1.6,0,1);if(a<=0)return;
  X.globalAlpha=a*.92;for(let i=0;i<9;i++){const h=hash(d*50+i);const ox=(h%160)-80,oy=((h>>8)%70)-35;const r=22+(h>>4)%18;const fy=Math.sin(TIME*.6+i)*3;X.fillStyle=i%3?'#ffffff':'#eef0ff';X.beginPath();X.arc(cx+ox,cy+oy-r*.4+fy-(1-a)*40,r*(1+(1-a)*.5),0,Math.PI*2);X.fill();}
  X.globalAlpha=a;const y=cy-26;rr(cx-62,y-16,124,40,12);X.fillStyle='#fff8ec';X.fill();X.strokeStyle='#2b2350';X.lineWidth=2;X.stroke();
  X.fillStyle='#ffd23f';rr(cx-54,y-6,16,14,3);X.fill();X.stroke();X.beginPath();X.arc(cx-46,y-6,5,Math.PI,0);X.strokeStyle='#2b2350';X.lineWidth=2.5;X.stroke();
  X.font='11px "Lilita One",sans-serif';X.textAlign='left';X.textBaseline='middle';X.fillStyle='#2b2350';X.fillText(D.n.length>19?D.n.slice(0,18)+'…':D.n,cx-32,y-3);
  X.font='10px "Nunito",sans-serif';X.fillStyle='#7a5a00';X.fillText((D.ess&&S.ess<D.ess)?D.ess+' Essência':fmt(D.cost)+' moedas',cx-32,y+11);X.globalAlpha=1;}

/* =====================================================================
   BOOT
   ===================================================================== */
function afterLoad(){rebuildOcc();C.devL=[];updateDev(true);groundDirty=true;syncAgents(true);dirty=true;recalc();recalc();dispCoins=S.coins;ev=null;sev=null;renderEvBar();
  for(const b of S.buildings){b.bub=0;b.nextBub=rnd(4,16);if(b.ready>Date.now())b._wasBusy=true;}
  const [wx,wy]=bWorld(pref());cam.x=wx;cam.y=wy-20;cam.z=W<500?1.25:1.4;closeSheet();updateDots();tutRender();applyVol();stripRender();}
function offlineGain(sec,initial){sec=clamp(sec,0,offCap());if(sec<30)return;recalc();const v=Math.max(0,ipsBase)*sec*offRate();const rp=C.rp*sec*offRate();
  S.rp+=rp;S.crys+=C.crys*sec*offRate();const tgt=C.hcap*(.5+.5*S.happy/100)*C.mpop;S.pop=lerp(S.pop,tgt,Math.min(1,sec/60));if(v>0)earn(v);
  const d=today();let daily='';let bigDay=false;if(initial&&S.streak.day!==d){const y=new Date(Date.now()-864e5);const yd=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();S.streak.n=S.streak.day===yd?S.streak.n%7+1:1;S.streak.day=d;const g=4+S.streak.n*2;S.gems+=g;bigDay=S.streak.n===7;
    const dots=Array.from({length:7},(_,i)=>`<i style="flex:1;height:10px;border-radius:6px;background:${i<S.streak.n?'linear-gradient(90deg,#ffd23f,#ff8fab)':'var(--cream2)'};box-shadow:${i===S.streak.n-1?'0 0 0 2px #ffd23f':'none'}"></i>`).join('');
    daily=`<div class="sec" style="margin-top:2px">Sequência diária · dia ${S.streak.n} de 7</div><div style="display:flex;gap:4px;margin:2px 2px 4px">${dots}</div><div class="kv"><span>${bigDay?'Semana completa!':'Bônus de hoje'}</span><b>+${g}${bigDay?' joias + 1 Cristal':' joias'}</b></div>`;if(bigDay)S.crys+=1;}
  openModal(`<h2>Bem-vindo de volta!</h2><p>Você ficou fora por <b>${fmtTime(sec)}</b>. A cidade continuou trabalhando:</p><div class="big-num"><i class="ico coin"></i>+${fmt(v)}</div>${rp>=1?`<div class="kv"><span>Pesquisa acumulada</span><b>+${fmt(rp)}</b></div>`:''}${daily}<p class="note" style="text-align:center">Renda offline: ${Math.round(offRate()*100)}% da produção, até ${offCap()/3600}h.</p><button class="btn big" data-m="close">Continuar</button>`);
  sfx('chest');if(bigDay){screenConfetti(100);sfx('unlock');}save();}
function boot(){resize();const src=load();afterLoad();
  if(src){const away=(Date.now()-(S.last||Date.now()))/1000;if(away>30)offlineGain(away,true);else{const d=today();if(S.streak.day!==d){S.streak.day=d;S.streak.n=1;S.gems+=6;toast('Bônus diário: +6 joias','p');}}}
  else{S.streak.day=today();S.streak.n=1;}
  if(src===BACK_KEY)toast('Progresso recuperado do backup','g');ensureDaily();updHUD();
  let last=performance.now(),lastWall=Date.now();
  function frame(now){const wall=Date.now();let wd=(wall-lastWall)/1000;lastWall=wall;if(wd<0)wd=0;if(wd>30)offlineGain(wd,false);else econ(Math.min(wd,5));
    let dt=(now-last)/1000;last=now;dt=clamp(dt,0,.1);update(dt);render();requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
  window.__ccResume=()=>{groundDirty=true;for(const b of S.buildings){if(b._born>TIME)b._born=-9;if(b._bounce>TIME)b._bounce=-9;}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)save();else window.__ccResume();});window.addEventListener('pagehide',save);
  window.__cc={S:()=>S,C,build,upgrade,startEvent,unlockDistrict,tap,econ,recalc,doPrestige,essGain,research,startStage,openSheet,setTarget:p=>targetPlot=p,chooseEv,openEvent,
    forceSev:id=>{sev={id,pending:true,wait:45};renderEvBar();},openB:id=>openBuilding(S.buildings.find(b=>b.id===id)),storm:()=>{weather={k:'storm',until:TIME+30};},night:()=>{TIME=120;},finishAll:()=>{for(const b of S.buildings)if(b.ready>Date.now())b.ready=Date.now()-1;},get ips(){return ips;},
    map1Done,map2Done,plotsOf,occ,DIST,TYPES,GUIDE,distOf,render,renderSheet:()=>renderSheet(true)};}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{for(const k in thumbs)delete thumbs[k];});
window.__ccBack=()=>{if(!$('#modal').hidden){closeModal();return 'handled';}if(sheetMode){closeSheet();targetPlot=null;return 'handled';}if(heatMode){heatMode=null;renderHeatChip();return 'handled';}return 'none';};
if(window.CCNative){let started=false;const go=()=>{if(started)return;started=true;boot();};
  window.__ccRestore=s=>{if(typeof s==='string'&&s.length)window.__nativeSave=s;go();};native('ready');setTimeout(go,2000);}
else boot();
