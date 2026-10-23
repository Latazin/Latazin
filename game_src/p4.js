/* =====================================================================
   ESTADO
   ===================================================================== */
const SAVE_KEY='cartoonCityIdle_v1',BACK_KEY='cartoonCityIdle_v1_backup';
function newState(){
  return {v:2,coins:100,gems:0,ess:0,unlocked:[0],buildings:[],nid:1,cu:{},run:0,life:0,
    cnt:{built:0,upg:0,bub:0,met:0,chest:0,pres:0,ev:0,deco:0,res:0,prjDone:0,tags:{}},ach:{},daily:null,cos:{own:[],eq:{}},
    set:{music:true,sfx:true,vib:true,ind:true},tut:0,last:Date.now(),played:0,streak:{day:'',n:0},lbName:'',
    gemBoost:0,instUntil:0,maxLv:1,chestT:240,doneD:[],adCdBoost:0,adCdChest:0,adCdCar:0,
    pop:0,happy:55,rp:0,crys:0,tech:{},mods:[],prj:{},story:{},ctx:{},ctxCd:{},cxSeen:{},seenT:{},dgoal:{},dbonus:{},dmg:{},road:{},colDone:{},metas:{},rank:0,seen2:true,devSeen:{},
    ghUntil:0,ghNext:0,flash:null,flashNext:0,wheelDay:'',lbRank:0,spins:3,spinNext:0};
}
let S=newState();
function initCity(st){
  st.buildings=[];st.nid=1;
  st.buildings.push({id:st.nid++,t:'pref',x:3,y:3,lvl:1,ready:0});
  st.buildings.push({id:st.nid++,t:'casa',x:4,y:2,lvl:1,ready:0});
  st.buildings.push({id:st.nid++,t:'moinho',x:5,y:5,lvl:1,ready:0});
}
initCity(S);
const RESERVED={'1,1':'fountain','1,5':'statue'};
let ips=0,ipsBase=0,dirty=true;
const C={gm:1,gmB:1,happyT:55,hcap:0,jobs:0,wf:0,staff:1,unemp:0,pwP:0,pwC:0,powEff:1,goods:0,deliv:0,gd:0,supply:1,cust:0,cf:1,V:0,hotel:0,hotelOcc:1,
  trafD:0,trafC:1,cg:0,pol:0,polIdx:0,green:0,rp:0,crys:0,cov:{edu:1,health:1,safe:1},eduQ:1,up:0,rev:0,cx:{},devL:[],devS:[],hparts:[],transit:0,mpop:1,dc:[]};
function pref(){return S.buildings.find(b=>b.t==='pref');}
function nonPref(){return S.buildings.filter(b=>b.t!=='pref'&&b.t!=='prj'&&TYPES[b.t].cat!=='deco').length;}
function isReady(b){return !(b.ready>Date.now());}
function tk(id){return !!S.tech[id];}
function prjDone(id){return !!(S.prj[id]&&S.prj[id].s>=3);}
function distOf(x,y){if(x<0||y<0||x>=WT-1||y>=HT-1)return -1;const gx=Math.floor(x/DS),gy=Math.floor(y/DS);const d=gy*GXN+gx;return d<=15?d:-1;}
function map1Done(){for(let d=0;d<=9;d++){if(!S.unlocked.includes(d))return false;const p=plotsOf(d);if(!p.every(([x,y])=>occ.has(x+','+y)))return false;}return true;}
function map2Done(){for(let d=12;d<=15;d++){if(!S.unlocked.includes(d))return false;const p=plotsOf(d);if(!p.every(([x,y])=>occ.has(x+','+y)))return false;}return true;}
function isRoad(x,y){return x>=0&&y>=0&&x<WT&&y<HT&&(x%DS===0||y%DS===0);}
function plotsOf(d){const gx=d%GXN,gy=Math.floor(d/GXN),out=[];for(let j=1;j<DS;j++)for(let i=1;i<DS;i++){const x=gx*DS+i,y=gy*DS+j;if(d===0&&RESERVED[x+','+y])continue;out.push([x,y]);}return out;}
const occ=new Map();
function rebuildOcc(){occ.clear();for(const b of S.buildings)occ.set(b.x+','+b.y,b);}
function plotFree(x,y){const d=distOf(x,y);if(d<0||d>15||d===11||!S.unlocked.includes(d)||isRoad(x,y))return false;if(d===0&&RESERVED[x+','+y])return false;return !occ.has(x+','+y);}
function completedCount(){let c=0;for(const d of S.unlocked){const p=plotsOf(d);if(p.every(([x,y])=>occ.has(x+','+y)))c++;}return c;}
function countType(t){let c=0;for(const b of S.buildings)if(b.t===t)c++;return c;}
function countTagReady(tg){let c=0;for(const b of S.buildings)if(isReady(b)&&TYPES[b.t].tags.includes(tg))c++;return c;}
function hasCU(id){return !!S.cu[id];}
function rankOf(p){let r=0;for(let i=0;i<RANKS.length;i++)if(p>=RANKS[i][0])r=i;return r;}
function cityRank(){return Math.max(S.rank||0,rankOf(S.pop));}
function catMult(cat){let m=1;for(const u of CU)if(S.cu[u.id]&&u.m){const c=u.cat;if(c==='all'||c===cat||(c==='esp'&&['ent','extra','mon','leg'].includes(cat))||(c==='ind'&&cat==='tech'))m*=u.m;}
  if(cat==='res'&&tk('arq1'))m*=1.2;if(cat==='com'){if(tk('com1'))m*=1.25;if(tk('com3'))m*=1.5;if(tk('com4'))m*=2;}if(cat==='extra'&&tk('arq4'))m*=1.5;if(S.colDone[cat])m*=1.15;return m;}
let ev=null;let combo={n:0,t:0};let sessionT=0;
function sessionBonus(){return Math.min(0.3,0.01*Math.floor(sessionT/60));}
function gemBoostOn(){return S.gemBoost>Date.now();}
function sc(b){return (1+0.1*(b.lvl-1))*Math.pow(1.5,tierOf(b.lvl));}

/* ---------- sinergias ---------- */
function synAt(t,x,y,self){const T=TYPES[t];const out={m:1,list:[],src:[]};if(!T||T.cat==='hidden')return out;const cnt={};const who={};
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){if(!dx&&!dy)continue;const n=occ.get((x+dx)+','+(y+dy));if(!n||n.id===self||!isReady(n)||n.t==='prj')continue;const NT=TYPES[n.t];
    for(let i=0;i<SYN.length;i++){const r=SYN[i];if(T.tags.includes(r.t)&&NT.tags.includes(r.s)){cnt[i]=(cnt[i]||0)+1;(who[i]=who[i]||[]).push(n);}}}
  let sum=0;for(const i in cnt){const r=SYN[i];let v=r.v*cnt[i];v=r.v>0?Math.min(v,r.max):Math.max(v,r.max);sum+=v;out.list.push({n:r.n,v,c:cnt[i]});for(const n of who[i])out.src.push([n.x,n.y,v>0?1:-1]);}
  out.m=Math.max(.3,1+sum);return out;}
function placeScore(t,x,y){const T=TYPES[t];let s=synAt(t,x,y,null).m;if(T.home===distOf(x,y))s+=1;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){if(!dx&&!dy)continue;const n=occ.get((x+dx)+','+(y+dy));if(!n||n.t==='prj')continue;const NT=TYPES[n.t];for(const r of SYN){if(NT.tags.includes(r.t)&&T.tags.includes(r.s))s+=r.v*.6;}}
  return s;}

/* ---------- simulação da cidade ---------- */
function recalc(){
  const now=Date.now();S.mods=S.mods.filter(m=>m.perm||m.until>now);
  const M={inc:1,tour:1,rp:1,happy:0,pow:1,cons:1,traffic:1,pop:1,cat:{},dist:{}};
  for(const m of S.mods){if(m.k==='cat')M.cat[m.c]=(M.cat[m.c]||1)*m.v;else if(m.k==='dist')M.dist[m.d]=(M.dist[m.d]||1)*m.v;else if(m.k==='happy')M.happy+=m.v;else if(M[m.k]!==undefined)M[m.k]*=m.v;}
  const ready=[];const dc=[];for(let d=0;d<16;d++)dc.push({_n:0});
  for(const b of S.buildings){if(b.ready>now||b.t==='prj')continue;const d=distOf(b.x,b.y);if(d<0)continue;ready.push(b);const t=TYPES[b.t];for(const tg of t.tags)dc[d][tg]=(dc[d][tg]||0)+1;if(t.cat!=='deco')dc[d]._n++;}
  C.dc=dc;C.cx={};let verde=0,civico=false;
  for(let d=0;d<=15;d++){if(d===11)continue;for(const cp of CPLX){if(cp.need.every(([tg,n])=>(dc[d][tg]||0)>=n)){(C.cx[d]=C.cx[d]||[]).push(cp.id);if(cp.id==='verde')verde++;if(cp.id==='civico')civico=true;const key=d+':'+cp.id;if(!S.cxSeen[key]){S.cxSeen[key]=1;setTimeout(()=>newComplex(cp,d),50);}}}}
  const hasCx=(d,id)=>!!(C.cx[d]&&C.cx[d].includes(id));
  for(const b of ready)b._s=synAt(b.t,b.x,b.y,b.id);
  let H=0,J=0,pwP=0,pwC=0,goods=0,gd=0,cust=0,hp=0,tour=0,edu=0,health=0,safe=0,trans=0,rp=0,pol=0,hotel=0,logi=0,green=0,up=0,crys=0,transit=0;
  const nat2=tk('amb4')?2:1;
  for(const b of ready){const t=TYPES[b.t],f=t.f,d=distOf(b.x,b.y),s=t.cat==='deco'?1:sc(b);
    if(f.pop)H+=f.pop*s*(tk('arq3')?1.3:1);
    if(f.jobs)J+=f.jobs*s*(t.cat==='ind'&&tk('ind2')?.75:1);
    if(f.pw>0)pwP+=f.pw*s*(tk('ene4')?2:1)*(d===8?2:1);
    if(f.pw<0)pwC+=-f.pw*s;
    if(f.goods){const g=f.goods*s*(tk('ind1')?1.3:1)*(tk('ind4')?2:1)*(d===2?1.5:1)*(hasCx(d,'ind')?1.5:1)*b._s.m;goods+=g;b._g=g;}
    if(f.gd)gd+=f.gd*s*(tk('com2')?.8:1);
    if(f.cust)cust+=f.cust*s*(tk('com2')?1.2:1);
    if(f.happy)hp+=f.happy*s*((t.cat==='nat'||t.cat==='deco')?nat2:1);
    if(f.tour){let v=f.tour*s;if(d===0&&(t.cat==='mon'||t.cat==='deco'))v*=2;if(d===6)v*=1.5;if(hasCx(d,'tur'))v*=1.5;tour+=v;}
    if(f.edu)edu+=f.edu*s;if(f.health)health+=f.health*s;if(f.safe)safe+=f.safe*s;
    if(f.trans)trans+=f.trans*s;if(t.tags.includes('transit'))transit++;
    if(f.rp){let v=f.rp*s*(d===5?2:1)*(hasCx(d,'campus')?1.6:1);if(t.tags.includes('tech')||t.tags.includes('school'))v*=b._s.m;rp+=v;b._rp=v;}
    if(f.pol){let v=f.pol*s;if(t.tags.includes('power')&&tk('ene3'))v*=.4;if(t.cat==='ind'&&tk('ind4'))v*=.5;if(d===2)v*=.5;pol+=v;}
    if(f.hotel)hotel+=f.hotel*s*(tk('tur3')?1.5:1);
    if(f.logi)logi+=f.logi*s;if(f.green)green+=f.green*s*(tk('amb3')?1.5:1);if(f.up)up+=f.up*s;
    if(b.t==='mina')crys+=0.004*Math.sqrt(s)*(d===14?2:1);}
  hp+=3;let roadHappy=0,roadTour=0;for(const d of S.unlocked){const r=ROADS.find(x=>x.id===(S.road[d]||'asfalto'));if(r){roadHappy+=r.happy;roadTour+=r.tour||0;}}
  tour+=roadTour;roadHappy=Math.min(8,roadHappy);
  if(prjDone('fusao')){pwP+=100000;pol*=.2;}
  if(prjDone('jardins')){M.happy+=10;M.tour*=1.5;}
  pwC*=(tk('ene2')?.8:1)*(tk('ene3')?.85:1)*M.cons;pwP*=M.pow;
  const P=S.pop;const wf=P*.55;const staff=J>0?Math.min(1,wf/J):1;const unemp=wf>J&&wf>2?(wf-J)/wf:0;
  const powEff=pwC>0?clamp(pwP/pwC,.4,1):1;
  const logF=goods>0?.5+.5*Math.min(1,logi/goods):1;const deliv=goods*logF*(.5+.5*staff)*powEff;const supply=gd>0?Math.min(1,deliv/gd):1;
  let gate=1+Math.min(1,.15*transit);if(prjDone('aero'))gate*=2;
  const tm=(tk('tur1')?1.25:1)*(tk('tur2')?1.5:1)*(tk('tur4')?2:1)*M.tour;
  const V=tour*(.5+S.happy/100)*gate*tm;const hotelOcc=hotel>0?clamp(V/hotel,.3,1):1;
  const tcap=(15+20*S.unlocked.length+trans)*(tk('tra2')?1.3:1)*(tk('tra4')?1.5:1)*(tk('aut1')?1.25:1)*(prjDone('metro')?2:1);
  let d8=0;if(dc[8]._n)d8=Math.min(.3,dc[8]._n/Math.max(1,ready.length));
  const demand=(Math.pow(P,.8)*.14+Math.pow(J,.8)*.07+Math.pow(V,.8)*.12)*M.traffic*(1-d8);const cg=Math.max(0,demand/tcap-1);
  const cf=clamp(.5+.5*(P+.5*V)/Math.max(1,cust),.5,1.4)*(1-.3*Math.min(1,cg));
  const covM=(tk('aut4')?1.3:1)*(civico?1.3:1);
  const P8=Math.pow(P,.8);const cEdu=prjDone('campus')?1:Math.min(1,edu*covM/(P8/40+1)),cHealth=Math.min(1,health*covM/(P8/50+1)),cSafe=Math.min(1,safe*covM/(P8/60+1));
  const eduQ=.8+.4*cEdu;
  const polNet=Math.max(0,pol*(tk('amb1')?.8:1)-green*.5);const polIdx=polNet/(Math.pow(P,.8)/20+5);
  const need=4+Math.pow(P,.75)/12;const amen=25*Math.min(1.6,hp/need)-15;const svc=P>250?20*((cEdu+cHealth+cSafe)/3)-10:5;
  const hparts=[['Base',55],['Lazer e natureza',amen],['Serviços públicos',svc],['Poluição',-Math.min(25,polIdx*8)],['Trânsito',-Math.min(20,cg*30)],['Desemprego',-20*unemp],['Falta de energia',-12*(1-powEff)],
    ['Ruas especiais',roadHappy],['Telhados Verdes',tk('amb2')?5:0],['Bairros Verdes',Math.min(12,verde*6)],['Eventos',M.happy]];
  let hT=0;for(const [,v] of hparts)hT+=v;hT=clamp(hT,0,100);
  const happyM=.7+.6*S.happy/100;const night=NIGHT>.5;const d7n=dc[7]._n;
  let rev=0,goldX=0;
  for(const b of S.buildings){if(b.ready>now||b.t==='prj'){b._inc=0;b._why=[];continue;}
    const t=TYPES[b.t],f=t.f,d=distOf(b.x,b.y);const base=t.inc*b.lvl*Math.pow(2,tierOf(b.lvl));const why=[];let m=1;
    if(!base){b._inc=0;b._why=why;continue;}
    if(t.home===d){m*=2;why.push(['Bairro ideal',2]);}
    const cm=b.t==='pref'?1:catMult(t.cat);if(cm!==1){m*=cm;why.push(['Melhorias e pesquisas',cm]);}
    if(b._s&&b._s.m!==1){m*=b._s.m;for(const x of b._s.list)why.push([x.n,1+x.v]);}
    const st=.5+.5*staff;const hm=.6+.8*S.happy/100;
    if(t.cat==='res'){const o=H>0?clamp(P/H,.2,1):.2;m*=o;why.push(['Moradias ocupadas',o]);if(d===3&&S.happy>=70){m*=2;why.push(['Alto padrão',2]);}}
    else if(t.cat==='com'){m*=st;why.push(['Funcionários',st]);if(f.gd){const g=.4+.6*supply;m*=g;why.push(['Mercadorias nas prateleiras',g]);}if(f.cust){m*=cf;why.push(['Movimento de clientes',cf]);}
      if(f.hotel){m*=hotelOcc;why.push(['Ocupação dos quartos',hotelOcc]);}if(d===1){m*=1.3;why.push(['Centro Comercial',1.3]);}if(t.tags.includes('food')&&hasCx(d,'gastro')){m*=1.5;why.push(['Polo Gastronômico',1.5]);}}
    else if(t.cat==='ent'){m*=st*hm;why.push(['Funcionários',st]);why.push(['Humor do público',hm]);if(d===4&&night){m*=2;why.push(['Vida noturna',2]);}if(hasCx(d,'diversao')){m*=1.5;why.push(['Distrito da Diversão',1.5]);}}
    else if(t.cat==='ind'||t.cat==='tech'){m*=st*eduQ;why.push(['Funcionários',st]);why.push(['Qualificação (escolas)',eduQ]);}
    else if(t.cat==='pub'){if(b.t!=='pref'){m*=st;why.push(['Funcionários',st]);}}
    else{m*=hm;why.push(['Humor dos visitantes',hm]);if(f.hotel){m*=hotelOcc;why.push(['Ocupação dos quartos',hotelOcc]);}if(t.cat==='leg'&&d===9){m*=1.5;why.push(['Capital Cósmica',1.5]);}}
    if(f.pw<0&&powEff<1){m*=powEff;why.push(['Falta de energia',powEff]);}
    if((t.tags.includes('attraction')||t.tags.includes('hotel'))&&hasCx(d,'tur')){m*=1.25;why.push(['Complexo Turístico',1.25]);}
    const dl=C.devL[d]||1;const dm=DEV[dl][2];if(dm!==1){m*=dm;why.push(['Bairro '+DEV[dl][0],dm]);}
    if(S.dgoal[d]){m*=1.25;why.push(['Meta do bairro concluída',1.25]);}
    if(S.dmg[d]>now){m*=.7;why.push(['Estragos da tempestade',.7]);}
    if(d===7&&d7n>1){const a=1+Math.min(.5,.02*(d7n-1));m*=a;why.push(['Aglomeração financeira',a]);}
    if(d===12&&(t.cat==='res'||t.cat==='nat')){m*=1.4;why.push(['Vale Aurora',1.4]);}
    if(d===13&&(t.cat==='tech'||t.tags.includes('attraction'))){m*=2;why.push(['Porto das Estrelas',2]);}
    if(d===14&&t.cat==='ind'){m*=1.5;why.push(['Deserto de Cristal',1.5]);}
    if(d===15){m*=1.25;why.push(['Trono dos Fundadores',1.25]);}
    if(b.skin){m*=1.1;why.push(['Estilo '+SKINS[b.skin].n,1.1]);}
    if(M.cat[t.cat]){m*=M.cat[t.cat];why.push(['Evento',M.cat[t.cat]]);}if(M.dist[d]){m*=M.dist[d];why.push(['Evento no bairro',M.dist[d]]);}
    b._inc=base*m;b._why=why;rev+=b._inc;if(ev&&ev.k==='golden'&&ev.bid===b.id)goldX+=b._inc*6;}
  const p=pref();const gmB=(1+.05*((p?p.lvl:1)-1))*(1+.05*S.ess)*(1+.1*completedCount())*happyM*M.inc*(tk('fut4')?2:1)*(prjDone('elev')?3:1);
  let gm=gmB*(1+sessionBonus());if(gemBoostOn())gm*=2;if(ev&&ev.k==='rush')gm*=3;
  const ups=up*(tk('aut2')?.7:1);
  ips=(rev+goldX)*gm-ups;ipsBase=rev*gmB-ups;
  Object.assign(C,{gm,gmB,happyT:hT,hparts,hcap:H,jobs:J,wf,staff,unemp,pwP,pwC,powEff,goods,deliv,gd,supply,cust,cf,V,hotel,hotelOcc,trafD:demand,trafC:tcap,cg,pol:polNet,polIdx,green,
    rp:rp*(tk('fut2')?1.5:1)*(prjDone('campus')?2:1)*M.rp,crys,cov:{edu:cEdu,health:cHealth,safe:cSafe},eduQ,up:ups,rev,transit,mpop:M.pop,tour,hp});
  dirty=false;
}
function bIncome(b){let v=(b._inc||0)*C.gm;if(ev&&ev.k==='golden'&&ev.bid===b.id)v*=7;return v;}
function upCost(b){const T=TYPES[b.t];if(b.t==='pref')return{c0:60,g:2.05};return{c0:T.cost*0.55*(T.cat==='pub'&&!T.inc?1.4:1),g:1.12};}
function bulkCost(b,n){const {c0,g}=upCost(b);const base=c0*Math.pow(g,b.lvl-1);return base*(Math.pow(g,n)-1)/(g-1);}
function maxAfford(b,coins){const {c0,g}=upCost(b);const base=c0*Math.pow(g,b.lvl-1);if(coins<base)return 0;return Math.max(1,Math.floor(Math.log(coins*(g-1)/base+1)/Math.log(g)));}
function buildCost(t){const T=TYPES[t];return T.cost*Math.pow(T.cat==='deco'?1.07:1.15,countType(t))*(tk('arq2')?.9:1);}
function buildTime(t){const c=TYPES[t].cost;if(c<1000||Date.now()<S.instUntil)return 0;return clamp(Math.round(Math.log10(c)*2.6),0,40);}
function typeLock(t){const T=TYPES[t];if(T.cat==='hidden')return 'Indisponível';if(T.ess&&S.ess<T.ess)return `Requer ${T.ess} de Essência Urbana`;
  if(!S.unlocked.includes(T.d))return `Requer o bairro ${DIST[T.d].n}`;if(T.only!==undefined&&!S.unlocked.includes(T.only))return `Exclusivo: ${DIST[T.only].n}`;
  if(cityRank()<T.rk)return `Cidade precisa ser ${RANKS[T.rk][1]} (${fmt(RANKS[T.rk][0])} hab.)`;if(T.req&&!tk(T.req))return `Pesquise: ${TECHM[T.req].n}`;return null;}
function spend(c){if(!(c>=0)||S.coins<c)return false;S.coins=Math.max(0,S.coins-c);return true;}
function earn(v){if(!(v>0)||!isFinite(v))return;S.coins+=v;S.run+=v;S.life+=v;dailyProg('earn',v);}
function offRate(){return (S.ess>=1?0.75:0.5)+(hasCU('banco')?0.25:0);}
function offCap(){return (S.ess>=10?8:4)*3600;}

/* ---------- nível dos bairros ---------- */
function devScore(d){const plots=plotsOf(d);const bs=[];for(const [x,y] of plots){const b=occ.get(x+','+y);if(b&&isReady(b))bs.push(b);}
  const occR=bs.length/plots.length;const nd=bs.filter(b=>TYPES[b.t].cat!=='deco'&&b.t!=='prj');const avgL=nd.length?nd.reduce((a,b)=>a+b.lvl,0)/nd.length:0;
  const lvlF=clamp(Math.log10(avgL+1)/1.7,0,1);const amen=bs.filter(b=>['nat','deco'].includes(TYPES[b.t].cat)).length;const amenF=Math.min(1,amen/5);
  const svc=bs.some(b=>TYPES[b.t].tags.includes('service')||b.t==='pref')?1:0;const road=Math.max(0,ROADS.findIndex(r=>r.id===(S.road[d]||'asfalto')));
  return clamp(100*(.38*occR+.22*lvlF+.18*amenF+.1*svc+.12*(S.happy/100))+road*3+(S.dbonus[d]||0)+(d===0?8:0),0,100);}
function devLevel(s){return s<18?0:s<38?1:s<58?2:s<78?3:4;}
function updateDev(initial){for(const d of S.unlocked){const s=devScore(d);const l=devLevel(s);const old=C.devL[d];C.devS[d]=s;if(old!==l){C.devL[d]=l;groundDirty=true;dirty=true;
  if(!initial&&old!==undefined&&l>old&&!(S.devSeen[d]>=l)){S.devSeen[d]=l;toast(DIST[d].n+' agora é '+DEV[l][0]+'!','g');const gx=d%GXN,gy=Math.floor(d/GXN);const [wx,wy]=proj(gx*DS+3.5,gy*DS+3.5);burst(wx,wy-20,24);sfx('up');}}}}

/* ---------- salvar ---------- */
const NATIVE=!!window.CCNative;function native(msg){try{if(window.CCNative)window.CCNative.postMessage(msg);}catch(e){}}
/* ---------- ranking global (Supabase) ---------- */
const LB_URL='https://zjugvnmouuxvdffeopcx.supabase.co';
const LB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdWd2bm1vdXV4dmRmZmVvcGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NjM4MjksImV4cCI6MjEwODMzOTgyOX0.lWahuMhd5358RWtOGdN55D4jfNBY0E1GNTKb4s0b-_E';
function deviceId(){try{let id=localStorage.getItem('cc_device_id');if(!id){id=(crypto.randomUUID?crypto.randomUUID():'d-'+Date.now()+'-'+Math.random().toString(36).slice(2));localStorage.setItem('cc_device_id',id);}return id;}catch(e){return 'anon';}}
let lbCache=null,lbLoading=false,lbErr=false,lbMyRank=null;
async function lbFetchTop(){if(lbLoading)return;lbLoading=true;lbErr=false;
  try{const res=await fetch(LB_URL+'/rest/v1/leaderboard?select=name,pop,life&order=pop.desc&limit=50',{headers:{apikey:LB_KEY,Authorization:'Bearer '+LB_KEY}});
    if(!res.ok)throw 0;lbCache=await res.json();}
  catch(e){lbErr=true;}
  lbLoading=false;renderSheet(true);}
function lbDefaultName(){return 'Prefeito'+deviceId().replace(/[^a-zA-Z0-9]/g,'').slice(0,4).toUpperCase();}
async function lbSubmit(silent){if(!S.lbName){S.lbName=lbDefaultName();save();}const name=S.lbName.slice(0,18)||'Jogador';
  try{const res=await fetch(LB_URL+'/rest/v1/leaderboard?on_conflict=device_id',{method:'POST',
      headers:{apikey:LB_KEY,Authorization:'Bearer '+LB_KEY,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},
      body:JSON.stringify({device_id:deviceId(),name,pop:Math.round(S.pop),life:Math.round(S.life)})});
    if(!res.ok)throw 0;if(!silent)toast('Pontuação enviada pro ranking global!','g');lbCache=null;if(!silent)lbFetchTop();}
  catch(e){if(!silent)toast('Não consegui enviar. Veja sua internet e tente de novo.','r');}}
async function lbFetchRank(){try{const res=await fetch(LB_URL+'/rest/v1/leaderboard?select=device_id&pop=gt.'+Math.round(S.pop),
    {headers:{apikey:LB_KEY,Authorization:'Bearer '+LB_KEY,Prefer:'count=exact',Range:'0-0'}});
    const cr=res.headers.get('content-range');if(cr){const total=+cr.split('/')[1];if(isFinite(total)){S.lbRank=total+1;if(sheetMode==='missions')renderSheet(true);}}}
  catch(e){}}

/* ---------- Roleta diária (3 baús misteriosos) ---------- */
const WHEEL_PRIZES=[
  {w:34,n:'Punhado de moedas',f:()=>({coins:Math.max(80,ipsBase*rnd(60,110))})},
  {w:24,n:'Moedas + joias',f:()=>({coins:Math.max(150,ipsBase*rnd(140,220)),gems:ri(3,6)})},
  {w:18,n:'Bolsa de joias',f:()=>({gems:ri(8,14)})},
  {w:12,n:'Turbo 2× por 20 min',f:()=>({boostMin:20})},
  {w:9,n:'Chuva de moedas',f:()=>({coins:Math.max(400,ipsBase*rnd(320,520)),gems:ri(4,8)})},
  {w:3,n:'Prêmio raro: Cristal',f:()=>({crys:1,gems:ri(10,18)})},
];
function wheelReady(){return S.wheelDay!==today();}
function pickWheelPrize(){const tot=WHEEL_PRIZES.reduce((a,p)=>a+p.w,0);let r=Math.random()*tot;for(const p of WHEEL_PRIZES){if(r<p.w)return p;r-=p.w;}return WHEEL_PRIZES[0];}
function claimWheel(prizeIdx){if(!wheelReady())return null;S.wheelDay=today();const p=WHEEL_PRIZES[prizeIdx];const r=p.f();
  if(r.coins)earn(r.coins);if(r.gems)S.gems+=r.gems;if(r.crys)S.crys+=r.crys;if(r.boostMin)S.gemBoost=Math.max(Date.now(),S.gemBoost)+r.boostMin*60000;
  dirty=true;save();return {p,r};}

/* ---------- Hora Dourada (produção em dobro, de surpresa) ---------- */
function goldenHourOn(){return S.ghUntil>Date.now();}
function armGoldenHour(){if(!S.ghNext)S.ghNext=Date.now()+rnd(4,7)*60000;}
function maybeTriggerGoldenHour(){if(S.tut<4)return;if(!S.ghNext){armGoldenHour();return;}
  if(Date.now()<S.ghNext||goldenHourOn())return;
  S.ghUntil=Date.now()+90000;S.ghNext=Date.now()+rnd(10,16)*60000;
  S.mods=S.mods.filter(m=>m.k!=='inc'||!m.gh);S.mods.push({k:'inc',v:2,until:S.ghUntil,gh:true,label:'Hora Dourada'});
  dirty=true;showBanner('🌟 HORA DOURADA!','Produção em dobro por 90 segundos');screenConfetti(110);sfx('unlock');vib([20,30,20,30,20]);}

/* ---------- Missão relâmpago (objetivo rápido com prêmio) ---------- */
function maybeTriggerFlash(){if(S.tut<4||S.flash)return;
  if(!S.flashNext){S.flashNext=Date.now()+rnd(3,6)*60000;return;}
  if(Date.now()<S.flashNext)return;
  const goal=Math.max(60,ipsBase*rnd(45,85));
  S.flash={goal,startRun:S.run,until:Date.now()+100000,reward:{coins:Math.round(goal*0.9),gems:ri(3,6)}};
  S.flashNext=Date.now()+rnd(6,10)*60000;
  toast('⚡ Missão relâmpago: ganhe '+fmt(goal)+' moedas em 100s!','p');sfx('event');}
function checkFlashProgress(){if(!S.flash)return;
  if(S.run-S.flash.startRun>=S.flash.goal){const r=S.flash.reward;earn(r.coins);S.gems+=r.gems;
    showBanner('⚡ Missão relâmpago!','+'+fmt(r.coins)+' moedas e +'+r.gems+' joias');screenConfetti(90);sfx('unlock');vib([20,30,20]);S.flash=null;save();return;}
  if(Date.now()>S.flash.until)S.flash=null;}

/* ---------- Caça-Moedas (caça-níqueis permanente, estilo Coin Master) ---------- */
const SLOT_REGEN_MS=12*60000;
const SLOT_SYMS=[
  {id:'c1',ic:'🪙',w:30,k:'coin',m:6},
  {id:'c2',ic:'💰',w:20,k:'coin',m:24},
  {id:'c3',ic:'🏆',w:8, k:'coin',m:85},
  {id:'gem',ic:'💎',w:16,k:'gem',v:2},
  {id:'turbo',ic:'⚡',w:14,k:'turbo',v:8},
  {id:'crys',ic:'🔮',w:4, k:'crys',v:1},
  {id:'star',ic:'⭐',w:8, k:'star'},
];
function spinCap(){return Math.min(9,5+Math.floor(S.rank/2));}
function pickSlotSym(){const tot=SLOT_SYMS.reduce((a,s)=>a+s.w,0);let r=Math.random()*tot;for(const s of SLOT_SYMS){if(r<s.w)return s;r-=s.w;}return SLOT_SYMS[0];}
function tickSpinRegen(){const cap=spinCap();
  if(S.spins>=cap){S.spinNext=0;return;}
  if(!S.spinNext){S.spinNext=Date.now()+SLOT_REGEN_MS;return;}
  if(Date.now()>=S.spinNext){S.spins=Math.min(cap,S.spins+1);dirty=true;S.spinNext=S.spins<cap?Date.now()+SLOT_REGEN_MS:0;}}
function doSpin(){if(S.spins<=0)return null;S.spins--;if(!S.spinNext)S.spinNext=Date.now()+SLOT_REGEN_MS;
  const reels=[pickSlotSym(),pickSlotSym(),pickSlotSym()];
  const combo=reels[0].id===reels[1].id&&reels[1].id===reels[2].id;const mul=combo?4:1;
  let coins=0,gems=0,crys=0,turboMin=0;
  for(const s of reels){
    if(s.k==='coin')coins+=Math.max(30,ipsBase*rnd(s.m*2,s.m*3.2));
    else if(s.k==='gem')gems+=s.v;
    else if(s.k==='crys')crys+=s.v;
    else if(s.k==='turbo')turboMin+=s.v;
    else if(s.k==='star'){coins+=Math.max(150,ipsBase*rnd(45,75));gems+=1;}
  }
  coins=Math.round(coins*mul);gems=Math.round(gems*mul);crys=Math.round(crys*mul);
  if(coins)earn(coins);if(gems)S.gems+=gems;if(crys)S.crys+=crys;
  if(turboMin){S.mods=S.mods.filter(m=>m.k!=='inc'||!m.slot);S.mods.push({k:'inc',v:2,until:Date.now()+turboMin*60000*mul,slot:true,label:'Caça-Moedas'});dirty=true;}
  dailyProg&&dailyProg('spin',1);save();
  return {reels,coins,gems,crys,turboMin,combo};}
function buySpin(){const cost=10;if(S.gems<cost||S.spins>=spinCap())return false;S.gems-=cost;S.spins=Math.min(spinCap(),S.spins+1);save();return true;}

/* ---------- anúncios (AdMob, via app nativo) ---------- */
function requestAd(kind){if(!NATIVE){toast('Anúncios só funcionam no app instalado','r');return;}native('ad:'+kind);}
window.__ccAdReward=(kind)=>{
  if(kind==='boost'){S.adCdBoost=Date.now()+15*60000;S.gemBoost=Math.max(Date.now(),S.gemBoost)+30*60000;dirty=true;toast('Anúncio assistido: +100% de renda por 30 min!','g');sfx('unlock');vib([20,30,20]);screenConfetti(40);}
  else if(kind==='chest'){S.adCdChest=Date.now()+15*60000;grantChest('ad');}
  else if(kind==='car'){S.adCdCar=Date.now()+rnd(18,26)*60000;const v=Math.max(300,ipsBase*rnd(260,420));earn(v);const g=ri(4,9);S.gems+=g;dirty=true;
    if(adCar){sparkle(adCar.x,adCar.y-14,26);adCar=null;}adCarAnnounced=false;
    toast('Carro dourado: +'+fmt(v)+' moedas e +'+g+' joias!','g');sfx('unlock');vib([20,30,20,30,20]);screenConfetti(90);}
  save();refreshPanel();};
window.__ccAdFail=()=>{toast('Anúncio indisponível agora. Tente de novo em instantes.','r');};
function serializeState(){return JSON.stringify(S,(k,v)=>k[0]==='_'?undefined:v);}
function save(){S.last=Date.now();const str=serializeState();
  try{const prev=localStorage.getItem(SAVE_KEY);localStorage.setItem(SAVE_KEY,str);if(prev&&Math.random()<0.2)localStorage.setItem(BACK_KEY,prev);}catch(e){}
  native('save:'+str);return str;}
window.__ccSave=()=>save();
function validState(o){return o&&typeof o==='object'&&Array.isArray(o.buildings)&&o.buildings.some(b=>b.t==='pref')&&isFinite(o.coins);}
function sanitize(o){const d=newState();const wasV1=!o.v||o.v<2;
  for(const k in d)if(!(k in o)||o[k]===null&&d[k]!==null)o[k]=d[k];for(const k in d.cnt)if(!(k in o.cnt))o.cnt[k]=d.cnt[k];for(const k in d.set)if(!(k in o.set))o.set[k]=d.set[k];
  o.coins=isFinite(o.coins)?Math.max(0,o.coins):0;o.gems=Math.max(0,Math.floor(o.gems||0));o.rp=isFinite(o.rp)?Math.max(0,o.rp):0;o.crys=isFinite(o.crys)?Math.max(0,o.crys):0;
  o.pop=isFinite(o.pop)?Math.max(0,o.pop):0;o.happy=isFinite(o.happy)?clamp(o.happy,0,100):55;
  for(const b of o.buildings){delete b.born;delete b.bounce;}o.buildings=o.buildings.filter(b=>TYPES[b.t]&&Number.isInteger(b.x)&&Number.isInteger(b.y)&&b.lvl>=1&&(b.t!=='prj'||PRJM[b.pid]));
  if(!o.unlocked.includes(0))o.unlocked.unshift(0);o.cos.own=o.cos.own||[];o.cos.eq=o.cos.eq||{};if(!Array.isArray(o.mods))o.mods=[];
  if(wasV1){o.v=2;o.seen2=false;if(!o.buildings.some(b=>b.t==='moinho')){const free=plotsOf(0).find(([x,y])=>!o.buildings.some(b=>b.x===x&&b.y===y));if(free)o.buildings.push({id:o.nid++,t:'moinho',x:free[0],y:free[1],lvl:1,ready:0});}
    o.pop=0;for(const b of o.buildings){const f=TYPES[b.t].f;if(f.pop)o.pop+=f.pop*(1+.1*(b.lvl-1))*.6;}}
  return o;}
function load(){const cands=[];const tryAdd=(key,s)=>{try{if(!s)return;const o=JSON.parse(s);if(validState(o))cands.push([key,o]);}catch(e){}};
  try{tryAdd(SAVE_KEY,localStorage.getItem(SAVE_KEY));}catch(e){}tryAdd('native',window.__nativeSave);
  if(cands.length){cands.sort((a,b)=>(b[1].last||0)-(a[1].last||0));S=sanitize(cands[0][1]);return cands[0][0];}
  try{tryAdd(BACK_KEY,localStorage.getItem(BACK_KEY));}catch(e){}if(cands.length){S=sanitize(cands[0][1]);return BACK_KEY;}return null;}

/* =====================================================================
   PARTÍCULAS & TEXTOS
   ===================================================================== */
let parts=[];let floats=[];let fly=[];let confetti=[];let worldCoins=[];
function floatText(wx,wy,txt,col,size){floats.push({x:wx,y:wy,txt,c:col||'#ffd23f',t:0,s:size||16});}
function sparkle(wx,wy,n,cols){for(let i=0;i<n;i++)parts.push({k:'spark',x:wx,y:wy,vx:rnd(-60,60),vy:rnd(-90,-20),t:0,life:rnd(.6,1.1),c:pick(cols||['#fff3a8','#ffd23f','#ffffff','#ff8fab']),g:1});}
function burst(wx,wy,n){for(let i=0;i<n;i++)parts.push({k:'conf',x:wx,y:wy,vx:rnd(-90,90),vy:rnd(-160,-60),t:0,life:rnd(1,1.6),c:pick(['#ff5d6c','#ffd23f','#2fd08a','#5aa9ff','#9b5de5']),r:rnd(0,6),g:1});}
function screenConfetti(n){for(let i=0;i<n;i++)confetti.push({x:rnd(0,W),y:rnd(-H*.3,-10),vx:rnd(-40,40),vy:rnd(80,220),r:rnd(0,6),vr:rnd(-8,8),c:pick(['#ff5d6c','#ffd23f','#2fd08a','#5aa9ff','#9b5de5','#ff8fab']),t:0,life:rnd(2.5,4),w:rnd(5,9),h:rnd(8,13)});}
function coinTarget(){const r=$('#coinIco').getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];}
function flyCoins(sx,sy,n){const [tx,ty]=coinTarget();for(let i=0;i<n;i++)fly.push({x:sx,y:sy,sx,sy,cx:sx+rnd(-70,70),cy:sy+rnd(-90,-20),tx,ty,t:-i*.04,d:rnd(.55,.8)});}
let fwUntil=0;

/* =====================================================================
   ÁUDIO (sintetizado)
   ===================================================================== */
const AU={c:null,sfx:null,mus:null,lastCoin:0,step:0,next:0};
function audioInit(){if(AU.c){if(AU.c.state==='suspended')AU.c.resume();return;}const Cx=window.AudioContext||window.webkitAudioContext;if(!Cx)return;
  try{AU.c=new Cx();AU.sfx=AU.c.createGain();AU.mus=AU.c.createGain();AU.sfx.connect(AU.c.destination);AU.mus.connect(AU.c.destination);applyVol();AU.next=AU.c.currentTime+.1;setInterval(musicTick,120);}catch(e){AU.c=null;}}
function applyVol(){if(!AU.c)return;AU.sfx.gain.value=S.set.sfx?.55:0;AU.mus.gain.value=S.set.music?.13:0;}
function tone(f,dur,type,vol,when,slide,dest){if(!AU.c)return;const t=AU.c.currentTime+(when||0);const o=AU.c.createOscillator(),g=AU.c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.2,t+.008);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(dest||AU.sfx);o.start(t);o.stop(t+dur+.05);}
const SFX={
  click(){tone(rnd(520,620),.06,'triangle',.12);},
  coin(){const n=performance.now();if(n-AU.lastCoin<45)return;AU.lastCoin=n;const f=rnd(1300,1700);tone(f,.07,'square',.035);tone(f*1.5,.12,'sine',.09,.035);},
  build(){tone(180,.18,'triangle',.3,0,.5);tone(330,.1,'square',.05,.06);tone(880,.15,'sine',.12,.14);tone(1320,.18,'sine',.08,.2);},
  up(){[523,659,784,1047].forEach((f,i)=>tone(f*rnd(.99,1.01),.14,'triangle',.14,i*.05));tone(2093,.2,'sine',.05,.22);},
  unlock(){[392,523,659,784,1047].forEach((f,i)=>tone(f,.3,'triangle',.16,i*.09));[523,659,784].forEach(f=>tone(f,.8,'sine',.08,.5));},
  meteor(){tone(1800,.5,'sine',.06,0,.3);},
  chest(){[660,880,1100,1320,1760].forEach((f,i)=>tone(f,.18,'square',.04,i*.06));tone(220,.3,'triangle',.25,0,.6);},
  err(){tone(170,.12,'sawtooth',.06);tone(140,.14,'sawtooth',.05,.08);},
  event(){[784,988,1175].forEach((f,i)=>tone(f,.2,'triangle',.13,i*.08));},
  research(){[440,554,659,880,1109].forEach((f,i)=>tone(f,.22,'sine',.12,i*.07));},
  talk(){for(let i=0;i<4;i++)tone(rnd(300,520),.05,'square',.03,i*.06);},
  thunder(){tone(90,.9,'sawtooth',.12,0,.4);},
};
function sfx(k){if(S.set.sfx&&AU.c)SFX[k]();}
function vib(ms){if(!S.set.vib)return;if(NATIVE){native('vib:'+(Array.isArray(ms)?ms.reduce((a,b)=>a+b,0):ms));return;}if(navigator.vibrate)try{navigator.vibrate(ms);}catch(e){}}
const CHD=[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]];const PENTA=[523.3,587.3,659.3,784,880,1046.5];let melIdx=2;
function musicTick(){if(!AU.c||!S.set.music)return;const beat=.42;while(AU.next<AU.c.currentTime+.4){const t=AU.next-AU.c.currentTime;const s=AU.step;const ch=CHD[Math.floor(s/8)%4];
  if(s%8===0)ch.forEach(f=>tone(f,beat*7.5,'sine',.08,t,0,AU.mus));if(s%2===0)tone(ch[0]/2,beat*1.6,'triangle',.12,t,0,AU.mus);
  if(Math.random()<.55){melIdx=clamp(melIdx+ri(-2,2),0,PENTA.length-1);tone(PENTA[melIdx],beat*.9,'triangle',.06,t,0,AU.mus);}if(s%4===2)tone(2200,.03,'square',.012,t,0,AU.mus);AU.step++;AU.next+=beat;}}

/* =====================================================================
   AÇÕES DE CONSTRUÇÃO
   ===================================================================== */
function toast(msg,cls){const t=document.createElement('div');t.className='toast '+(cls||'');t.textContent=msg;$('#toasts').appendChild(t);setTimeout(()=>t.remove(),2700);while($('#toasts').children.length>4)$('#toasts').firstChild.remove();}
function bWorld(b){return proj(b.x+.5,b.y+.5);}
function autoPlot(t,prefD){const T=TYPES[t];let order=[];if(T.only!==undefined)order=[T.only];else{if(prefD!==undefined&&S.unlocked.includes(prefD))order.push(prefD);if(S.unlocked.includes(T.home))order.push(T.home);for(let i=S.unlocked.length-1;i>=0;i--)if(!order.includes(S.unlocked[i]))order.push(S.unlocked[i]);}
  let best=null,bs=-1e9;for(const d of order){if(!S.unlocked.includes(d))continue;for(const [x,y] of plotsOf(d)){if(!plotFree(x,y))continue;const s=t==='prj'?Math.random():placeScore(t,x,y)+(d===order[0]?.3:0);if(s>bs){bs=s;best=[x,y];}}if(best&&T.only!==undefined)break;}
  return best;}
let targetPlot=null;
function build(t){
  const lk=typeLock(t);if(lk){sfx('err');toast(lk,'r');return;}
  const T=TYPES[t];let plot=targetPlot&&plotFree(targetPlot[0],targetPlot[1])?targetPlot:null;
  if(plot&&T.only!==undefined&&distOf(...plot)!==T.only){toast('Só pode ser construído em '+DIST[T.only].n,'r');sfx('err');return;}
  if(!plot)plot=autoPlot(t);
  if(!plot){sfx('err');toast('Sem terrenos livres. Desbloqueie um bairro ou demole algo.','r');return;}
  if(T.cry&&S.crys<T.cry){sfx('err');toast('Faltam Cristais ('+T.cry+')','r');return;}
  const c=buildCost(t);if(!spend(c)){sfx('err');toast('Moedas insuficientes','r');return;}
  if(T.cry)S.crys-=T.cry;
  const bt=buildTime(t);const b={id:S.nid++,t,x:plot[0],y:plot[1],lvl:1,ready:Date.now()+bt*1000,_born:TIME,_bounce:0,bt0:bt};S.buildings.push(b);rebuildOcc();
  if(T.cat==='deco'){S.cnt.deco++;dailyProg('deco',1);}else{S.cnt.built++;dailyProg('build',1);}
  for(const tg of T.tags)S.cnt.tags[tg]=(S.cnt.tags[tg]||0)+1;
  targetPlot=null;const [wx,wy]=bWorld(b);camTo(wx,wy-20);burst(wx,wy-10,18);sfx('build');vib(20);
  if(bt===0)finishBuild(b,true);else{b._wasBusy=true;floatText(wx,wy-40,'Obra: '+bt+'s','#ffffff',13);}
  b.nextBub=rnd(8,18);dirty=true;if(S.tut===1&&(t==='cafe'||t==='padaria')){S.tut=2;tutRender();}
  refreshPanel();checkAch();save();}
let ceremony=null;
function finishBuild(b,silent){b._wasBusy=false;const [wx,wy]=bWorld(b);b._bounce=TIME;b._born=TIME;
  if(b.t==='prj'){const st=S.prj[b.pid];if(st){st.s++;const p=PRJM[b.pid];if(st.s>=3){S.cnt.prjDone++;startCeremony(b,p.n,true);showBanner(p.n,'Projeto concluído!');sfx('unlock');groundDirty=true;syncAgents(true);say(p.ch,'Conseguimos! '+p.n+' está pronto. '+p.fx+'.',6);}
    else{toast(p.n+': etapa "'+p.st[st.s-1].n+'" concluída','g');sparkle(wx,wy-30,16);sfx('up');}}dirty=true;refreshPanel();return;}
  S.seenT[b.t]=1;checkCollections();
  const T=TYPES[b.t];if(!silent){sparkle(wx,wy-30,14);sfx('build');}floatText(wx,wy-50,'Inaugurado!','#ffffff',14);dirty=true;
  if(RAR.indexOf(T.rar)>=2&&T.cat!=='deco'&&!silent)startCeremony(b,T.n,false);else if(RAR.indexOf(T.rar)>=2&&T.cat!=='deco')setTimeout(()=>startCeremony(b,T.n,false),300);
  const d=distOf(b.x,b.y);if(plotsOf(d).every(([x,y])=>occ.has(x+','+y))){if(!S.doneD.includes(d)){S.doneD.push(d);showBanner('Bairro completo! +10% renda',DIST[d].n);screenConfetti(80);sfx('unlock');}}}
function startCeremony(b,name,big){if(ceremony&&TIME-ceremony.t0<3)return;ceremony={b,t0:TIME,big};const [wx,wy]=bWorld(b);camTo(wx,wy-30,Math.max(cam.z,1.4));
  setTimeout(()=>{if(ceremony&&ceremony.b===b){showBanner(name,big?'Grande inauguração!':'Inauguração!');burst(wx,wy-30,40);screenConfetti(big?120:50);fwUntil=TIME+(big?8:4);sfx('unlock');vib([20,30,20]);}},900);}
function upgrade(b,n){
  const T=TYPES[b.t];if(T.cat==='deco'||b.t==='prj'){sfx('err');return;}
  if(b.ready>Date.now()){sfx('err');return;}
  if(n==='max')n=maxAfford(b,S.coins);if(!n){sfx('err');toast('Moedas insuficientes','r');return;}
  const c=bulkCost(b,n);if(!spend(c)){sfx('err');toast('Moedas insuficientes','r');return;}
  const before=bIncome(b);const t0=tierOf(b.lvl);b.lvl+=n;S.maxLv=Math.max(S.maxLv,b.lvl);S.cnt.upg+=n;dailyProg('upg',n);dirty=true;recalc();
  const after=bIncome(b);const [wx,wy]=bWorld(b);b._bounce=TIME;sparkle(wx,wy-30,12);floatText(wx,wy-60,after>before?'+'+fmt(after-before)+'/s':'Nível '+b.lvl,'#7ef0b7',15);sfx('up');vib(15);
  if(tierOf(b.lvl)>t0){const extra=b.t==='casa'&&tierOf(b.lvl)===2?' Virou sobrado!':b.t==='casa'&&tierOf(b.lvl)===4?' Virou casa grande!':'';showBanner('Marco nível '+prevMile(b.lvl)+'!'+extra,T.n);burst(wx,wy-30,30);sfx('unlock');}
  if(S.tut===2){S.tut=3;tutRender();}refreshPanel();checkAch();}
function demolish(id){const b=S.buildings.find(x=>x.id===id);if(!b||b.t==='pref'||b.t==='prj')return;S.buildings=S.buildings.filter(x=>x.id!==id);rebuildOcc();dirty=true;sfx('build');closeSheet();toast('Construção removida');save();}
let unlockAnim=null;
function unlockDistrict(d){const D=DIST[d];if(!D||S.unlocked.includes(d))return;
  if(D.ess&&S.ess<D.ess){sfx('err');return;}if(pref().lvl<D.pref){sfx('err');toast('A Prefeitura precisa do nível '+D.pref,'r');return;}
  if(d>0&&d<10&&!S.unlocked.includes(d-1)){sfx('err');toast('Desbloqueie o bairro anterior primeiro','r');return;}
  if(d===12&&!map1Done()){sfx('err');toast('Complete todos os bairros do Mapa 1 antes de expandir','r');return;}
  if(d>12&&d<=15&&!S.unlocked.includes(d-1)){sfx('err');toast('Desbloqueie o bairro anterior primeiro','r');return;}
  if(!spend(D.cost)){sfx('err');toast('Moedas insuficientes','r');return;}
  S.unlocked.push(d);groundDirty=true;syncAgents(true);dirty=true;closeSheet();updateDev();
  const gx=d%GXN,gy=Math.floor(d/GXN);const [wx,wy]=proj(gx*DS+3.5,gy*DS+3.5);cam.tx=wx;cam.ty=wy-10;cam.tz=1.35;
  unlockAnim={d,t:0};setTimeout(()=>{showBanner(D.n,'Bairro desbloqueado!');screenConfetti(140);sfx('unlock');vib([30,40,30]);},650);
  setTimeout(()=>say(D.ch,`Bem-vindo ao ${D.n}! ${D.mech} Só aqui: ${D.ex}.`,9),3400);checkAch();save();}
function collectBubble(b,auto){const v=b.bub;b.bub=0;b.nextBub=ev&&ev.k==='golden'&&ev.bid===b.id?rnd(2,4):rnd(18,34);
  let mult=tk('aut3')?1.5:1;if(!auto){combo.n++;combo.t=2.6;mult*=1+Math.min(2,combo.n*0.1);}
  const val=v*mult;earn(val);S.cnt.bub++;dailyProg('bub',1);const [wx,wy]=bWorld(b);const top=b._top||30;
  floatText(wx,wy-top-24,'+'+fmt(val)+(combo.n>1&&!auto?' ×'+(1+Math.min(2,combo.n*0.1)).toFixed(1):''),combo.n>5?'#ff8fab':'#ffd23f',combo.n>5?19:16);
  const [sx,sy]=w2s(wx,wy-top-14);flyCoins(sx,sy,auto?2:6);if(!auto){sfx('coin');vib(8);}b._bounce=TIME;if(S.tut===0){S.tut=1;tutRender();}}
function grantChest(src){const base=Math.max(50,ipsBase*rnd(60,180));const g=ri(2,6)+(src==='super'?6:0);const L=[];
  const coins=src==='super'?base*3:base;earn(coins);S.gems+=g;L.push(['coin',fmt(coins)+' moedas']);L.push(['gem',g+' joias']);
  if(Math.random()<.25||src==='super'){const rp=Math.max(10,Math.round(C.rp*90));S.rp+=rp;L.push(['rp',rp+' de pesquisa']);}
  if(src==='super'&&Math.random()<.5){S.crys+=1;L.push(['cry','1 Cristal']);}
  if(src==='super'||Math.random()<.4){const c=rollCos();if(c){if(S.cos.own.includes(c.id)){S.gems+=10;L.push(['dup',c.n+' (repetido: +10 joias)',c.r]);}else{S.cos.own.push(c.id);L.push(['cos',c.n,c.r]);}}}
  S.cnt.chest++;sfx('chest');vib([20,30,20]);showLoot(src==='super'?'Superbaú!':'Baú aberto!',L);save();}
function rollCos(){let tot=0;for(const c of COS)tot+=RAR_W[c.r];let r=Math.random()*tot;for(const c of COS){r-=RAR_W[c.r];if(r<=0)return c;}return COS[0];}
function eventTap(){S.cnt.ev++;dailyProg('ev',1);}
function research(id){const t=TECHM[id];if(!t||S.tech[id])return;if(!t.req.every(r=>S.tech[r])){sfx('err');toast('Pesquise antes: '+t.req.filter(r=>!S.tech[r]).map(r=>TECHM[r].n).join(', '),'r');return;}
  if(S.rp<t.cost){sfx('err');toast('Pesquisa insuficiente','r');return;}if(t.cry&&S.crys<t.cry){sfx('err');toast('Faltam Cristais ('+t.cry+')','r');return;}
  S.rp-=t.cost;if(t.cry)S.crys-=t.cry;S.tech[id]=1;dirty=true;dailyProg('research',1);sfx('research');vib(20);showBanner(t.n,'Pesquisa concluída!');screenConfetti(40);
  if(id==='tra4'||id==='com1')groundDirty=true;if(id==='tra2')syncAgents(true);for(const k in thumbs)if(k==='onibus')delete thumbs[k];checkAch();save();refreshPanel();}
function applySkin(b,sk){b.skin=sk||null;dirty=true;sfx('up');b._bounce=TIME;const [wx,wy]=bWorld(b);sparkle(wx,wy-30,16,[SKINS[sk]?SKINS[sk].acc:'#fff','#ffffff']);S.cnt.skin=(S.cnt.skin||0)+1;refreshPanel();save();}
function checkCollections(){for(const cat of CAT_ORDER){if(S.colDone[cat])continue;const all=Object.keys(TYPES).filter(k=>TYPES[k].cat===cat&&!TYPES[k].ess);if(all.length&&all.every(k=>S.seenT[k])){S.colDone[cat]=1;showBanner('Coleção '+CATS[cat]+' completa!','+15% renda da categoria');screenConfetti(80);sfx('unlock');}}}

/* ---------- projetos ---------- */
function prjState(id){return S.prj[id]||(S.prj[id]={s:0,bid:0});}
function reqCheck(r){switch(r[0]){
  case 'tech':return [tk(r[1]),'Pesquisa: '+TECHM[r[1]].n];case 'pop':return [S.pop>=r[1],fmt(r[1])+' habitantes'];
  case 'surplus':return [C.pwP-C.pwC>=r[1],'Energia sobrando: '+fmt(r[1])];case 'districts':return [S.unlocked.length>=r[1],r[1]+' bairros abertos'];
  case 'tag':return [countTagReady(r[1])>=r[2],r[2]+'× '+TAGN[r[1]]];case 'type':return [S.buildings.some(b=>b.t===r[1]&&isReady(b)),TYPES[r[1]].n+' construída'];
  case 'techn':return [Object.keys(S.tech).length>=r[1],r[1]+' pesquisas concluídas'];case 'happy':return [S.happy>=r[1],'Felicidade '+r[1]+'%'];}return [false,'?'];}
function prjBusy(id){const st=S.prj[id];if(!st||!st.bid)return false;const b=S.buildings.find(x=>x.id===st.bid);return !!(b&&b.ready>Date.now());}
function startStage(id){const p=PRJM[id],st=prjState(id);if(st.s>=3||prjBusy(id))return;const g=p.st[st.s];
  for(const r of g.req){const [ok,txt]=reqCheck(r);if(!ok){sfx('err');toast('Falta: '+txt,'r');return;}}
  if(g.cry&&S.crys<g.cry){sfx('err');toast('Faltam Cristais ('+g.cry+')','r');return;}if(g.rp&&S.rp<g.rp){sfx('err');toast('Pesquisa insuficiente','r');return;}
  let b=st.bid&&S.buildings.find(x=>x.id===st.bid);let plot=null;if(!b){plot=autoPlot('prj',{aero:6,metro:1,campus:5,jardins:3,fusao:2,elev:9}[id]);if(!plot){sfx('err');toast('Sem terreno livre para o projeto','r');return;}}
  if(!spend(g.cost)){sfx('err');toast('Moedas insuficientes','r');return;}if(g.cry)S.crys-=g.cry;if(g.rp)S.rp-=g.rp;
  const tt=Date.now()<S.instUntil?2:g.t;
  if(!b){b={id:S.nid++,t:'prj',pid:id,x:plot[0],y:plot[1],lvl:1,ready:0,_born:TIME,bt0:tt};S.buildings.push(b);st.bid=b.id;rebuildOcc();}
  b.ready=Date.now()+tt*1000;b.bt0=tt;b._wasBusy=true;const [wx,wy]=bWorld(b);camTo(wx,wy-20);burst(wx,wy-10,22);sfx('build');toast('Obra iniciada: '+g.n,'g');dirty=true;refreshPanel();save();}

/* ---------- prestígio ---------- */
function essGain(){if(!map1Done()||!map2Done())return 0;if(S.run<1e7)return 0;return Math.floor(3*Math.sqrt(S.run/1e7));}
function doPrestige(){const g=essGain();if(g<1)return;S.ess+=g;S.cnt.pres++;
  S.coins=S.ess>=3?5000:100;initCity(S);S.unlocked=[0];S.cu={};if(S.ess>=35)S.cu.robo=1;S.run=0;S.instUntil=0;S.doneD=[];S.pop=0;S.happy=55;S.prj={};S.mods=[];S.dmg={};S.road={};S.dgoal={};S.dbonus={};S.ctx={};S.rank=0;
  ev=null;sev=null;renderEvBar();worldCoins=[];superChest=null;rebuildOcc();groundDirty=true;syncAgents(true);dirty=true;closeSheet();C.devL=[];updateDev(true);
  const f=$('#flash');f.style.opacity=1;setTimeout(()=>f.style.opacity=0,350);showBanner('+'+g+' Essência Urbana','Renascimento!');screenConfetti(160);sfx('unlock');
  const [wx,wy]=bWorld(pref());cam.x=wx;cam.y=wy;checkAch();save();}

/* ---------- conquistas, metas, diárias ---------- */
const ACH=[
 {id:'b2',n:'Primeira obra',d:'Construa seu primeiro prédio',c:()=>nonPref()>=3,g:5},
 {id:'b10',n:'Vizinhança',d:'Tenha 10 prédios',c:()=>nonPref()>=10,g:10},
 {id:'b50',n:'Cidade de verdade',d:'Tenha 50 prédios',c:()=>nonPref()>=50,g:25,cos:'tree_sakura'},
 {id:'b100',n:'Metrópole',d:'Tenha 100 prédios',c:()=>nonPref()>=100,g:50},
 {id:'l10',n:'Reforma',d:'Leve um prédio ao nível 10',c:()=>S.maxLv>=10,g:5},
 {id:'l50',n:'Obra-prima',d:'Leve um prédio ao nível 50',c:()=>S.maxLv>=50,g:20,cos:'car_gold'},
 {id:'l100',n:'Lenda da arquitetura',d:'Leve um prédio ao nível 100',c:()=>S.maxLv>=100,g:40,cos:'statue_founder'},
 {id:'d2',n:'Novos horizontes',d:'Desbloqueie um novo bairro',c:()=>S.unlocked.length>=2,g:10},
 {id:'d5',n:'Expansão',d:'Desbloqueie 5 bairros',c:()=>S.unlocked.length>=5,g:30,cos:'sky_balloon'},
 {id:'d10',n:'Império urbano',d:'Desbloqueie 10 bairros',c:()=>S.unlocked.length>=10,g:100,cos:'skin_gold'},
 {id:'full',n:'Bairro lotado',d:'Complete um bairro inteiro',c:()=>completedCount()>=1,g:20},
 {id:'i100',n:'Fluxo de caixa',d:'Chegue a 100/s de renda',c:()=>ips>=100,g:5},
 {id:'i10k',n:'Dinheiro jorrando',d:'Chegue a 10K/s de renda',c:()=>ips>=1e4,g:15},
 {id:'i1m',n:'Milionário por segundo',d:'Chegue a 1M/s de renda',c:()=>ips>=1e6,g:30},
 {id:'i1b',n:'Fábrica de bilhões',d:'Chegue a 1B/s de renda',c:()=>ips>=1e9,g:60,cos:'sky_aurora'},
 {id:'e100k',n:'Cofrinho cheio',d:'Acumule 100 mil moedas',c:()=>S.life>=1e5,g:10},
 {id:'e1b',n:'Bilionário',d:'Acumule 1B de moedas',c:()=>S.life>=1e9,g:30},
 {id:'e1t',n:'Trilionário',d:'Acumule 1T de moedas',c:()=>S.life>=1e12,g:60},
 {id:'sp',n:'Algo especial',d:'Construa uma Extravagância',c:()=>S.buildings.some(b=>TYPES[b.t].cat==='extra'),g:15,cos:'statue_duck'},
 {id:'met',n:'Caçador de meteoros',d:'Pegue 5 meteoros dourados',c:()=>S.cnt.met>=5,g:15},
 {id:'bub',n:'Coletor nato',d:'Colete 200 bolhas de moedas',c:()=>S.cnt.bub>=200,g:15},
 {id:'pr1',n:'Renascer',d:'Faça seu primeiro prestígio',c:()=>S.cnt.pres>=1,g:50,cos:'skin_candy'},
 {id:'cx1',n:'Planejador urbano',d:'Forme seu primeiro complexo',c:()=>Object.keys(S.cxSeen).length>=1,g:15,cos:'bs_brinq'},
 {id:'cx4',n:'Mestre dos complexos',d:'Forme 4 complexos diferentes',c:()=>new Set(Object.keys(S.cxSeen).map(k=>k.split(':')[1])).size>=4,g:40,cos:'bs_fant'},
 {id:'t5',n:'Mente curiosa',d:'Conclua 5 pesquisas',c:()=>Object.keys(S.tech).length>=5,g:15},
 {id:'t20',n:'Cidade inteligente',d:'Conclua 20 pesquisas',c:()=>Object.keys(S.tech).length>=20,g:40,cos:'bs_neon'},
 {id:'t36',n:'Futuro presente',d:'Conclua todas as pesquisas',c:()=>Object.keys(S.tech).length>=TECH.length,g:100,cos:'bs_scifi'},
 {id:'h90',n:'Cidade mais feliz do mundo',d:'Chegue a 90% de felicidade',c:()=>S.happy>=90,g:30},
 {id:'p1k',n:'Mil habitantes',d:'Chegue a 1.000 habitantes',c:()=>S.pop>=1000,g:10},
 {id:'p100k',n:'Cem mil',d:'Chegue a 100 mil habitantes',c:()=>S.pop>=1e5,g:40},
 {id:'prj1',n:'Obra do século',d:'Conclua um projeto municipal',c:()=>S.cnt.prjDone>=1,g:30},
 {id:'leg',n:'Maravilha',d:'Construa uma construção Lendária',c:()=>S.buildings.some(b=>TYPES[b.t].cat==='leg'),g:60},
 {id:'dec20',n:'Paisagista',d:'Coloque 20 decorações',c:()=>S.cnt.deco>=20,g:15},
];
/* ---------- guia inicial (pós-tutorial) ---------- */
const GUIDE=[
 {id:'g1',n:'Construa 5 prédios',d:'Toque em Construir e escolha onde crescer.',c:()=>nonPref()>=5,g:{cs:8,gems:5}},
 {id:'g2',n:'Melhore um prédio até o nível 5',d:'Toque num prédio e use Melhorar para ele render mais.',c:()=>S.maxLv>=5,g:{cs:10,gems:5}},
 {id:'g3',n:'Colete 10 bolhas de moedas',d:'Toque nas bolhas douradas que aparecem sobre os prédios.',c:()=>S.cnt.bub>=10,g:{gems:6}},
 {id:'g4',n:'Desbloqueie o Centro Comercial',d:'Abra Bairros e compre o 2º bairro quando puder.',c:()=>S.unlocked.includes(1),g:{gems:10,rp:50}},
 {id:'g5',n:'Conclua sua 1ª pesquisa',d:'Abra Pesquisa e estude a primeira tecnologia disponível.',g:{gems:8},c:()=>Object.keys(S.tech).length>=1},
 {id:'g6',n:'Complete 1 missão diária',d:'Veja Missões → Diárias e cumpra qualquer uma delas.',c:()=>S.daily&&S.daily.list.some(m=>m.done),g:{gems:8}},
 {id:'g7',n:'Coloque uma decoração',d:'Decorações dão felicidade — procure na categoria Decoração.',c:()=>S.cnt.deco>=1,g:{gems:6}},
 {id:'g8',n:'Complete o primeiro bairro',d:'Ocupe todos os terrenos do Centro Histórico.',c:()=>completedCount()>=1,g:{gems:20,crys:1}},
];
function guideClaimable(){return GUIDE.some(g=>g.c()&&!S.metas['gd_'+g.id]);}
const METAS=[
 ...[[1000,10],[10000,20],[100000,40],[1e6,80],[1e7,150]].map(([n,g])=>({id:'mp'+n,grp:'População',n:fmt(n)+' habitantes',p:()=>[S.pop,n],r:{gems:g,rp:n/100}})),
 ...[[60,10],[75,20],[90,40]].map(([n,g])=>({id:'mh'+n,grp:'Felicidade',n:'Felicidade de '+n+'%',p:()=>[S.happy,n],r:{gems:g}})),
 ...[[1e3,5],[1e6,20],[1e9,40],[1e12,80],[1e15,150]].map(([n,g])=>({id:'mi'+n,grp:'Renda',n:fmt(n)+'/s de renda',p:()=>[Math.max(0,ips),n],r:{gems:g}})),
 ...[[1,15],[3,30],[6,80]].map(([n,g])=>({id:'mj'+n,grp:'Projetos',n:n+' projetos municipais',p:()=>[S.cnt.prjDone,n],r:{gems:g,crys:n}})),
 ...[[1,15],[3,30],[6,60]].map(([n,g])=>({id:'md'+n,grp:'Bairros especializados',n:n+' bairros Sofisticados ou melhores',p:()=>[S.unlocked.filter(d=>(C.devL[d]||0)>=3).length,n],r:{gems:g}})),
 ...[[1,40],[3,120]].map(([n,g])=>({id:'mw'+n,grp:'Maravilhas',n:n+' construções lendárias',p:()=>[S.buildings.filter(b=>TYPES[b.t].cat==='leg').length,n],r:{gems:g,crys:5*n}})),
 ...[[2,20],[5,50],[11,120]].map(([n,g])=>({id:'mc'+n,grp:'Coleções arquitetônicas',n:n+' coleções completas',p:()=>[Object.keys(S.colDone).length,n],r:{gems:g}})),
 ...[[3,20],[8,50]].map(([n,g])=>({id:'mx'+n,grp:'Complexos',n:n+' complexos formados',p:()=>[Object.keys(S.cxSeen).length,n],r:{gems:g,rp:200*n}})),
];
const DAILY_T=[
 {k:'build',f:n=>`Construa ${n} prédios`,ns:[2,3,5]},
 {k:'upg',f:n=>`Faça ${n} melhorias de nível`,ns:[10,20,35]},
 {k:'bub',f:n=>`Colete ${n} bolhas de moedas`,ns:[12,25,40]},
 {k:'earn',f:n=>`Ganhe ${fmt(n)} moedas`,ns:[300,600,1200]},
 {k:'ev',f:n=>`Participe de ${n} eventos`,ns:[1,2,3]},
 {k:'deco',f:n=>`Coloque ${n} decorações`,ns:[2,4,6]},
 {k:'research',f:n=>`Conclua ${n} pesquisa${n>1?'s':''}`,ns:[1,1,2]},
];
function ensureDaily(){const d=today();if(S.daily&&S.daily.date===d)return;const pool=[...DAILY_T].sort(()=>Math.random()-.5).slice(0,3);
  S.daily={date:d,list:pool.map(m=>{const lvl=ri(0,2);let n=m.ns[lvl];if(m.k==='earn')n=Math.max(500,Math.round(Math.max(0,ipsBase)*n/10)*10);return {k:m.k,n,txt:m.f(n),p:0,g:[5,8,12][lvl],done:false,claimed:false};}),bonus:false};}
function dailyProg(k,v){if(!S.daily)return;for(const m of S.daily.list)if(m.k===k&&!m.done){m.p+=v;if(m.p>=m.n){m.p=m.n;m.done=true;toast('Missão concluída: '+m.txt,'g');updateDots();}}}
function checkAch(){let nw=false;for(const a of ACH){if(!S.ach[a.id]&&a.c()){S.ach[a.id]='done';nw=true;toast('Conquista: '+a.n,'p');}}if(nw)updateDots();}
function giveReward(r,label){const L=[];if(r.cs){const c=Math.max(r.cs*3,ipsBase*r.cs);earn(c);L.push(fmt(c)+' moedas');}if(r.gems){S.gems+=r.gems;L.push(r.gems+' joias');}
  if(r.rp){S.rp+=r.rp;L.push(fmt(r.rp)+' de pesquisa');}if(r.crys){S.crys+=r.crys;L.push(r.crys+' Cristais');}if(r.cos&&!S.cos.own.includes(r.cos)){S.cos.own.push(r.cos);L.push(COS.find(c=>c.id===r.cos).n);}
  sfx('chest');toast((label?label+': ':'')+'+'+L.join(', '),'p');return L;}
