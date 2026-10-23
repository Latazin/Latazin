/* =====================================================================
   PERSONAGENS: retratos, falas, histórias, pedidos
   ===================================================================== */
function portrait(id,cls){const c=CHARS[id];const sk={lucia:'#8d5524',bento:'#f1c27d',iris:'#e0ac69',faisca:'#ffe0bd',tuca:'#c68642',zeca:'#6b4226'}[id];
  const body={lucia:'#5aa9ff',bento:'#2fb35a',iris:'#9b5de5',faisca:'#ffffff',tuca:'#ff9f1c',zeca:'#ff7a1a'}[id];let back='',front='',acc='';
  if(id==='lucia'){back='<circle cx="30" cy="12" r="8" fill="#1d1420"/><circle cx="18" cy="24" r="9" fill="#1d1420"/><circle cx="42" cy="24" r="9" fill="#1d1420"/><circle cx="30" cy="18" r="13" fill="#1d1420"/>';acc='<path d="M14 52 L46 60" stroke="#ff5d6c" stroke-width="5"/><circle cx="17" cy="33" r="2" fill="#ffd23f"/><circle cx="43" cy="33" r="2" fill="#ffd23f"/>';}
  if(id==='bento'){acc='<rect x="18" y="2" width="24" height="14" rx="2" fill="#1d1420"/><rect x="13" y="14" width="34" height="4" rx="2" fill="#1d1420"/><rect x="18" y="11" width="24" height="3" fill="#2fd08a"/><path d="M22 36 q4 3 8 0 q4 3 8 0" fill="#6b3a1e" stroke="#4a2a12" stroke-width="1"/><circle cx="36" cy="28" r="4" fill="none" stroke="#ffd23f" stroke-width="1.5"/><path d="M26 48 l4 3 4-3 -4 -2z" fill="#ffd23f"/>';}
  if(id==='iris'){back='<path d="M15 30 Q14 12 30 11 Q46 12 45 30 L45 38 L40 38 L40 26 L20 26 L20 38 L15 38z" fill="#7b3cff"/>';acc='<ellipse cx="30" cy="12" rx="13" ry="5" fill="#ff8fab"/><circle cx="30" cy="7" r="2" fill="#ff8fab"/><circle cx="25" cy="28" r="4.2" fill="none" stroke="#2b2350" stroke-width="1.5"/><circle cx="35" cy="28" r="4.2" fill="none" stroke="#2b2350" stroke-width="1.5"/><path d="M29.2 28h1.6" stroke="#2b2350" stroke-width="1.5"/><path d="M44 18 l3 14" stroke="#ffd23f" stroke-width="2.5"/>';}
  if(id==='faisca'){back='<path d="M14 26 L8 14 L18 18 L16 6 L26 14 L30 3 L34 14 L44 6 L42 18 L52 14 L46 26z" fill="#f4f4fb" stroke="#c9c9da"/>';acc='<rect x="18" y="16" width="24" height="6" rx="3" fill="#6b5a8f"/><circle cx="24" cy="19" r="4" fill="#ffb703" stroke="#6b5a8f" stroke-width="1.5"/><circle cx="36" cy="19" r="4" fill="#ffb703" stroke="#6b5a8f" stroke-width="1.5"/><path d="M24 48 L30 56 L36 48" fill="#5aa9ff"/>';}
  if(id==='tuca'){acc='<path d="M16 20 Q18 9 30 9 Q42 9 44 20z" fill="#ffd23f"/><path d="M14 20 h-8 q0 3 4 3 h6z" fill="#ffd23f"/><rect x="21" y="15" width="18" height="4" rx="2" fill="#2b2350"/><circle cx="22" cy="51" r="2.5" fill="#ff5d6c"/><circle cx="38" cy="54" r="2.5" fill="#2fd08a"/><rect x="26" y="48" width="9" height="7" rx="2" fill="#2b2350"/><circle cx="30.5" cy="51.5" r="2" fill="#7fd3ff"/>';}
  if(id==='zeca'){acc='<path d="M17 21 Q17 8 30 8 Q43 8 43 21z" fill="#ffd23f" stroke="#d99000" stroke-width="1.2"/><rect x="13" y="19" width="34" height="4" rx="2" fill="#ffc21a"/><path d="M20 34 Q30 46 40 34 Q38 42 30 43 Q22 42 20 34z" fill="#1d1420"/><path d="M20 52 h20" stroke="#fff3a8" stroke-width="3"/>';}
  return `<svg class="por ${cls||''}" viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" rx="14" fill="${c.bg}"/>${back}<path d="M8 60 Q10 44 30 44 Q50 44 52 60z" fill="${body}" stroke="#2b2350" stroke-width="1.5"/><rect x="26" y="38" width="8" height="8" fill="${sk}"/><circle cx="30" cy="28" r="12.5" fill="${sk}" stroke="#2b2350" stroke-width="1.5"/>
  <g class="eye"><circle cx="25" cy="28" r="1.8" fill="#2b2350"/><circle cx="35" cy="28" r="1.8" fill="#2b2350"/></g><circle cx="21" cy="32" r="2" fill="#ff8fab" opacity=".55"/><circle cx="39" cy="32" r="2" fill="#ff8fab" opacity=".55"/><path class="mouth" d="M25.5 34 Q30 38 34.5 34" fill="none" stroke="#2b2350" stroke-width="1.6" stroke-linecap="round"/>${acc}</svg>`;}
let sayQ=[],sayT=0,sayCur=null;
function say(ch,txt,sec,btn){if(!CHARS[ch])return;if(sayQ.length>2)sayQ.shift();sayQ.push({ch,txt,sec:sec||7,btn});if(!sayCur)nextSay();}
function nextSay(){if(S.tut<4){sayCur=null;return;}sayCur=sayQ.shift()||null;if(!sayCur){tutRender();return;}sayT=sayCur.sec;const c=$('#coach');const ch=CHARS[sayCur.ch];c.hidden=false;sfx('talk');
  c.innerHTML=portrait(sayCur.ch,'talk')+`<div class="bub"><small style="color:${ch.col}">${ch.n} · ${ch.role}</small>${sayCur.txt}<div class="row2">${sayCur.btn?`<button class="btn p" id="sayGo">${sayCur.btn[0]}</button>`:''}<button class="skip" id="sayX">Fechar</button></div></div>`;
  setTimeout(()=>{const p=c.querySelector('.por');if(p)p.classList.remove('talk');},1600);
  $('#sayX').onclick=()=>{sayT=0;};const g=$('#sayGo');if(g)g.onclick=()=>{const f=sayCur.btn[1];sayT=0;f();};}
function sayTick(dt){if(sayCur){const busy=!!sheetMode||!$('#modal').hidden;const c=$('#coach');if(busy){c.hidden=true;return;}if(c.hidden)c.hidden=false;sayT-=dt;if(sayT<=0){c.hidden=true;sayCur=null;setTimeout(nextSay,400);}}}

const STORY={
 lucia:[
  {t:'Uma praça para o povo',d:'Os moradores querem verde! Construa um Jardim ou uma Praça a até 2 quadras de uma casa.',c:()=>S.buildings.some(b=>b._s&&b._s.list.some(x=>x.n==='Áreas verdes por perto')),r:{cs:60,gems:5}},
  {t:'Trabalho para todos',d:'Uma cidade feliz tem emprego. Chegue a 40 pessoas trabalhando.',p:()=>[Math.min(C.wf,C.jobs),40],r:{cs:120,gems:5}},
  {t:'Sorrisos garantidos',d:'Deixe a felicidade acima de 70%. Natureza, serviços e pouco trânsito ajudam.',p:()=>[S.happy,70],r:{gems:10,rp:30}},
  {t:'Cidade de verdade',d:'Chegue a 3.000 habitantes.',p:()=>[S.pop,3000],r:{gems:20,cs:300}},
  {t:'Megalópole',d:'Chegue a 80 mil habitantes.',p:()=>[S.pop,8e4],r:{gems:50,crys:5}},
 ],
 bento:[
  {t:'Pão quentinho',d:'Construa uma Padaria com pelo menos 2 casas por perto. Clientes da vizinhança rendem mais!',c:()=>S.buildings.some(b=>b.t==='padaria'&&b._s&&b._s.list.some(x=>x.n==='Clientes da vizinhança'&&x.c>=2)),r:{cs:90,gems:5}},
  {t:'Cadeia produtiva',d:'Lojas grandes precisam de mercadorias. Tenha uma fábrica abastecendo 80% das lojas.',c:()=>C.gd>0&&C.supply>=.8&&countTagReady('factory')>0,r:{cs:200,gems:8}},
  {t:'Polo Gastronômico',d:'Junte 4 lugares de comida no mesmo bairro para formar um Polo Gastronômico.',c:()=>Object.keys(S.cxSeen).some(k=>k.endsWith(':gastro')),r:{gems:15,cs:300}},
  {t:'Grandes negócios',d:'Chegue a 1M/s de renda.',p:()=>[Math.max(0,ips),1e6],r:{gems:25,crys:2}},
  {t:'Lobo da bolsa',d:'Construa a Bolsa de Valores no Distrito Financeiro.',c:()=>S.buildings.some(b=>b.t==='bolsa'&&isReady(b)),r:{gems:60,crys:5}},
 ],
 zeca:[
  {t:'Vento a favor',d:'Prédios maiores gastam energia. Construa mais um Moinho de Vento.',c:()=>countType('moinho')>=2,r:{cs:90,gems:5}},
  {t:'Rede estável',d:'Tenha 6 prédios que consomem energia sem faltar energia.',c:()=>S.buildings.filter(b=>isReady(b)&&TYPES[b.t].f.pw<0).length>=6&&C.powEff>=1,r:{cs:200,gems:8}},
  {t:'Fim do engarrafamento',d:'Pesquise Linhas de Ônibus e construa um Terminal de Ônibus.',c:()=>countType('onibus')>=1,r:{gems:12,rp:60}},
  {t:'Obra do século',d:'Conclua o projeto Metrô da Cidade.',c:()=>prjDone('metro'),r:{gems:30,crys:3}},
  {t:'Estrela artificial',d:'Conclua a Usina de Fusão.',c:()=>prjDone('fusao'),r:{gems:60,crys:8}},
 ],
 faisca:[
  {t:'Mentes brilhantes',d:'Construa uma Escola. Ela gera pesquisa e qualifica os trabalhadores.',c:()=>countType('escola')>=1,r:{cs:120,rp:20}},
  {t:'Eureka!',d:'Conclua 3 pesquisas na aba Pesquisa.',p:()=>[Object.keys(S.tech).length,3],r:{gems:10,rp:80}},
  {t:'Campus de Inovação',d:'Junte uma escola ou universidade com 2 prédios de tecnologia no mesmo bairro.',c:()=>Object.keys(S.cxSeen).some(k=>k.endsWith(':campus')),r:{gems:20,rp:400}},
  {t:'Gênio da cidade',d:'Gere 50 de pesquisa por segundo.',p:()=>[C.rp,50],r:{gems:30,crys:3}},
  {t:'Para o espaço',d:'Conclua o Elevador Espacial.',c:()=>prjDone('elev'),r:{gems:100,crys:20}},
 ],
 tuca:[
  {t:'Algo pra ver',d:'Construa uma atração: Entretenimento ou Monumento.',c:()=>S.buildings.some(b=>isReady(b)&&['ent','mon'].includes(TYPES[b.t].cat)),r:{cs:120,gems:5}},
  {t:'Bem-vindos!',d:'Receba 200 visitantes de uma vez.',p:()=>[C.V,200],r:{gems:10,cs:200}},
  {t:'Quarto com vista',d:'Construa uma Pousada ou Hotel perto de uma atração.',c:()=>S.buildings.some(b=>b._s&&b._s.list.some(x=>x.n==='Atrações turísticas perto')),r:{gems:15,cs:300}},
  {t:'Pacote completo',d:'Forme um Complexo Turístico: atração, hotel, comida e transporte no mesmo bairro.',c:()=>Object.keys(S.cxSeen).some(k=>k.endsWith(':tur')),r:{gems:30,crys:2}},
  {t:'Destino mundial',d:'Conclua o Aeroporto Internacional.',c:()=>prjDone('aero'),r:{gems:60,crys:6}},
 ],
 iris:[
  {t:'Traço moderno',d:'Pesquise Plantas Modernas e construa um Conjunto Popular.',c:()=>countType('popular')>=1,r:{gems:10,cos:'bs_doces'}},
  {t:'Bairro charmoso',d:'Leve um bairro ao nível Desenvolvido. Ocupe terrenos, decore e suba níveis.',c:()=>S.unlocked.some(d=>(C.devL[d]||0)>=2),r:{gems:12,cs:300}},
  {t:'Estilo próprio',d:'Abra um prédio e aplique um estilo (skin) nele.',c:()=>(S.cnt.skin||0)>=1,r:{gems:15,cos:'bs_brinq'}},
  {t:'Obra-prima',d:'Conclua os Jardins Suspensos.',c:()=>prjDone('jardins'),r:{gems:40,cos:'bs_fant'}},
  {t:'Lenda da arquitetura',d:'Construa uma construção Lendária.',c:()=>S.buildings.some(b=>TYPES[b.t].cat==='leg'&&isReady(b)),r:{gems:80,cos:'bs_scifi'}},
 ],
};
function charUnlocked(ch){return cityRank()>=CHAR_UNLOCK[ch];}
function stepOf(ch){const i=S.story[ch]||0;return STORY[ch][i]||null;}
function stepDone(s){if(!s)return false;if(s.c)return !!s.c();const [a,b]=s.p();return a>=b;}
function claimStory(ch){const s=stepOf(ch);if(!stepDone(s))return;giveReward(s.r,s.t);S.story[ch]=(S.story[ch]||0)+1;const nx=stepOf(ch);updateDots();renderSheet(true);
  setTimeout(()=>say(ch,nx?'Valeu! Próximo desafio: <b>'+nx.t+'</b>. '+nx.d:'Você completou todos os meus desafios. Que cidade!',8),400);save();}
const CTX=[
 {id:'traffic',ch:'zeca',c:()=>C.cg>.08,tag:'transit',n:1,t:'Trânsito travado!',d:()=>tk('tra1')?'Construa um Terminal de Ônibus ou Estação de Metrô.':'Pesquise Linhas de Ônibus e construa um terminal.'},
 {id:'power',ch:'zeca',c:()=>C.powEff<.97,tag:'power',n:1,t:'Falta energia',d:()=>'Construa um Moinho, Usina ou Fazenda Solar.'},
 {id:'sad',ch:'lucia',c:()=>S.happy<45&&S.pop>30,tag:'green',n:2,t:'Moradores tristes',d:()=>'Construa 2 áreas verdes (Natureza ou árvores) perto das casas.'},
 {id:'goods',ch:'bento',c:()=>C.gd>0&&C.supply<.7,tag:'factory',n:1,t:'Prateleiras vazias',d:()=>'Construa uma fábrica. Um depósito ao lado ajuda a entregar.'},
 {id:'jobs',ch:'bento',c:()=>C.unemp>.25&&S.pop>40,tag:'work',n:2,t:'Gente sem emprego',d:()=>'Construa 2 locais de trabalho: comércio, indústria ou serviços.'},
 {id:'workers',ch:'lucia',c:()=>C.staff<.7,tag:'res',n:3,t:'Faltam trabalhadores',d:()=>'Construa 3 moradias para trazer mais gente.'},
 {id:'hotel',ch:'tuca',c:()=>C.V>60&&C.V>C.hotel*1.2,tag:'hotel',n:1,t:'Turistas sem quarto',d:()=>'Construa uma Pousada ou Hotel.'},
 {id:'smog',ch:'lucia',c:()=>C.polIdx>1.2,tag:'green',n:1,t:'Que fumaça!',d:()=>'Plante um Bosque ou Jardim. Áreas verdes limpam o ar.'},
 {id:'services',ch:'faisca',c:()=>S.pop>350&&(C.cov.edu+C.cov.health+C.cov.safe)/3<.6,tag:'service',n:1,t:'Precisamos de serviços',d:()=>'Construa uma escola, hospital, delegacia ou bombeiros.'},
];
function ctxTick(){if(S.tut<4)return;const now=Date.now();const act=Object.keys(S.ctx).filter(k=>S.ctx[k]&&!S.ctx[k].done).length;
  for(const ch in S.ctx){const q=S.ctx[ch];if(q&&!q.done&&((S.cnt.tags[q.tag]||0)-q.base)>=q.n){q.done=true;toast('Pedido atendido: '+q.t,'g');updateDots();}}
  if(act>=2)return;for(const q of CTX){if(!charUnlocked(q.ch)||S.ctx[q.ch]||(S.ctxCd[q.id]||0)>now)continue;if(!q.c())continue;
    S.ctx[q.ch]={id:q.id,tag:q.tag,n:q.n,base:S.cnt.tags[q.tag]||0,t:q.t,d:q.d(),done:false};say(q.ch,'<b>'+q.t+'</b> '+q.d(),8,['Ver pedido',()=>openSheet('missions','req')]);updateDots();break;}}
function claimCtx(ch){const q=S.ctx[ch];if(!q||!q.done)return;giveReward({cs:60,gems:3,rp:Math.max(5,Math.round(C.rp*30))},'Pedido');S.ctxCd[q.id]=Date.now()+180000;delete S.ctx[ch];updateDots();renderSheet(true);save();}

/* =====================================================================
   EVENTOS DINÂMICOS (com escolhas)
   ===================================================================== */
let sev=null,sevTimer=150,weather=null;
function cost(sec){return Math.max(sec*2,Math.max(0,ipsBase)*sec);}
function addMod(k,v,sec,label,extra){S.mods.push(Object.assign({k,v,until:Date.now()+sec*1000,label},extra||{}));dirty=true;}
const SEV=[
 {id:'festival',ch:'lucia',w:3,ok:()=>S.pop>=30,t:'Festival da Cidade',d:'Vamos fazer um festival na praça! Se reforçarmos o transporte, vem muito mais gente.',
  ch2:[{n:'Investir em transporte',c:90,d:'Renda +50%, felicidade +10 e turismo +50% por 90s. Fogos à noite!',f:()=>{addMod('inc',1.5,90,'Festival');addMod('happy',10,90,'Festival');addMod('tour',1.5,90,'Festival');fwUntil=TIME+90;}},
       {n:'Festival simples',c:0,d:'Felicidade +5 por 60s.',f:()=>addMod('happy',5,60,'Festival')}]},
 {id:'turismo',ch:'tuca',w:2,ok:()=>cityRank()>=2&&C.tour>0,t:'Semana de Turismo',d:'Agências do mundo todo estão de olho! Consiga mais visitantes enquanto dura.',
  ch2:[{n:'Bora receber todo mundo!',c:0,d:'Turismo 2× por 120s. Meta: chegar a mais visitantes.',f:()=>{addMod('tour',2,120,'Semana de Turismo');setObj('visit',Math.max(60,Math.round(C.V*2.2)),120,{gems:10,cs:120},'Receba visitantes');}}]},
 {id:'feira',ch:'faisca',w:2,ok:()=>cityRank()>=1&&C.rp>0,t:'Feira de Tecnologia',d:'Cientistas de todo canto vieram mostrar invenções. Quer patrocinar?',
  ch2:[{n:'Patrocinar a feira',c:60,d:'Pesquisa 3× por 90s e um bônus de pesquisa agora.',f:()=>{addMod('rp',3,90,'Feira de Tecnologia');S.rp+=Math.max(20,C.rp*60);}},{n:'Só visitar',c:0,d:'Pesquisa +50% por 60s.',f:()=>addMod('rp',1.5,60,'Feira de Tecnologia')}]},
 {id:'shopping',ch:'bento',w:2,ok:()=>countTagReady('shop')>=3,t:'Grande Liquidação',d:'Um shopping novo abriu na região e as lojas querem pegar carona na fila!',
  ch2:[{n:'Fazer propaganda',c:45,d:'Comércio 2,5× por 120s.',f:()=>addMod('cat',2.5,120,'Liquidação',{c:'com'})},{n:'Deixar rolar',c:0,d:'Comércio 1,5× por 90s.',f:()=>addMod('cat',1.5,90,'Liquidação',{c:'com'})}]},
 {id:'campeonato',ch:'tuca',w:2,ok:()=>countTagReady('ent')>=1,t:'Campeonato Esportivo',d:'A final do campeonato vai ser aqui! Os torcedores querem diversão.',
  ch2:[{n:'Vamos torcer!',c:0,d:'Entretenimento 2× por 90s. Com Estádio ou Arena: +10 joias.',f:()=>{addMod('cat',2,90,'Campeonato',{c:'ent'});if(S.buildings.some(b=>['estadio','arena'].includes(b.t)&&isReady(b))){S.gems+=10;toast('+10 joias da final!','p');}}}]},
 {id:'calor',ch:'zeca',w:1,ok:()=>S.pop>=60,t:'Onda de Calor',d:'Está um forno lá fora! O ar-condicionado vai gastar muita energia.',
  ch2:[{n:'Distribuir água e ventiladores',c:60,d:'Sem problemas, e felicidade +3 por 60s.',f:()=>{addMod('happy',3,60,'Água fresquinha');weather={k:'heat',until:TIME+60};}},{n:'Aguentar o calor',c:0,d:'Felicidade −10 e consumo de energia +20% por 60s.',f:()=>{addMod('happy',-10,60,'Onda de calor');addMod('cons',1.2,60,'Onda de calor');weather={k:'heat',until:TIME+60};}}]},
 {id:'tempestade',ch:'zeca',w:1,ok:()=>S.unlocked.length>=2,t:'Tempestade Chegando',d:'Nuvens pesadas no radar! Podemos reforçar a rede ou arriscar.',
  ch2:[{n:'Reforçar a rede',c:60,d:'Nenhum estrago.',f:()=>{weather={k:'storm',until:TIME+45};}},{n:'Arriscar',c:0,d:'Chance de estragos num bairro (−30% renda por 2 min). Bombeiros reduzem o risco.',f:()=>{weather={k:'storm',until:TIME+45};const risk=countType('bombeiros')?.2:.5;
    if(Math.random()<risk){const d=pick(S.unlocked);S.dmg[d]=Date.now()+120000;dirty=true;setTimeout(()=>{toast('Estragos em '+DIST[d].n+'! Conserte em Bairros.','r');sfx('thunder');},6000);}else setTimeout(()=>toast('Ufa! A tempestade passou sem estragos.','g'),20000);}}]},
 {id:'transito',ch:'zeca',w:1,ok:()=>S.pop>=300,t:'Congestionamento',d:'Um caminhão quebrou na avenida principal e tudo parou!',
  ch2:[{n:'Chamar agentes de trânsito',c:40,d:'Resolve na hora.',f:()=>{}},{n:'Esperar passar',c:0,d:'Trânsito +60% por 60s.',f:()=>addMod('traffic',1.6,60,'Congestionamento')}]},
 {id:'apagao',ch:'zeca',w:1,ok:()=>C.pwC>5,t:'Risco de Apagão',d:'Uma linha de transmissão caiu. Temos um gerador de emergência.',
  ch2:[{n:'Ligar o gerador',c:50,d:'Energia normal.',f:()=>{}},{n:'Economizar energia',c:0,d:'Produção de energia −35% por 45s.',f:()=>addMod('pow',.65,45,'Apagão')}]},
 {id:'boom',ch:'lucia',w:2,ok:()=>S.pop>=80,t:'Boom Populacional',d:'Todo mundo quer morar aqui! Precisamos de mais moradias rapidinho.',
  ch2:[{n:'Aceitar o desafio',c:0,d:'Aumente a capacidade de moradia em 15% em 2 minutos. Prêmio: joias e +5% de população para sempre.',f:()=>setObj('cap',Math.max(10,Math.round(C.hcap*.15)),120,{gems:10,perm:['pop',1.05,'Cidade atraente']},'Novas moradias')}]},
 {id:'empresa',ch:'bento',w:1,ok:()=>cityRank()>=2&&!S.mods.some(m=>m.label==='Sede da Mega Corp'),t:'Empresa Importante',d:'A Mega Corp quer instalar a sede aqui. Com um incentivo, eles fecham negócio.',
  ch2:[{n:'Oferecer incentivo',c:150,d:'Renda da cidade +5% para sempre.',f:()=>{S.mods.push({k:'inc',v:1.05,perm:true,label:'Sede da Mega Corp'});dirty=true;showBanner('Mega Corp chegou!','Renda +5% para sempre');}},{n:'Recusar',c:0,d:'Nada muda.',f:()=>{}}]},
 {id:'investidor',ch:'bento',w:2,ok:()=>S.unlocked.length>=1&&S.pop>=40,t:'Investidor Interessado',d:'Um investidor quer apostar num bairro. Dinheiro agora ou parceria de longo prazo?',
  ch2:[{n:'Aceitar o dinheiro',c:0,d:'Ganhe 4 minutos de renda agora.',f:()=>{const v=cost(240);earn(v);toast('+'+fmt(v)+' moedas','g');}},
       {n:'Pedir parceria',c:0,d:'O bairro mais novo ganha +15 pontos de desenvolvimento para sempre.',f:()=>{const d=S.unlocked[S.unlocked.length-1];S.dbonus[d]=(S.dbonus[d]||0)+15;updateDev();toast(DIST[d].n+' ganhou investimento!','g');}}]},
 {id:'beleza',ch:'iris',w:2,ok:()=>cityRank()>=1,t:'Concurso de Beleza Urbana',d:'O júri vai visitar a cidade! Decore as ruas para impressionar.',
  ch2:[{n:'Topo!',c:0,d:'Coloque 3 decorações em 2 min e meio. Prêmio: joias e chance de item.',f:()=>setObj('deco',3,150,{gems:12,chest:true},'Decorações')}]},
 {id:'vip',ch:'tuca',w:1,ok:()=>S.pop>=50,t:'Visitante Lendário',d:'Dizem que uma celebridade misteriosa está passeando pela cidade de cartola dourada. Ache e toque nela!',
  ch2:[{n:'Vou procurar!',c:0,d:'Ela fica 45 segundos pelas ruas.',f:()=>{spawnVip();setObj('vip',1,45,{gems:15,cs:180},'Ache o visitante')}}]},
 {id:'recurso',ch:'faisca',w:1,ok:()=>cityRank()>=2,t:'Descoberta Rara',d:'Encontramos um veio de Cristal debaixo da cidade! Cristais são usados em pesquisas e construções lendárias.',
  ch2:[{n:'Extrair',c:120,d:'+3 Cristais.',f:()=>{S.crys+=3;toast('+3 Cristais','p');}},{n:'Estudar',c:0,d:'Ganhe pesquisa equivalente a 3 minutos.',f:()=>{S.rp+=Math.max(50,C.rp*180);toast('Pesquisa extra!','p');}}]},
];
function setObj(k,need,sec,reward,txt){if(!sev)return;const base=k==='cap'?C.hcap:k==='deco'?S.cnt.deco:0;sev.obj={k,need,base,until:TIME+sec,dur:sec,reward,txt,prog:0};}
function sevTick(dt){
  if(sev&&sev.pending){sev.wait-=dt;if(sev.wait<=0){const e=SEV.find(x=>x.id===sev.id);const free=e.ch2.find(c=>!c.c)||e.ch2[e.ch2.length-1];chooseEv(e.ch2.indexOf(free),true);}}
  if(sev&&sev.obj){const o=sev.obj;o.prog=o.k==='cap'?C.hcap-o.base:o.k==='deco'?S.cnt.deco-o.base:o.k==='visit'?C.V:o.prog;
    if(o.prog>=o.need){const r=o.reward;const L=[];if(r.gems){S.gems+=r.gems;L.push(r.gems+' joias');}if(r.cs){const v=cost(r.cs);earn(v);L.push(fmt(v)+' moedas');}
      if(r.perm){S.mods.push({k:r.perm[0],v:r.perm[1],perm:true,label:r.perm[2]});L.push(r.perm[2]);dirty=true;}
      showBanner('Objetivo cumprido!',EV_T(sev.id));screenConfetti(60);sfx('unlock');toast('+'+L.join(', '),'p');eventTap();if(r.chest)setTimeout(()=>grantChest('event'),800);sev=null;renderEvBar();}
    else if(TIME>o.until){toast('O tempo acabou. Fica para a próxima!');sev=null;renderEvBar();}}
  else if(sev&&!sev.pending&&!sev.obj){sev=null;renderEvBar();}
  if(!sev&&S.tut>=4){sevTimer-=dt;if(sevTimer<=0){sevTimer=rnd(150,240);const pool=SEV.filter(e=>charUnlocked(e.ch)&&e.ok());if(pool.length){let tot=0;for(const e of pool)tot+=e.w;let r=Math.random()*tot;let e=pool[0];for(const x of pool){r-=x.w;if(r<=0){e=x;break;}}
    sev={id:e.id,pending:true,wait:45};sfx('event');renderEvBar();say(e.ch,'<b>'+e.t+'</b> Tenho uma proposta para você!',6,['Ver',()=>openEvent()]);}}}
  if(weather&&TIME>weather.until)weather=null;}
function EV_T(id){const e=SEV.find(x=>x.id===id);return e?e.t:'';}
function openEvent(){if(!sev||!sev.pending)return;const e=SEV.find(x=>x.id===sev.id);const ch=CHARS[e.ch];
  openModal(`<div class="speaker">${portrait(e.ch,'talk')}<div><small style="color:${ch.col}">${ch.n} · ${ch.role}</small><h2 style="text-align:left;font-size:22px">${e.t}</h2></div></div><p style="text-align:left">${e.d}</p>
  ${e.ch2.map((c,i)=>`<button class="choice ${c.c?'':'pri'} ${c.c&&S.coins<cost(c.c)?'off':''}" data-m="evc" data-i="${i}"><b>${c.n}${c.c?' · '+fmt(cost(c.c))+' moedas':''}</b><span>${c.d}</span></button>`).join('')}
  <p class="note" style="text-align:center">Se você não escolher, a opção grátis vale em ${Math.ceil(sev.wait)}s.</p>`);}
function chooseEv(i,auto){if(!sev||!sev.pending)return;const e=SEV.find(x=>x.id===sev.id);const c=e.ch2[i];if(!c)return;
  if(c.c){const v=cost(c.c);if(!spend(v)){sfx('err');toast('Moedas insuficientes','r');return;}}
  sev.pending=false;c.f();eventTap();if(!auto){closeModal();sfx('event');}else toast(e.t+': '+c.n);renderEvBar();save();}

/* =====================================================================
   UI: SHEET
   ===================================================================== */
let sheetMode=null,sheetTab=null,selB=null,bulk=1,selTech=null,heatMode=null;
const thumbs={};
function thumb(t,pid){const key=t+(pid||'');if(thumbs[key])return thumbs[key];const c=document.createElement('canvas');c.width=112;c.height=112;const g=c.getContext('2d');const px=X,pp=PREVIEW,pt=TINT;X=g;PREVIEW=true;TINT=null;
  const dummy={id:3,t,lvl:1,x:0,y:0,pid};let fake=null;if(t==='prj'){fake=S.prj[pid];S.prj[pid]={s:3};}
  const top=TYPES[t].draw(dummy,0,0,1,0);const sc=clamp(Math.min(80/(top+22),.78),.3,.78);
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,112,112);g.setTransform(sc*2,0,0,sc*2,56,112-16*sc*2-6);ell(0,0,30,15,'rgba(43,35,80,.15)',false);TYPES[t].draw(dummy,0,0,1,0);
  if(t==='prj'){if(fake)S.prj[pid]=fake;else delete S.prj[pid];}X=px;PREVIEW=pp;TINT=pt;thumbs[key]=c.toDataURL();return thumbs[key];}
function openSheet(mode,tab){audioInit();sheetMode=mode;sheetTab=tab||null;const s=$('#sheet');s.classList.add('open');s.classList.toggle('tall',['research','city','missions','projects'].includes(mode));
  const navm={bld:'',projects:'more',collection:'more',prestige:'more'}[mode];document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.nav===(navm!==undefined?navm:mode)));renderSheet();tutRender();}
function closeSheet(){sheetMode=null;selB=null;$('#sheet').classList.remove('open');document.querySelectorAll('#nav button').forEach(b=>b.classList.remove('on'));if(S)tutRender();}
function openBuilding(b){selB=b.id;openSheet('bld');const [wx,wy]=bWorld(b);camTo(wx,wy-(b._top||30)/2);}
function refreshPanel(){if(sheetMode)renderSheet(true);}
function setTabs(list){const t=$('#tabs');if(!list){t.innerHTML='';return;}if(!sheetTab||!list.some(l=>l[0]===sheetTab))sheetTab=list[0][0];t.innerHTML=list.map(([k,n])=>`<button data-tab="${k}" class="${k===sheetTab?'on':''}">${n}</button>`).join('');}
function cBtn(cost,act,label,cls){return `<button class="btn ${cls||''}" data-act="${act}" data-cost="${cost}">${label?label+' ':''}<i class="mc"></i>${fmt(cost)}</button>`;}
function gBtn(cost,act,label){return `<button class="btn p" data-act="${act}" data-gcost="${cost}">${label} <i class="mg"></i>${cost}</button>`;}
const FXC={pop:['#5aa9ff','moradores'],jobs:['#2fd08a','empregos'],pw:['#ffc53d','energia'],goods:['#fb8500','mercadorias/s'],gd:['#ff6b6b','mercadorias pedidas'],cust:['#ff8fab','clientes'],happy:['#3bb273','felicidade'],
  tour:['#ff5d6c','turismo'],rp:['#38b6ff','pesquisa/s'],edu:['#8e5cff','educação'],health:['#ff4d6d','saúde'],safe:['#4b7bec','segurança'],trans:['#6fc8ff','transporte'],pol:['#8a95a8','poluição'],hotel:['#d9a300','quartos'],logi:['#a0703c','logística'],green:['#2fb35a','ar limpo'],up:['#cf4040','manutenção/s']};
function fxChips(t,s,max){const f=TYPES[t].f;const out=[];for(const k in FXC){if(!f[k])continue;let v=f[k]*(s||1);let txt;
  if(k==='pw')txt=(v>0?'+':'−')+fmt(Math.abs(v))+' energia';else if(k==='pol')txt='+'+fmt(v)+' poluição';else if(k==='up')txt='−'+fmt(v)+' moedas/s';else txt=(k==='gd'?'':'+')+fmt(v)+' '+FXC[k][1];
  out.push(`<span><i style="background:${FXC[k][0]}"></i>${txt}</span>`);}return `<div class="fx">${out.slice(0,max||9).join('')}</div>`;}
function rarTag(r){return `<span class="rar ${r}">${r}</span>`;}
function why(list){return `<div class="why">${list.map(([n,v])=>{const cls=typeof v==='number'?(v>1.001?'up':v<.999?'dn':'nt'):'nt';const t=typeof v==='number'?(v>=1.5&&Math.abs(v-Math.round(v))<.01?'×'+Math.round(v):sgn(v-1)):v;return `<div class="${cls}"><i></i>${n}<b>${t}</b></div>`;}).join('')}</div>`;}
function bar(v,cls){return `<div class="prog ${cls||''}"><i style="width:${Math.round(clamp(v,0,1)*100)}%"></i></div>`;}
const ICO={
 pop:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" fill="#5aa9ff" stroke="#2b2350" stroke-width="1.6"/><circle cx="16.5" cy="9.5" r="2.8" fill="#ffc53d" stroke="#2b2350" stroke-width="1.6"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6zM13 20c.3-3 2-4.5 3.5-4.5s3.5 1.5 3.5 4.5z" fill="#5aa9ff" stroke="#2b2350" stroke-width="1.6" stroke-linejoin="round"/></svg>',
 happy:h=>`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="${h>=60?'#2fd08a':h>=40?'#ffc53d':'#ff6b6b'}" stroke="#2b2350" stroke-width="1.6"/><circle cx="9" cy="10" r="1.3" fill="#2b2350"/><circle cx="15" cy="10" r="1.3" fill="#2b2350"/><path d="${h>=60?'M8 14q4 4 8 0':h>=40?'M8.5 15h7':'M8 16q4-3.5 8 0'}" stroke="#2b2350" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`,
 pw:'<svg viewBox="0 0 24 24"><path d="M13 2L5 13h6l-1 9 8-11h-6z" fill="#ffc53d" stroke="#2b2350" stroke-width="1.6" stroke-linejoin="round"/></svg>',
 goods:'<svg viewBox="0 0 24 24"><path d="M3 8l9-4 9 4v9l-9 4-9-4z" fill="#ffb56b" stroke="#2b2350" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 8l9 4 9-4M12 12v9" stroke="#2b2350" stroke-width="1.6" fill="none"/></svg>',
 traffic:'<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="8" rx="3" fill="#ff6b6b" stroke="#2b2350" stroke-width="1.6"/><path d="M6 9l2-4h8l2 4" fill="#b9e5ff" stroke="#2b2350" stroke-width="1.6" stroke-linejoin="round"/><circle cx="7.5" cy="17.5" r="2" fill="#2b2350"/><circle cx="16.5" cy="17.5" r="2" fill="#2b2350"/></svg>',
 rp:'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" fill="#d8fbff" stroke="#2b2350" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 15h10l2 3.5a1.5 1.5 0 0 1-1.3 2.2H6.3A1.5 1.5 0 0 1 5 18.5z" fill="#38b6ff"/></svg>',
 cry:'<svg viewBox="0 0 24 24"><path d="M12 2l7 7-7 13L5 9z" fill="#9ff3ff" stroke="#2b2350" stroke-width="1.6" stroke-linejoin="round"/><path d="M5 9h14M12 2l-3 7 3 13 3-13z" stroke="#2b2350" stroke-width="1" fill="none"/></svg>',
 tour:'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3" fill="#ff8fab" stroke="#2b2350" stroke-width="1.6"/><circle cx="12" cy="13.5" r="4" fill="#fff" stroke="#2b2350" stroke-width="1.6"/><rect x="8" y="4" width="8" height="3" rx="1" fill="#2b2350"/></svg>',
 money:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#ffd34d" stroke="#b97a00" stroke-width="1.8"/><circle cx="12" cy="12" r="5" fill="none" stroke="#c98400" stroke-width="1.6"/></svg>',
 pol:'<svg viewBox="0 0 24 24"><circle cx="8" cy="14" r="5" fill="#b8b4c8" stroke="#2b2350" stroke-width="1.6"/><circle cx="15" cy="11" r="6" fill="#d9d2e8" stroke="#2b2350" stroke-width="1.6"/></svg>',
 svc:'<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" fill="#8e5cff" stroke="#2b2350" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
let _stripLast=null;
function stripRender(){const h=Math.round(S.happy);const r=cityRank();let s=`<button class="rank" data-go="city">${RANKS[r][1]}</button>`;
  s+=`<button data-go="city">${ICO.pop}${fmt(S.pop)}</button>`;
  s+=`<button data-go="city:happy" class="${h<40?'warn':''}">${ICO.happy(h)}${h}%</button>`;
  const sur=C.pwP-C.pwC;s+=`<button data-go="city" class="${C.powEff<1?'warn':''}">${ICO.pw}${sur>=0?'+':''}${fmt(sur)}</button>`;
  if(C.gd>0)s+=`<button data-go="city" class="${C.supply<.6?'warn':''}">${ICO.goods}${pct(C.supply)}</button>`;
  if(C.cg>.05)s+=`<button data-go="city" class="warn">${ICO.traffic}${pct(C.trafD/C.trafC)}</button>`;
  s+=`<button data-go="research">${ICO.rp}${fmt(S.rp)}</button>`;if(S.crys>=0.05)s+=`<button data-go="research">${ICO.cry}${S.crys>=10?fmt(S.crys):S.crys.toFixed(1)}</button>`;
  if(C.V>=1)s+=`<button data-go="city">${ICO.tour}${fmt(C.V)}</button>`;
  if(s!==_stripLast){_stripLast=s;$('#strip').innerHTML=s;}}
$('#strip').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;sfx('click');const [m,t]=b.dataset.go.split(':');openSheet(m,t);});

const DGOAL=[
 {t:'Coloque 6 decorações neste bairro',p:d=>[cntIn(d,b=>TYPES[b.t].cat==='deco'),6]},
 {t:'Tenha 5 comércios aqui com 90% de mercadorias',p:d=>[C.supply>=.9?cntIn(d,b=>TYPES[b.t].cat==='com'):0,5]},
 {t:'Produza 100 mercadorias por segundo',p:()=>[C.goods,100]},
 {t:'8 residências aqui com felicidade de 75%',p:d=>[S.happy>=75?cntIn(d,b=>TYPES[b.t].cat==='res'):0,8]},
 {t:'4 atrações de entretenimento aqui',p:d=>[cntIn(d,b=>TYPES[b.t].cat==='ent'),4]},
 {t:'Gere 60 de pesquisa por segundo',p:()=>[C.rp,60]},
 {t:'Receba 2.000 visitantes',p:()=>[C.V,2000]},
 {t:'15 prédios neste bairro',p:d=>[cntIn(d,b=>TYPES[b.t].cat!=='deco'),15]},
 {t:'2.000 de energia sobrando',p:()=>[C.pwP-C.pwC,2000]},
 {t:'Uma construção Lendária aqui',p:d=>[cntIn(d,b=>TYPES[b.t].cat==='leg'),1]},
 {t:'Um Monumento da Essência aqui',p:d=>[cntIn(d,b=>b.t==='monu'),1]},
];
DGOAL[12]={t:'10 residências ou natureza aqui',p:d=>[cntIn(d,b=>['res','nat'].includes(TYPES[b.t].cat)),10]};
DGOAL[13]={t:'6 tecnologias ou atrações aqui',p:d=>[cntIn(d,b=>TYPES[b.t].cat==='tech'||TYPES[b.t].tags.includes('attraction')),6]};
DGOAL[14]={t:'8 indústrias aqui',p:d=>[cntIn(d,b=>TYPES[b.t].cat==='ind'),8]};
DGOAL[15]={t:'20 prédios neste bairro',p:d=>[cntIn(d,b=>TYPES[b.t].cat!=='deco'),20]};
function cntIn(d,f){let c=0;for(const b of S.buildings)if(isReady(b)&&distOf(b.x,b.y)===d&&b.t!=='prj'&&f(b))c++;return c;}

let demoArm=null,presArm=false;
function renderSheet(keep){
  const body=$('#body');const st=keep?body.scrollTop:0;let h='';
  const tree=$('.tree');const tsl=tree?tree.scrollLeft:0;
  if(sheetMode==='build'){$('#sheetTitle').textContent=targetPlot?'Construir aqui':'Construir';
    setTabs(CAT_ORDER.map(c=>[c,CATS[c]]));const d0=targetPlot?distOf(...targetPlot):-1;
    if(targetPlot)h+=`<p class="note">Terreno em <b>${DIST[d0].n}</b>. ${DIST[d0].mech} A porcentagem mostra o efeito dos vizinhos aqui.</p>`;
    else h+=`<p class="note">O prédio vai para o melhor terreno livre, pensando nos vizinhos. Toque num terreno vazio da cidade para escolher o lugar.</p>`;
    if(Date.now()<S.instUntil)h+=`<p class="note" style="color:#1a7fc4">Construção instantânea ativa!</p>`;
    const list=Object.keys(TYPES).filter(k=>TYPES[k].cat===sheetTab).sort((a,b)=>TYPES[a].cost-TYPES[b].cost);
    for(const t of list){const T=TYPES[t];const lk=typeLock(t);const c=buildCost(t);const bt=buildTime(t);
      let syn='';if(targetPlot&&!lk){const s=synAt(t,targetPlot[0],targetPlot[1],null);const v=s.m-1+(T.home===d0?1:0);if(Math.abs(v)>.01)syn=`<span class="tag ${v>0?'g':'r'}">${v>0?'+':''}${Math.round(v*100)}% aqui</span>`;}
      const onlyBad=targetPlot&&T.only!==undefined&&T.only!==d0;
      const est=T.inc?`<span class="tag g">~${fmt(T.inc*catMult(T.cat)*C.gm)}/s</span>`:'';
      h+=`<div class="row ${lk?'locked':''}"><div class="th"><img alt="" src="${thumb(t)}"></div><div class="info"><h3>${T.n}</h3><p>${rarTag(T.rar)}${est}${syn}${T.home>=0&&!lk?`<span class="tag y">2× em ${DIST[T.home].n}</span>`:''}${T.only!==undefined?`<span class="tag p">só em ${DIST[T.only].n}</span>`:''}${bt?`<span class="tag">obra ${bt}s</span>`:''}${T.cry?`<span class="tag b">${T.cry} Cristais</span>`:''}</p>
        ${lk?`<p>${lk}</p>`:fxChips(t,1,4)}<p>${T.desc}</p></div>${lk?'<button class="btn off" disabled>Bloqueado</button>':onlyBad?'<button class="btn off" disabled>Outro bairro</button>':cBtn(c,'build:'+t)}</div>`;}
  }
  else if(sheetMode==='upgrade'){$('#sheetTitle').textContent='Melhorar';setTabs([['bld','Prédios'],['city','Cidade']]);
    if(sheetTab==='bld'){h+=`<div class="seg" id="bulkSeg">${[1,10,25,'max'].map(n=>`<button data-bulk="${n}" class="${bulk===n?'on':''}">${n==='max'?'MÁX':'×'+n}</button>`).join('')}</div>`;
      const L=S.buildings.filter(b=>TYPES[b.t].cat!=='deco'&&b.t!=='prj').sort((a,b)=>(a.t==='pref'?-1:b.t==='pref'?1:bIncome(b)-bIncome(a)));
      for(const b of L){const T=TYPES[b.t];const n=bulk==='max'?Math.max(1,maxAfford(b,S.coins)):bulk;const c=bulkCost(b,n);const busy=b.ready>Date.now();
        h+=`<div class="row"><div class="th"><img alt="" src="${thumb(b.t)}"></div><div class="info"><h3>${T.n}</h3><p><span class="tag p">Nv ${b.lvl}</span><span class="tag g">${busy?'em obra':T.inc?'+'+fmt(bIncome(b))+'/s':'serviço'}</span><span class="tag">${DIST[distOf(b.x,b.y)].n}</span></p></div>${busy?'<button class="btn off" disabled>Obra</button>':cBtn(c,'up:'+b.id+':'+n,'+'+n)}</div>`;}}
    else{h+=`<p class="note">Melhorias da cidade valem para todos os prédios do tipo. Somem no prestígio.</p>`;
      for(const u of CU){const own=S.cu[u.id];h+=`<div class="row"><div class="info"><h3>${u.n}</h3><p>${u.d}</p></div>${own?'<button class="btn off" disabled>Comprado</button>':cBtn(u.cost,'cu:'+u.id)}</div>`;}}
  }
  else if(sheetMode==='city'){$('#sheetTitle').textContent='Gestão da Cidade';setTabs([['sum','Resumo'],['happy','Felicidade'],['dist','Bairros'],['maps','Mapas']]);
    const r=cityRank();const nx=RANKS[r+1];
    if(sheetTab==='sum'){
      h+=`<div class="card2 full"><h4>${ICO.pop} ${RANKS[r][1]}</h4><b>${fmt(S.pop)} habitantes</b>${nx?bar(S.pop/nx[0],'b')+`<p>Próximo nível: ${nx[1]} com ${fmt(nx[0])}. Libera: ${RANK_UNLOCK[r+1]}.</p>`:'<p>Nível máximo da cidade!</p>'}</div>`;
      h+=`<div class="card2 full"><h4>${ICO.money} Finanças por segundo</h4><b style="color:${ips<0?'#cf4040':'inherit'}">${ips>=0?'+':''}${fmt(ips)}/s</b><p>Receita ${fmt(C.rev*C.gm)} · Manutenção −${fmt(C.up)} · Multiplicador ×${C.gm.toFixed(2)}</p><svg class="spark" viewBox="0 0 300 56" preserveAspectRatio="none">${spark()}</svg></div>`;
      h+='<div class="cards">';
      h+=card(ICO.pop,'Moradia',fmt(S.pop)+' / '+fmt(C.hcap),bar(C.hcap?S.pop/C.hcap:0,'b'),'Casas trazem moradores. A felicidade decide quanta gente fica.');
      h+=card(ICO.svc,'Empregos',fmt(Math.min(C.wf,C.jobs))+' / '+fmt(C.jobs),bar(C.staff),C.unemp>.05?'Desemprego: '+pct(C.unemp)+'. Crie locais de trabalho.':C.staff<.95?'Faltam '+pct(1-C.staff)+' de funcionários. Construa moradias.':'Tudo equilibrado.',C.unemp>.2||C.staff<.7);
      h+=card(ICO.pw,'Energia','+'+fmt(C.pwP)+' / −'+fmt(C.pwC),bar(C.pwC?C.pwP/C.pwC:1,'y'),C.powEff<1?'Faltando '+pct(1-C.pwP/C.pwC)+'! Prédios rendem menos.':'Sobrando '+fmt(C.pwP-C.pwC)+'.',C.powEff<1);
      h+=card(ICO.goods,'Mercadorias',C.gd?pct(C.supply)+' abastecido':fmt(C.goods)+'/s',bar(C.supply,'y'),'Produzidas '+fmt(C.goods)+'/s · entregues '+fmt(C.deliv)+' · pedidas '+fmt(C.gd)+'.',C.gd>0&&C.supply<.6);
      h+=card(ICO.traffic,'Trânsito',pct(C.trafD/C.trafC),bar(C.trafD/C.trafC,C.cg>0?'r':''),C.cg>0?'Congestionado! Clientes e felicidade caem.':'Ruas fluindo. Capacidade '+fmt(C.trafC)+'.',C.cg>.1);
      h+=card(ICO.tour,'Turismo',fmt(C.V)+' visitantes',bar(C.hotel?Math.min(1,C.V/C.hotel):0,'p'),'Hotéis: '+fmt(C.hotel)+' quartos, ocupação '+pct(C.hotelOcc)+'.');
      h+=card(ICO.pol,'Poluição',C.polIdx<.5?'Baixa':C.polIdx<1.5?'Média':'Alta',bar(Math.min(1,C.polIdx/3),'r'),'Indústrias poluem; natureza limpa '+fmt(C.green*.5)+'.',C.polIdx>1.5);
      h+=card(ICO.rp,'Pesquisa','+'+fmt(C.rp)+'/s',bar(C.cov.edu,'b'),'Educação '+pct(C.cov.edu)+' · qualificação ×'+C.eduQ.toFixed(2)+'.');
      h+=card(ICO.svc,'Serviços',pct((C.cov.edu+C.cov.health+C.cov.safe)/3),bar((C.cov.edu+C.cov.health+C.cov.safe)/3,'p'),'Educação '+pct(C.cov.edu)+' · Saúde '+pct(C.cov.health)+' · Segurança '+pct(C.cov.safe)+(S.pop<250?' (só importam acima de 250 hab.)':''));
      if(S.crys>0||C.crys>0)h+=card(ICO.cry,'Cristais',S.crys.toFixed(1),'', C.crys>0?'+'+(C.crys*60).toFixed(2)+' por minuto (Mineradora).':'Ganhe em eventos e baús.');
      h+='</div>';
      const mods=S.mods.filter(m=>m.perm||m.until>Date.now());if(mods.length){h+='<div class="sec">Efeitos ativos</div><div class="fx">'+mods.map(m=>`<span><i style="background:#8e5cff"></i>${m.label}${m.perm?' (permanente)':' · '+fmtTime((m.until-Date.now())/1000)}</span>`).join('')+'</div>';}
      const cxs=[];for(const d in C.cx)for(const id of C.cx[d])cxs.push([d,CPLX.find(c=>c.id===id)]);
      h+='<div class="sec">Complexos</div>'+(cxs.length?cxs.map(([d,c])=>`<div class="row"><div class="info"><h3 style="color:${c.col}">${c.n}</h3><p>${DIST[d].n} · ${c.fx}</p></div></div>`).join(''):'<p class="note">Combine prédios no mesmo bairro para formar complexos. Ex.: '+CPLX.map(c=>c.n+' ('+c.need.map(([t,n])=>n+' '+TAGN[t].toLowerCase()).join(' + ')+')').slice(0,3).join('; ')+'.</p>');
    }
    else if(sheetTab==='happy'){h+=`<div class="card2 full"><h4>${ICO.happy(S.happy)} Felicidade</h4><b>${Math.round(S.happy)}% <span style="font-size:13px;color:#5d5487">(indo para ${Math.round(C.happyT)}%)</span></b>${bar(S.happy/100)}<p>Felicidade aumenta a renda de tudo (×${(.7+.6*S.happy/100).toFixed(2)}), traz moradores e turistas.</p></div>`;
      h+=why(C.hparts.filter(([,v])=>Math.abs(v)>.05).map(([n,v])=>[n,(v>=0?'+':'−')+Math.abs(v).toFixed(1)]).map(([n,t])=>[n,t]));
      h+=`<p class="note">Dicas: natureza e decorações perto de casas; escolas, hospitais e segurança quando passar de 250 habitantes; transporte contra o trânsito; bosques contra a poluição.</p>`;}
    else if(sheetTab==='dist'){for(const d of S.unlocked){const D=DIST[d];const l=C.devL[d]||0;const s=C.devS[d]||0;let inc=0;for(const b of S.buildings)if(distOf(b.x,b.y)===d)inc+=bIncome(b);
      h+=`<div class="row"><div class="th" style="background:${D.g}"></div><div class="info"><h3>${D.n}</h3><p><span class="tag" style="background:${DEV[l][1]};color:#fff">${DEV[l][0]}</span><span class="tag g">${fmt(inc)}/s</span><span class="tag">renda ×${DEV[l][2]}</span>${S.dmg[d]>Date.now()?'<span class="tag r">danificado</span>':''}</p>${bar(s/100,'y')}<p>${D.mech}</p></div></div>`;}
      h+=`<p class="note">O nível sobe com terrenos ocupados, níveis dos prédios, natureza e decorações, serviços, felicidade e ruas especiais.</p>`;}
    else if(sheetTab==='maps'){h+=`<p class="note">Mapas de calor pintam a cidade para você encontrar problemas e oportunidades.</p><div class="tiles">`+
      [['happy','Felicidade','Onde as pessoas estão felizes'],['traffic','Trânsito','Ruas congestionadas'],['service','Serviços','Cobertura de escolas, saúde e segurança'],['econ','Economia','Quem gera mais dinheiro'],['power','Energia','Quem gera e quem falta energia'],['syn','Sinergias','Prédios com bônus ou penalidades de vizinhança']].map(([k,n,d])=>`<button class="tile" data-act="heat:${k}"><b>${n}</b><span>${d}</span></button>`).join('')+'</div>';}
  }
  else if(sheetMode==='research'){$('#sheetTitle').textContent='Pesquisa';setTabs(null);
    h+=`<div class="row"><div class="info"><h3>${fmt(S.rp)} de pesquisa</h3><p>+${fmt(C.rp)}/s · escolas, universidades e tecnologia geram pesquisa${S.crys>0?' · '+S.crys.toFixed(1)+' Cristais':''}</p></div></div>`;
    h+=`<div class="tree"><div class="tree-in">`;for(const [br,bn,bc] of BRANCH){h+=`<div class="brn">${bn}<i style="background:${bc}"></i></div>`;
      for(let tier=1;tier<=4;tier++){const t=TECHM[br+tier];const done=tk(t.id);const can=t.req.every(r=>tk(r));const cls=done?'done':can?'avail':'lock';
        h+=`<button class="node ${cls} ${tier===1?'first':''} ${selTech===t.id?'sel':''}" data-act="tsel:${t.id}"><b>${t.n}</b><small>${done?'Pesquisado':fmt(t.cost)+' pesquisa'+(t.cry?' · '+t.cry+' Cristais':'')}</small></button>`;}}
    h+='</div></div>';const t=TECHM[selTech||'arq1'];if(t){const done=tk(t.id);const unl=Object.keys(TYPES).filter(k=>TYPES[k].req===t.id);
      h+=`<div class="tdet"><h3>${t.n}</h3><p class="note">${t.d}</p>${unl.length?`<div class="fx">${unl.map(k=>`<span><img src="${thumb(k)}" alt="" style="width:22px;height:22px">${TYPES[k].n}</span>`).join('')}</div>`:''}
        ${t.req.length?`<p class="note">Requer: ${t.req.map(r=>(tk(r)?'✓ ':'✗ ')+TECHM[r].n).join(' · ')}</p>`:''}
        ${done?'<button class="btn off" disabled>Pesquisado</button>':`<button class="btn b wide" data-act="tech:${t.id}" data-rp="${t.cost}"><i class="mr"></i>Pesquisar · ${fmt(t.cost)}${t.cry?' · '+t.cry+' Cristais':''}</button>`}</div>`;}
  }
  else if(sheetMode==='bld'){const b=S.buildings.find(x=>x.id===selB);if(!b){closeSheet();return;}const T=TYPES[b.t];setTabs(null);
    const d=distOf(b.x,b.y);const busy=b.ready>Date.now();
    if(b.t==='prj'){const p=PRJM[b.pid],sp=S.prj[b.pid]||{s:0};$('#sheetTitle').textContent=p.n;
      h+=`<div class="bhead"><div class="th"><img alt="" src="${thumb('prj',b.pid)}"></div><div><h3>${p.n}</h3><p class="note">${p.fx}</p><p class="note">Etapas concluídas: ${sp.s}/3</p></div></div>`;
      if(busy)h+=`<p class="note">Em obra: ${p.st[sp.s].n} · falta ${fmtTime((b.ready-Date.now())/1000)}</p>`;h+=`<button class="btn p wide" data-act="openprj">Ver projetos municipais</button>`;}
    else{$('#sheetTitle').textContent=T.n;const tier=tierOf(b.lvl);const pm=prevMile(b.lvl),nm=nextMile(b.lvl);const pr=b.lvl<5?(b.lvl-1)/4:(b.lvl-pm)/(nm-pm);const s=T.cat==='deco'?1:sc(b);
      const totm=b._inc&&T.inc?b._inc/(T.inc*b.lvl*Math.pow(2,tier))*C.gm:0;
      h+=`<div class="bhead"><div class="th"><img alt="" src="${thumb(b.t)}"></div><div style="min-width:0"><h3>${T.n}</h3><p class="note">${T.desc}</p><p class="note">${rarTag(T.rar)}<span class="tag">${CATS[T.cat]}</span><span class="tag">${DIST[d].n}</span></p></div></div>`;
      h+=`<div class="stats"><div class="stat"><small>Nível</small><b>${T.cat==='deco'?'—':b.lvl}</b></div><div class="stat"><small>Renda</small><b>${busy?'obra':T.inc?fmt(bIncome(b))+'/s':'—'}</b></div><div class="stat"><small>Eficiência</small><b>${T.inc&&!busy?'×'+fmt(totm):'—'}</b></div></div>`;
      h+=`<div class="sec">O que faz</div>${fxChips(b.t,s)}`;
      if(T.cat==='pub'&&b.t!=='pref')h+=`<p class="note">Cobertura da cidade: educação ${pct(C.cov.edu)}, saúde ${pct(C.cov.health)}, segurança ${pct(C.cov.safe)}. Subir de nível aumenta o alcance.</p>`;
      if(b.t==='pref')h+=`<p class="note">Cada nível da Prefeitura dá +5% de renda para a cidade toda e libera bairros novos.</p>`;
      if(!busy&&b._why&&b._why.length)h+=`<div class="sec">Conexões e efeitos</div>${why(b._why)}`;
      else if(!busy&&b._s&&b._s.list.length)h+=`<div class="sec">Vizinhança</div>${why(b._s.list.map(x=>[x.n,1+x.v]))}`;
      const ctips=[];if(T.tags.includes('res'))ctips.push('áreas verdes e serviços perto; longe de fábricas');if(T.tags.includes('shop'))ctips.push('casas e estações de transporte perto');if(T.tags.includes('hotel'))ctips.push('atrações turísticas perto');if(T.tags.includes('factory'))ctips.push('depósito ou centro logístico ao lado');if(T.tags.includes('tech'))ctips.push('escolas e universidades perto');if(T.tags.includes('ent'))ctips.push('transporte e comida perto');
      if(ctips.length)h+=`<p class="note">Rende mais com: ${ctips.join('; ')}.</p>`;
      if(T.cat!=='deco'){h+=`<div><p class="note">Próximo marco: nível ${nm} (produção 2×)</p>${bar(pr,'y')}</div>`;
        if(busy){const rem=(b.ready-Date.now())/1000;const gc=Math.max(1,Math.ceil(rem/20));h+=`<p class="note">Em construção: falta ${fmtTime(rem)}</p>${gBtn(gc,'rush:'+b.id,'Acelerar')}`;}
        else h+=`<div class="upgrid">${[1,10,25,'max'].map(n=>{const nn=n==='max'?Math.max(1,maxAfford(b,S.coins)):n;const c=bulkCost(b,nn);return `<button class="btn" data-act="up:${b.id}:${n}" data-cost="${c}">${n==='max'?'MÁX':'+'+n}<small><i class="mc"></i>${fmt(c)}</small></button>`;}).join('')}</div>`;}
      else h+=`<p class="note">Decorações não sobem de nível, mas deixam vizinhos e o bairro mais bonitos.</p>`;
      const owned=COS.filter(c=>c.slot==='bskin'&&S.cos.own.includes(c.id));
      if(T.cat!=='deco'&&b.t!=='pref'){h+=`<div class="sec">Estilo</div>`;if(owned.length)h+=`<div class="seg">${['',...owned.map(c=>c.sk)].map(k=>`<button data-act="skin:${b.id}:${k}" class="${(b.skin||'')===k?'on':''}">${k?SKINS[k].n:'Original'}</button>`).join('')}</div><p class="note">Estilos dão +10% de renda ao prédio.</p>`;
        else h+=`<p class="note">Ganhe estilos (Doces, Brinquedo, Neon, Fantasia, Ficção científica) em baús, conquistas e com a Íris.</p>`;}
      if(b.t!=='pref')h+=`<button class="btn r" data-act="demo:${b.id}" style="align-self:flex-start;margin-top:4px">${demoArm===b.id?'Toque de novo para demolir':'Demolir'}</button>`;}
  }
  else if(sheetMode==='districts'){$('#sheetTitle').textContent='Bairros';setTabs(null);
    h+=`<p class="note">Cada bairro tem uma regra própria e construções exclusivas. Bairro completo (todos os terrenos ocupados): +10% de renda na cidade.</p>`;
    for(let d=0;d<=15;d++){const D=DIST[d];if(!D)continue;const un=S.unlocked.includes(d);if(d===10&&S.ess<1&&!un)continue;
      if(d===12)h+=`<div class="sec">${map1Done()?'Mapa 2 — Nova Expansão':'Mapa 2 — bloqueado'}</div><p class="note">${map1Done()?'Novos bairros, bem mais caros, pra continuar crescendo antes do Renascimento.':'Complete todos os bairros do Mapa 1 (todos os terrenos ocupados) para revelar o Mapa 2.'}</p>`;
      const plots=plotsOf(d);const used=plots.filter(([x,y])=>occ.has(x+','+y)).length;
      const prevOk=d===0||d===10?true:d===12?map1Done():S.unlocked.includes(d-1);const prOk=pref().lvl>=D.pref;const essOk=!D.ess||S.ess>=D.ess;
      let act;if(un)act=`<button class="btn b" data-act="go:${d}">Ver</button>`;else if(!prevOk)act=`<button class="btn off" disabled>${d===12?'Complete o Mapa 1':'Anterior antes'}</button>`;else if(!essOk)act=`<button class="btn off" disabled>${D.ess} Essência</button>`;else if(!prOk)act=`<button class="btn off" disabled>Prefeitura ${D.pref}</button>`;else act=cBtn(D.cost,'unlock:'+d,'','y');
      const l=C.devL[d]||0;h+=`<div class="row ${un||prevOk?'':'locked'}"><div class="th" style="background:${D.g}"><svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 6l14 7-14 7-14-7z" fill="${shade(D.g,.25)}" stroke="#2b2350" stroke-width="1.5"/><path d="M6 13v12l14 7V20zM34 13v12l-14 7V20z" fill="${shade(D.g,-.25)}" stroke="#2b2350" stroke-width="1.5"/><circle cx="20" cy="13" r="3" fill="${D.acc}"/></svg></div><div class="info"><h3>${d===10?'':((d+1)+'. ')}${D.n}</h3>
        ${un?`<p><span class="tag" style="background:${DEV[l][1]};color:#fff">${DEV[l][0]}</span><span class="tag">${used}/${plots.length} terrenos</span></p>`:`<p>Prefeitura nível ${D.pref}${D.ess?' · '+D.ess+' Essência':''}</p>`}<p>${D.mech}</p><p>Exclusivos: ${D.ex}</p></div>${act}</div>`;
      if(un){const g=DGOAL[d];const [a,bn]=g.p(d);const done=S.dgoal[d];h+=`<div class="row" style="margin-top:-4px;margin-left:16px"><div class="info"><h3 style="font-size:14px">Meta do bairro: ${g.t}</h3>${bar(a/bn,'p')}<p>${done?'Concluída: renda +25% neste bairro':fmt(Math.min(a,bn))+'/'+fmt(bn)+' · prêmio: +25% de renda aqui e 20 joias'}</p></div>${done?'':a>=bn?`<button class="btn y" data-act="dgoal:${d}">Pegar</button>`:''}</div>`;
        const rs=S.road[d]||'asfalto';const ri2=ROADS.findIndex(r=>r.id===rs);const nxr=ROADS[ri2+1];
        h+=`<div class="row" style="margin-top:-4px;margin-left:16px"><div class="info"><h3 style="font-size:14px">Ruas: ${ROADS[ri2].n}</h3><p>${nxr?'Próximo estilo: '+nxr.n+' (+'+nxr.happy+' felicidade, +'+nxr.tour+' turismo)':'Estilo máximo!'}</p></div>${nxr?cBtn(nxr.cost,'road:'+d,'','w'):''}</div>`;
        if(S.dmg[d]>Date.now())h+=`<div class="row hot" style="margin-left:16px"><div class="info"><h3 style="font-size:14px">Estragos da tempestade</h3><p>Renda −30% aqui por mais ${fmtTime((S.dmg[d]-Date.now())/1000)}</p></div>${cBtn(cost(30),'repair:'+d,'Consertar','r')}</div>`;}}
  }
  else if(sheetMode==='missions'){$('#sheetTitle').textContent='Missões';setTabs([['guide','Guia'],['req','Pedidos'],['daily','Diárias'],['metas','Metas'],['ach','Conquistas'],['rank','Ranking']]);ensureDaily();
    if(sheetTab==='guide'){const left=GUIDE.filter(g=>!S.metas['gd_'+g.id]);
      h+=`<p class="note">Primeiros passos pra organizar sua cidade. Complete na ordem que quiser — cada um dá uma recompensa.</p>`;
      if(!left.length)h+=`<div class="qcard">${portrait('lucia')}<div class="info"><h3>Guia concluído!</h3><p>Você já sabe o essencial. De agora em diante, use Metas e Conquistas pra continuar evoluindo.</p></div></div>`;
      for(const g of GUIDE){const done=!!S.metas['gd_'+g.id];const ok=g.c();h+=`<div class="row ${done?'':ok?'hot':''}"><div class="info"><h3>${g.n}</h3><p>${g.d}</p><p class="note">Prêmio: ${rewardTxt(g.g)}</p></div>${done?'<button class="btn off" disabled>Feito</button>':ok?`<button class="btn y" data-act="gclaim:${g.id}">Pegar</button>`:'<button class="btn off" disabled>…</button>'}</div>`;}}
    else if(sheetTab==='req'){for(const ch of Object.keys(CHARS)){const c=CHARS[ch];if(!charUnlocked(ch)){h+=`<div class="qcard" style="opacity:.55">${portrait(ch)}<div class="info"><div class="who" style="color:${c.col}">${c.n} · ${c.role}</div><p>Chega quando a cidade virar ${RANKS[CHAR_UNLOCK[ch]][1]}.</p></div></div>`;continue;}
      const q=S.ctx[ch];if(q)h+=`<div class="qcard" style="box-shadow:0 3px 0 var(--sun),0 0 0 2px var(--sun)">${portrait(ch)}<div class="info"><div class="who" style="color:${c.col}">Pedido urgente · ${c.n}</div><h3>${q.t}</h3><p>${q.d}</p>${bar(((S.cnt.tags[q.tag]||0)-q.base)/q.n,'y')}<div class="acts">${q.done?`<button class="btn y" data-act="cclaim:${ch}">Pegar prêmio</button>`:`<span class="tag">${Math.max(0,(S.cnt.tags[q.tag]||0)-q.base)}/${q.n}</span>`}</div></div></div>`;
      const s=stepOf(ch);if(s){const dn=stepDone(s);let pr='';if(s.p){const [a,bb]=s.p();pr=bar(a/bb,'p')+`<span class="tag">${fmt(Math.min(a,bb))}/${fmt(bb)}</span>`;}
        h+=`<div class="qcard">${portrait(ch)}<div class="info"><div class="who" style="color:${c.col}">${c.n} · ${c.role} · ${(S.story[ch]||0)+1}/${STORY[ch].length}</div><h3>${s.t}</h3><p>${s.d}</p>${pr}<div class="acts">${dn?`<button class="btn y" data-act="sclaim:${ch}">Pegar prêmio</button>`:''}<span class="note">Prêmio: ${rewardTxt(s.r)}</span></div></div></div>`;}
      else h+=`<div class="qcard">${portrait(ch)}<div class="info"><div class="who" style="color:${c.col}">${c.n}</div><p>Todos os desafios concluídos!</p></div></div>`;}}
    else if(sheetTab==='daily'){h+=`<p class="note">Novas missões todo dia. Recompensa extra ao completar as três.</p>`;
      S.daily.list.forEach((m,i)=>{h+=`<div class="row"><div class="info"><h3>${m.txt}</h3>${bar(m.p/m.n,'p')}<p>${fmt(m.p)}/${fmt(m.n)} · ${m.g} joias + moedas</p></div>${m.claimed?'<button class="btn off" disabled>Feito</button>':m.done?`<button class="btn y" data-act="dclaim:${i}">Pegar</button>`:'<button class="btn off" disabled>…</button>'}</div>`;});
      const all=S.daily.list.every(m=>m.claimed);h+=`<div class="row"><div class="th"><div class="chest-ico"><i></i></div></div><div class="info"><h3>Baú do dia</h3><p>Complete e pegue as 3 missões</p></div>${S.daily.bonus?'<button class="btn off" disabled>Aberto</button>':all?'<button class="btn y" data-act="dbonus">Abrir</button>':'<button class="btn off" disabled>Trancado</button>'}</div>`;}
    else if(sheetTab==='metas'){let grp='';for(const m of METAS){if(m.grp!==grp){grp=m.grp;h+=`<div class="sec">${grp}</div>`;}const [a,bn]=m.p();const st=S.metas[m.id];
      h+=`<div class="row ${st||a>=bn?'':'locked'}"><div class="info"><h3>${m.n}</h3>${bar(a/bn,'b')}<p>${rewardTxt(m.r)}</p></div>${st?'<button class="btn off" disabled>Feito</button>':a>=bn?`<button class="btn y" data-act="mclaim:${m.id}">Pegar</button>`:''}</div>`;}}
    else if(sheetTab==='ach'){for(const a of ACH){const s=S.ach[a.id];const c=a.cos?COS.find(x=>x.id===a.cos):null;h+=`<div class="row ${s?'':'locked'}"><div class="info"><h3>${a.n}</h3><p>${a.d} · ${a.g} joias${c?' + '+c.n:''}</p></div>${s==='claimed'?'<button class="btn off" disabled>Feito</button>':s==='done'?`<button class="btn y" data-act="aclaim:${a.id}">Pegar</button>`:'<button class="btn off" disabled>…</button>'}</div>`;}}
    else{h+=`<p class="note">Ranking mundial pela população da sua cidade. Sua pontuação (${fmt(S.pop)} habitantes) é enviada sozinha de tempos em tempos — não precisa fazer nada.</p>
      ${S.lbRank?`<div class="qcard" style="justify-content:center"><div class="info" style="text-align:center"><h3>Sua posição mundial</h3><p style="font-size:22px;font-weight:900;color:var(--grape)">#${fmt(S.lbRank)}</p></div></div>`:''}
      <div class="row"><div class="info"><h3>Seu nome no ranking</h3><input id="lbNameInput" maxlength="18" value="${(S.lbName||lbDefaultName()).replace(/"/g,'&quot;')}" placeholder="Como quer aparecer?" style="width:100%;box-sizing:border-box;border-radius:10px;border:2px solid var(--line);padding:8px;font-family:var(--body);font-size:14px;color:var(--ink)"></div></div>
      <button class="btn y wide" data-act="lbsend">Salvar nome e atualizar agora</button>`;
      if(lbLoading&&!lbCache)h+=`<p class="note" style="text-align:center">Carregando ranking…</p>`;
      else if(lbErr)h+=`<div class="row"><div class="info"><p class="note">Não consegui carregar agora.</p></div><button class="btn" data-act="lbrefresh">Tentar de novo</button></div>`;
      else{if(lbCache===null)lbFetchTop();
        h+=`<div class="sec">Top jogadores do mundo</div>`;
        if(lbCache&&lbCache.length){lbCache.forEach((r,i)=>{h+=`<div class="row"><div class="info"><h3>#${i+1} · ${(r.name||'Jogador').replace(/</g,'')}</h3><p>${fmt(r.pop)} habitantes</p></div></div>`;});}
        else if(lbCache)h+=`<p class="note">Ninguém enviou pontuação ainda. Seja o primeiro!</p>`;
        else h+=`<p class="note" style="text-align:center">Carregando ranking…</p>`;}}
  }
  else if(sheetMode==='more'){$('#sheetTitle').textContent='Mais';setTabs(null);
    h+=`<div class="tiles">
      <button class="tile" data-act="mode:projects"><svg viewBox="0 0 32 32"><path d="M4 26h24M7 26V12h6v14M15 26V6h10v20" fill="#ffc53d" stroke="#2b2350" stroke-width="2" stroke-linejoin="round"/><path d="M17 10h6M17 14h6M17 18h6" stroke="#2b2350" stroke-width="1.6"/></svg><b>Projetos</b><span>Obras gigantes em etapas que mudam a cidade</span></button>
      <button class="tile" data-act="mode:collection"><svg viewBox="0 0 32 32"><path d="M16 3l3.8 8 8.7 1-6.4 6 1.8 8.7L16 22.4l-7.9 4.3L9.9 18 3.5 12l8.7-1z" fill="#ffc53d" stroke="#2b2350" stroke-width="2" stroke-linejoin="round"/></svg><b>Coleção</b><span>Itens, estilos, arquitetura e loja</span></button>
      <button class="tile" data-act="mode:prestige"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="#9ff3ff" stroke="#2b2350" stroke-width="2"/><path d="M16 7l2.4 6.6L25 16l-6.6 2.4L16 25l-2.4-6.6L7 16l6.6-2.4z" fill="#8e5cff" stroke="#2b2350" stroke-width="1.6"/></svg><b>Prestígio</b><span>Renasça com Essência Urbana${essGain()>=1?' (disponível!)':''}</span></button>
      <button class="tile" data-act="stats"><svg viewBox="0 0 32 32"><rect x="5" y="16" width="5" height="11" rx="2" fill="#2fd08a" stroke="#2b2350" stroke-width="2"/><rect x="13.5" y="9" width="5" height="18" rx="2" fill="#ffc53d" stroke="#2b2350" stroke-width="2"/><rect x="22" y="4" width="5" height="23" rx="2" fill="#8e5cff" stroke="#2b2350" stroke-width="2"/></svg><b>Estatísticas</b><span>Números da sua cidade</span></button></div>`;
  }
  else if(sheetMode==='projects'){$('#sheetTitle').textContent='Projetos Municipais';setTabs(null);h+=`<p class="note">Projetos têm 3 etapas com requisitos. Cada etapa concluída muda a obra na cidade, e o projeto completo libera um efeito permanente.</p>`;
    for(const p of PRJ){const sp=S.prj[p.id]||{s:0};const busy=prjBusy(p.id);const done=sp.s>=3;const g=p.st[Math.min(2,sp.s)];
      h+=`<div class="qcard">${portrait(p.ch)}<div class="info"><div class="who" style="color:${CHARS[p.ch].col}">${CHARS[p.ch].n}</div><h3>${p.n}</h3><p>${p.fx}</p>
        <div class="fx" style="margin-top:4px">${p.st.map((x,i)=>`<span><i style="background:${i<sp.s?'#2fd08a':i===sp.s?'#ffc53d':'#d9d2e8'}"></i>${x.n}</span>`).join('')}</div>`;
      if(!done){const reqs=g.req.map(r=>reqCheck(r));h+=`<p style="margin-top:6px"><b>Etapa ${sp.s+1}: ${g.n}</b> · obra de ${g.t}s</p>${reqs.map(([ok,t])=>`<p style="color:${ok?'#179a62':'#cf4040'}">${ok?'✓':'✗'} ${t}</p>`).join('')}`;
        const can=reqs.every(x=>x[0])&&(!g.cry||S.crys>=g.cry)&&(!g.rp||S.rp>=g.rp);
        h+=`<div class="acts">${busy?`<button class="btn off" disabled>Em obra</button>`:`<button class="btn ${can?'':'off'}" data-act="stage:${p.id}" data-cost="${g.cost}"><i class="mc"></i>${fmt(g.cost)}${g.cry?' · '+g.cry+' Cristais':''}${g.rp?' · '+fmt(g.rp)+' pesquisa':''}</button>`}${sp.bid?`<button class="btn b" data-act="gob:${sp.bid}">Ver</button>`:''}</div>`;}
      else h+=`<div class="acts"><span class="tag g">Concluído</span>${sp.bid?`<button class="btn b" data-act="gob:${sp.bid}">Ver</button>`:''}</div>`;h+='</div></div>';}
  }
  else if(sheetMode==='collection'){$('#sheetTitle').textContent='Coleção';setTabs([['cos','Itens'],['arch','Arquitetura'],['shop','Loja de Joias']]);
    if(sheetTab==='cos'){h+=`<p class="note">${S.cos.own.length}/${COS.length} itens. Ganhe em baús, eventos, conquistas e com os personagens. Toque para equipar.</p>`;
      for(const slot of Object.keys(SLOTN)){h+=`<div class="sec">${SLOTN[slot]}</div>`;for(const c of COS.filter(x=>x.slot===slot)){const own=S.cos.own.includes(c.id);const eq=S.cos.eq[slot]===c.id;
        h+=`<div class="row ${own?'':'locked'}"><div class="info"><h3>${own?c.n:'???'}</h3><p class="rar-${c.r}" style="font-weight:900;text-transform:capitalize">${c.r}</p></div>${own?(slot==='bskin'?'<span class="tag g">no painel do prédio</span>':`<button class="btn ${eq?'':'b'}" data-act="eq:${c.id}">${eq?'Equipado':'Equipar'}</button>`):'<button class="btn off" disabled>Bloqueado</button>'}</div>`;}}}
    else if(sheetTab==='arch'){h+=`<p class="note">Construa ao menos um de cada modelo da categoria para completar a coleção e ganhar +15% de renda nela para sempre.</p>`;
      for(const cat of CAT_ORDER){const all=Object.keys(TYPES).filter(k=>TYPES[k].cat===cat&&!TYPES[k].ess);const got=all.filter(k=>S.seenT[k]);
        h+=`<div class="row"><div class="info"><h3>${CATS[cat]} ${S.colDone[cat]?'<span class="tag g">completa · +15%</span>':''}</h3>${bar(got.length/all.length,'y')}<div class="fx" style="margin-top:6px">${all.map(k=>`<span style="opacity:${S.seenT[k]?1:.4}"><img src="${thumb(k)}" alt="" style="width:22px;height:22px">${S.seenT[k]?TYPES[k].n:'???'}</span>`).join('')}</div></div></div>`;}}
    else{h+=`<p class="note">Joias são ganhas jogando: missões, conquistas, pedidos, meteoros e baús.</p>`;
      const adBoostReady=!(S.adCdBoost>Date.now()),adChestReady=!(S.adCdChest>Date.now());
      h+=`<div class="sec">Assista e ganhe</div>`;
      h+=`<div class="row"><div class="info"><h3>Turbo 2× por 30 min</h3><p>${adBoostReady?'Grátis assistindo um anúncio curto':'Disponível em '+fmtTime((S.adCdBoost-Date.now())/1000)}</p></div>${adBoostReady?'<button class="btn y" data-act="ad:boost">Assistir anúncio</button>':'<button class="btn off" disabled>Aguarde</button>'}</div>`;
      h+=`<div class="row"><div class="info"><h3>Baú bônus</h3><p>${adChestReady?'Grátis assistindo um anúncio curto':'Disponível em '+fmtTime((S.adCdChest-Date.now())/1000)}</p></div>${adChestReady?'<button class="btn y" data-act="ad:chest">Assistir anúncio</button>':'<button class="btn off" disabled>Aguarde</button>'}</div>`;
      const carReady=!(S.adCdCar>Date.now());h+=`<div class="row"><div class="info"><h3>Carro dourado</h3><p>${carReady?'Estacionado perto da prefeitura — toque nele no mapa':'Já passou por hoje · volta em '+fmtTime((S.adCdCar-Date.now())/1000)}</p></div>${carReady?'<button class="btn y" data-act="gocar">Ir até lá</button>':'<button class="btn off" disabled>Aguarde</button>'}</div>`;
      h+=`<div class="sec">Comprar com joias</div>`;
      h+=`<div class="row"><div class="info"><h3>Turbo 2× por 15 min</h3><p>${gemBoostOn()?'Ativo: '+fmtTime((S.gemBoost-Date.now())/1000)+' restantes (compra soma tempo)':'Dobra toda a produção'}</p></div>${gBtn(20,'g:boost','Usar')}</div>`;
      h+=`<div class="row"><div class="info"><h3>City Rush agora</h3><p>3× por 20 segundos</p></div>${ev?'<button class="btn off" disabled>Evento ativo</button>':gBtn(15,'g:rush','Usar')}</div>`;
      h+=`<div class="row"><div class="info"><h3>Baú de Joias</h3><p>Moedas, joias e chance de item</p></div>${gBtn(30,'g:chest','Abrir')}</div>`;
      h+=`<div class="row"><div class="info"><h3>Pacote de Pesquisa</h3><p>+5 minutos de pesquisa</p></div>${gBtn(25,'g:rp','Usar')}</div>`;
      h+=`<div class="row"><div class="info"><h3>Cristal</h3><p>+1 Cristal</p></div>${gBtn(40,'g:cry','Comprar')}</div>`;}
  }
  else if(sheetMode==='prestige'){$('#sheetTitle').textContent='Prestígio';setTabs(null);const g=essGain();
    h+=`<div class="row"><i class="ico ess"></i><div class="info"><h3>${S.ess} Essência Urbana</h3><p>+${S.ess*5}% de renda permanente (+5% por Essência)</p></div></div>`;
    const mapsOk=map1Done()&&map2Done();
    h+=`<div class="row"><div class="info"><h3>Ganho agora: +${g}</h3><p>${!map1Done()?'Complete todos os bairros do Mapa 1 para revelar o Mapa 2.':!map2Done()?'Complete todos os bairros do Mapa 2 (em Bairros) para liberar o Renascimento.':'Moedas ganhas neste ciclo: '+fmt(S.run)+(g<1?' · mínimo 10M para renascer':'')}</p>${mapsOk?(g<1?bar(S.run/1e7,'p'):`<p>Próxima Essência em ${fmt(Math.pow((g+1)/3,2)*1e7-S.run)} moedas</p>`):''}</div></div>`;
    h+=`<div class="sec">O que reinicia</div><p class="note">Moedas, prédios, níveis, bairros, população, projetos e melhorias da cidade.</p><div class="sec">O que fica</div><p class="note">Essência, joias, Cristais, pesquisas, coleção, conquistas, histórias dos personagens e configurações.</p>`;
    h+=`<div class="sec">Desbloqueios da Essência</div>`;for(const [n,t] of PERKS)h+=`<div class="row ${S.ess>=n?'':'locked'}"><div class="info"><h3>${n} Essência</h3><p>${t}</p></div><span class="tag ${S.ess>=n?'g':''}">${S.ess>=n?'ativo':'bloqueado'}</span></div>`;
    h+=`<button class="btn big p" data-act="prestige" ${g<1?'disabled':''}>${presArm?'Toque de novo para confirmar':'Renascer (+'+g+' Essência)'}</button>`;
  }
  body.innerHTML=h;if(keep)body.scrollTop=st;else body.scrollTop=0;const tr=$('.tree');if(tr&&keep)tr.scrollLeft=tsl;refreshButtons();
}
function card(ico,t,v,b,p,warn){return `<div class="card2 ${warn?'warn':''}"><h4>${ico}${t}</h4><b>${v}</b>${b||''}<p>${p}</p></div>`;}
function rewardTxt(r){const L=[];if(r.cs)L.push('moedas');if(r.gems)L.push(r.gems+' joias');if(r.rp)L.push(fmt(r.rp)+' pesquisa');if(r.crys)L.push(r.crys+' Cristais');if(r.cos)L.push(COS.find(c=>c.id===r.cos).n);return L.join(' + ');}
const hist=[];function spark(){if(hist.length<2)return '<text x="150" y="32" text-anchor="middle" font-size="11" fill="#5d5487" font-family="Nunito">Coletando dados…</text>';const mx=Math.max(...hist,1),mn=Math.min(...hist,0);const pts=hist.map((v,i)=>[i/(hist.length-1)*300,50-(v-mn)/(mx-mn||1)*44]);
  return `<path d="M0 56 L${pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')} L300 56Z" fill="rgba(47,208,138,.18)"/><path d="M${pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')}" fill="none" stroke="#179a62" stroke-width="2"/><circle cx="${pts[pts.length-1][0]}" cy="${pts[pts.length-1][1]}" r="3.5" fill="#179a62"/>`;}
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;sfx('click');sheetTab=b.dataset.tab;renderSheet();});
$('#body').addEventListener('click',e=>{const sb=e.target.closest('[data-bulk]');if(sb){bulk=sb.dataset.bulk==='max'?'max':+sb.dataset.bulk;sfx('click');renderSheet(true);return;}
  const b=e.target.closest('[data-act]');if(!b||b.disabled)return;const [a,p1,p2]=b.dataset.act.split(':');audioInit();
  if(a==='build')build(p1);
  else if(a==='up'){const bb=S.buildings.find(x=>x.id===+p1);if(bb)upgrade(bb,p2==='max'?'max':+p2);}
  else if(a==='cu'){const u=CU.find(x=>x.id===p1);if(u&&!S.cu[u.id]&&spend(u.cost)){S.cu[u.id]=1;dirty=true;sfx('up');toast(u.n+' comprado!','g');screenConfetti(30);renderSheet(true);}else sfx('err');}
  else if(a==='unlock')unlockDistrict(+p1);
  else if(a==='go'){const gx=p1%GXN,gy=Math.floor(p1/GXN);const [wx,wy]=proj(gx*DS+3.5,gy*DS+3.5);closeSheet();cam.tx=wx;cam.ty=wy;cam.tz=1.1;sfx('click');}
  else if(a==='gocar'){const [wx,wy]=proj(CARSPOT.x+.5,CARSPOT.y+.5);closeSheet();cam.tx=wx;cam.ty=wy;cam.tz=1.3;sfx('click');}
  else if(a==='lbsend'){const inp=$('#lbNameInput');const name=(inp?inp.value:'').trim().slice(0,18);S.lbName=name||'Jogador';save();sfx('click');lbSubmit();}
  else if(a==='lbrefresh'){lbErr=false;lbFetchTop();renderSheet(true);}
  else if(a==='gob'){const bb=S.buildings.find(x=>x.id===+p1);if(bb){closeSheet();const [wx,wy]=bWorld(bb);camTo(wx,wy-30,1.4);}}
  else if(a==='rush'){const bb=S.buildings.find(x=>x.id===+p1);const gc=Math.max(1,Math.ceil((bb.ready-Date.now())/20000));if(S.gems>=gc){S.gems-=gc;bb.ready=Date.now();finishBuild(bb);renderSheet(true);}else{sfx('err');toast('Joias insuficientes','r');}}
  else if(a==='demo'){if(demoArm!==+p1){demoArm=+p1;sfx('click');renderSheet(true);setTimeout(()=>{if(demoArm===+p1){demoArm=null;if(sheetMode==='bld')renderSheet(true);}},4000);return;}demoArm=null;demolish(+p1);}
  else if(a==='skin'){const bb=S.buildings.find(x=>x.id===+p1);if(bb)applySkin(bb,p2);}
  else if(a==='dclaim'){const m=S.daily.list[+p1];if(m&&m.done&&!m.claimed){m.claimed=true;S.gems+=m.g;const c=Math.max(100,ipsBase*120);earn(c);sfx('chest');toast('+'+m.g+' joias e '+fmt(c)+' moedas','g');updateDots();renderSheet(true);}}
  else if(a==='dbonus'){if(!S.daily.bonus){S.daily.bonus=true;grantChest('daily');updateDots();renderSheet(true);}}
  else if(a==='aclaim'){const ac=ACH.find(x=>x.id===p1);if(S.ach[p1]==='done'){S.ach[p1]='claimed';S.gems+=ac.g;let msg='+'+ac.g+' joias';if(ac.cos&&!S.cos.own.includes(ac.cos)){S.cos.own.push(ac.cos);msg+=' + '+COS.find(x=>x.id===ac.cos).n;}sfx('chest');toast(msg,'p');updateDots();renderSheet(true);}}
  else if(a==='mclaim'){const m=METAS.find(x=>x.id===p1);if(m&&!S.metas[p1]){const [x,y]=m.p();if(x>=y){S.metas[p1]=1;giveReward(m.r,m.n);updateDots();renderSheet(true);}}}
  else if(a==='ad'){if(p1==='boost'&&S.adCdBoost>Date.now())return;if(p1==='chest'&&S.adCdChest>Date.now())return;sfx('click');requestAd(p1);}
  else if(a==='gclaim'){const g=GUIDE.find(x=>x.id===p1);if(g&&!S.metas['gd_'+p1]&&g.c()){S.metas['gd_'+p1]=1;giveReward(g.g,g.n);updateDots();renderSheet(true);}}
  else if(a==='sclaim')claimStory(p1);else if(a==='cclaim')claimCtx(p1);
  else if(a==='dgoal'){const g=DGOAL[+p1];const [x,y]=g.p(+p1);if(x>=y&&!S.dgoal[p1]){S.dgoal[p1]=1;S.gems+=20;dirty=true;showBanner('Meta concluída!',DIST[p1].n);screenConfetti(60);sfx('unlock');renderSheet(true);}}
  else if(a==='road'){const d=+p1;const i=ROADS.findIndex(r=>r.id===(S.road[d]||'asfalto'));const n=ROADS[i+1];if(n&&spend(n.cost)){S.road[d]=n.id;groundDirty=true;dirty=true;sfx('up');toast('Ruas de '+DIST[d].n+': '+n.n,'g');updateDev();renderSheet(true);}else sfx('err');}
  else if(a==='repair'){const d=+p1;if(spend(cost(30))){delete S.dmg[d];dirty=true;sfx('up');toast('Bairro consertado!','g');renderSheet(true);}else{sfx('err');toast('Moedas insuficientes','r');}}
  else if(a==='eq'){const c=COS.find(x=>x.id===p1);if(S.cos.eq[c.slot]===c.id)delete S.cos.eq[c.slot];else S.cos.eq[c.slot]=c.id;sfx('click');delete thumbs.pref;renderSheet(true);}
  else if(a==='g'){const costs={boost:20,rush:15,chest:30,rp:25,cry:40};const c=costs[p1];if(S.gems<c){sfx('err');toast('Joias insuficientes','r');return;}
    if(p1==='rush'&&ev)return;S.gems-=c;if(p1==='boost'){S.gemBoost=Math.max(Date.now(),S.gemBoost)+15*60000;dirty=true;toast('Turbo 2× ativado!','p');sfx('up');}else if(p1==='rush')startEvent('rush');else if(p1==='rp'){S.rp+=Math.max(30,C.rp*300);toast('Pesquisa extra!','p');sfx('research');}else if(p1==='cry'){S.crys+=1;toast('+1 Cristal','p');sfx('chest');}else grantChest('gem');renderSheet(true);}
  else if(a==='prestige'){if(!presArm){presArm=true;sfx('click');renderSheet(true);setTimeout(()=>{presArm=false;if(sheetMode==='prestige')renderSheet(true);},4000);return;}presArm=false;doPrestige();}
  else if(a==='tsel'){selTech=p1;sfx('click');renderSheet(true);}
  else if(a==='tech')research(p1);
  else if(a==='stage')startStage(p1);
  else if(a==='openprj')openSheet('projects');
  else if(a==='mode'){sfx('click');openSheet(p1);}
  else if(a==='stats'){sfx('click');openStats();}
  else if(a==='heat'){heatMode=p1;sfx('click');closeSheet();renderHeatChip();}
  save();});
function refreshButtons(){document.querySelectorAll('#body [data-cost]').forEach(b=>{b.classList.toggle('off',S.coins<+b.dataset.cost);});
  document.querySelectorAll('#body [data-gcost]').forEach(b=>{b.classList.toggle('off',S.gems<+b.dataset.gcost);});
  document.querySelectorAll('#body [data-rp]').forEach(b=>{b.classList.toggle('off',S.rp<+b.dataset.rp);});}
const HEATN={happy:['Felicidade','linear-gradient(90deg,#ff5d6c,#ffd23f,#2fd08a)'],traffic:['Trânsito','linear-gradient(90deg,#2fd08a,#ffd23f,#ff5d6c)'],service:['Serviços','linear-gradient(90deg,#efe9ff,#8e5cff)'],
  econ:['Economia','linear-gradient(90deg,#fff3c4,#ffb703,#d96b00)'],power:['Energia','linear-gradient(90deg,#ff5d6c,#2fd08a,#ffd23f)'],syn:['Sinergias','linear-gradient(90deg,#ff5d6c,#fff,#2fd08a)']};
function renderHeatChip(){const c=$('#heatChip');if(!heatMode){c.hidden=true;return;}c.hidden=false;c.innerHTML=`Mapa: ${HEATN[heatMode][0]}<span class="lg" style="background:${HEATN[heatMode][1]}"></span><button aria-label="Fechar mapa">✕</button>`;c.querySelector('button').onclick=()=>{heatMode=null;renderHeatChip();sfx('click');};}
document.querySelectorAll('#nav button').forEach(b=>b.addEventListener('click',()=>{audioInit();sfx('click');const m=b.dataset.nav;if(sheetMode===m){closeSheet();return;}if(m==='build')targetPlot=null;openSheet(m);}));
$('#sheetClose').addEventListener('click',()=>{sfx('click');closeSheet();targetPlot=null;});
$('#homeBtn').addEventListener('click',()=>{audioInit();sfx('click');goHome();});
$('#zIn').addEventListener('click',()=>{cam.tz=clamp((cam.tz||cam.z)*1.2,.4,2.4);sfx('click');});
$('#zOut').addEventListener('click',()=>{cam.tz=clamp((cam.tz||cam.z)/1.2,.4,2.4);sfx('click');});
$('#chestBtn').addEventListener('click',()=>{audioInit();if(S.chestT<=0){S.chestT=240;grantChest('free');}else{sfx('click');toast('Baú grátis em '+fmtTime(S.chestT));}});
function updateDots(){let n=0;if(guideClaimable())n++;if(S.daily){for(const m of S.daily.list)if(m.done&&!m.claimed)n++;if(S.daily.list.every(m=>m.claimed)&&!S.daily.bonus)n++;}for(const a of ACH)if(S.ach[a.id]==='done')n++;
  for(const m of METAS)if(!S.metas[m.id]){const [a,b]=m.p();if(a>=b)n++;}for(const ch in CHARS){if(charUnlocked(ch)&&stepDone(stepOf(ch)))n++;if(S.ctx[ch]&&S.ctx[ch].done)n++;}
  setDot('#nb-missions',n);let t=0;for(const x of TECH)if(!tk(x.id)&&x.req.every(r=>tk(r))&&S.rp>=x.cost&&(!x.cry||S.crys>=x.cry))t++;setDot('#nb-research',t);
  setDot('#nb-more',essGain()>=1?'!':0,'#8e5cff');}
function setDot(sel,n,col){const b=$(sel);let d=b.querySelector('.dot');if(n){if(!d){d=document.createElement('i');d.className='dot';b.appendChild(d);}d.textContent=n;if(col)d.style.background=col;}else if(d)d.remove();}

/* ---------- modais ---------- */
function openModal(html){$('#mcard').innerHTML=html;$('#modal').hidden=false;}
function closeModal(){$('#modal').hidden=true;}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'){clearInterval(openSlot._t);closeModal();return;}const b=e.target.closest('[data-m]');if(!b)return;audioInit();const k=b.dataset.m;
  if(k==='close'){sfx('click');clearInterval(openSlot._t);closeModal();}
  else if(k==='evc')chooseEv(+b.dataset.i);
  else if(k==='sw'){const key=b.dataset.k;S.set[key]=!S.set[key];b.classList.toggle('on',S.set[key]);applyVol();sfx('click');save();}
  else if(k==='copy'){const ta=$('#saveTa');const txt=ta.value;if(NATIVE){native('copy:'+txt);toast('Copiado!','g');return;}try{navigator.clipboard.writeText(txt).then(()=>toast('Copiado!','g'),()=>{ta.select();toast('Selecione e copie manualmente');});}catch(err){ta.select();}}
  else if(k==='import'){const ta=$('#impTa');try{const o=JSON.parse(decodeURIComponent(escape(atob(ta.value.trim()))));if(!validState(o))throw 0;
      if(b.dataset.arm!=='1'){b.dataset.arm='1';b.textContent='Toque de novo para carregar';return;}S=sanitize(o);afterLoad();closeModal();toast('Progresso carregado!','g');}catch(err){toast('Código inválido. Cole o código completo exportado.','r');}}
  else if(k==='backup'){try{const o=JSON.parse(localStorage.getItem(BACK_KEY));if(!validState(o))throw 0;if(b.dataset.arm!=='1'){b.dataset.arm='1';b.textContent='Toque de novo para restaurar';return;}S=sanitize(o);afterLoad();closeModal();toast('Backup restaurado','g');}catch(err){toast('Nenhum backup disponível','r');}}
  else if(k==='reset'){if(b.dataset.arm!=='1'){b.dataset.arm='1';b.textContent='Tem certeza? Toque de novo';return;}try{localStorage.removeItem(SAVE_KEY);}catch(err){}S=newState();initCity(S);afterLoad();closeModal();toast('Jogo reiniciado');S.tut=0;tutRender();}});
function showLoot(title,L){const ic={coin:'<i class="ico coin" style="width:22px;height:22px"></i>',gem:'<i class="ico gem" style="width:14px;height:14px"></i>',rp:ICO.rp.replace('<svg','<svg width="22" height="22"'),cry:ICO.cry.replace('<svg','<svg width="22" height="22"')};
  openModal(`<h2>${title}</h2><div class="loot">${L.map(([k,t,r],i)=>`<div style="animation-delay:${i*.12}s">${ic[k]||''}<span class="${r?'rar-'+r:''}">${t}</span></div>`).join('')}</div><button class="btn big" data-m="close">Oba!</button>`);}
function openStats(){const p=pref();recalc();openModal(`<h2>Estatísticas</h2>
  <div class="kv"><span>Renda líquida por segundo</span><b>${fmt(ips)}</b></div><div class="kv"><span>Manutenção por segundo</span><b>${fmt(C.up)}</b></div>
  <div class="kv"><span>Moedas neste ciclo</span><b>${fmt(S.run)}</b></div><div class="kv"><span>Moedas na vida toda</span><b>${fmt(S.life)}</b></div>
  <div class="kv"><span>População</span><b>${fmt(S.pop)} (${RANKS[cityRank()][1]})</b></div><div class="kv"><span>Prédios e decorações</span><b>${nonPref()} + ${S.cnt.deco}</b></div>
  <div class="kv"><span>Modelos diferentes construídos</span><b>${Object.keys(S.seenT).length}/${Object.keys(TYPES).length-2}</b></div>
  <div class="kv"><span>Maior nível</span><b>${S.maxLv}</b></div><div class="kv"><span>Bairros</span><b>${S.unlocked.length} (${completedCount()} completos)</b></div>
  <div class="kv"><span>Pesquisas</span><b>${Object.keys(S.tech).length}/${TECH.length}</b></div><div class="kv"><span>Projetos concluídos</span><b>${S.cnt.prjDone}</b></div>
  <div class="kv"><span>Bônus Prefeitura (nv ${p.lvl})</span><b>+${(p.lvl-1)*5}%</b></div><div class="kv"><span>Bônus Essência</span><b>+${S.ess*5}%</b></div>
  <div class="kv"><span>Felicidade (renda)</span><b>×${(.7+.6*S.happy/100).toFixed(2)}</b></div><div class="kv"><span>Bônus da sessão</span><b>+${Math.round(sessionBonus()*100)}%</b></div>
  <div class="kv"><span>Multiplicador global</span><b>×${C.gm.toFixed(2)}</b></div><div class="kv"><span>Bolhas · meteoros · baús</span><b>${S.cnt.bub} · ${S.cnt.met} · ${S.cnt.chest}</b></div>
  <div class="kv"><span>Renascimentos</span><b>${S.cnt.pres}</b></div><div class="kv"><span>Tempo jogado</span><b>${fmtTime(S.played)}</b></div>
  <button class="btn big" data-m="close">Fechar</button>`);}
function openSettings(){
  openModal(`<h2>Configurações</h2>
  <div class="toggle">Música<button class="sw ${S.set.music?'on':''}" data-m="sw" data-k="music" aria-label="Música"></button></div>
  <div class="toggle">Efeitos sonoros<button class="sw ${S.set.sfx?'on':''}" data-m="sw" data-k="sfx" aria-label="Efeitos"></button></div>
  <div class="toggle">Vibração<button class="sw ${S.set.vib?'on':''}" data-m="sw" data-k="vib" aria-label="Vibração"></button></div>
  <div class="toggle">Indicadores sobre os prédios<button class="sw ${S.set.ind?'on':''}" data-m="sw" data-k="ind" aria-label="Indicadores"></button></div>
  <div class="kv"><span>Renda offline</span><b>${Math.round(offRate()*100)}% · até ${offCap()/3600}h</b></div>
  <div class="sec">Salvar progresso</div><p class="note">O jogo salva sozinho a cada 10 segundos neste aparelho. Copie o código abaixo para guardar ou levar para outro aparelho.</p>
  <textarea id="saveTa" readonly placeholder="Gerando código…"></textarea><button class="btn b" data-m="copy">Copiar código</button>
  <div class="sec">Carregar progresso</div><textarea id="impTa" placeholder="Cole aqui um código exportado"></textarea><button class="btn" data-m="import">Carregar código</button>
  <button class="btn y" data-m="backup">Restaurar backup automático</button><button class="btn r" data-m="reset">Apagar tudo e recomeçar</button>
  <p class="note" style="text-align:center">Atalhos: WASD/setas movem, +/− zoom, H prefeitura, B construir, U melhorar, C cidade, P pesquisa.</p>
  <button class="btn big" data-m="close">Fechar</button>`);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    try{const code=btoa(unescape(encodeURIComponent(serializeState())));const ta=$('#saveTa');if(ta)ta.value=code;}catch(e){}
  }));}
$('#btnStats').addEventListener('click',()=>{audioInit();sfx('click');openStats();});
$('#btnSettings').addEventListener('click',()=>{audioInit();sfx('click');openSettings();});
$('#carBtn').addEventListener('click',()=>{audioInit();if(!adCar)return;const [wx,wy]=[adCar.x,adCar.y];cam.tx=wx;cam.ty=wy-20;cam.tz=1.3;sfx('click');requestAd('car');});
$('#wheelBtn').addEventListener('click',()=>{audioInit();sfx('click');openWheel();});
$('#rankBtn').addEventListener('click',()=>{audioInit();sfx('click');openSheet('missions','rank');});
$('#slotBtn').addEventListener('click',()=>{audioInit();sfx('click');openSlot();});
function openWheel(){const ready=wheelReady();
  openModal(`<h2>Baú misterioso diário</h2>
  <p class="note" style="text-align:center">${ready?'Escolha um dos 3 baús. Um prêmio surpresa te espera!':'Você já abriu hoje. Volte amanhã para um novo prêmio!'}</p>
  <div id="wheelRow" style="display:flex;gap:10px;justify-content:center;margin:14px 0">
    ${[0,1,2].map(i=>`<button class="wbox" data-wi="${i}" ${ready?'':'disabled'} style="flex:1;max-width:100px;aspect-ratio:1;border-radius:16px;border:2px solid #fff;background:linear-gradient(180deg,#ffe27a,#ffb703);box-shadow:0 4px 0 #b97a00;font-size:34px;cursor:${ready?'pointer':'default'};opacity:${ready?1:.5}">🎁</button>`).join('')}
  </div>
  <div id="wheelResult" style="text-align:center;min-height:50px"></div>
  <button class="btn big" data-m="close">Fechar</button>`);
  if(!ready)return;
  document.querySelectorAll('#wheelRow .wbox').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('#wheelRow .wbox').forEach(b=>b.disabled=true);
      const res=claimWheel(+btn.dataset.wi);if(!res)return;
      btn.textContent='✨';btn.style.transform='scale(1.15)';
      const parts=[];if(res.r.coins)parts.push('+'+fmt(res.r.coins)+' moedas');if(res.r.gems)parts.push('+'+res.r.gems+' joias');if(res.r.crys)parts.push('+'+res.r.crys+' Cristal');if(res.r.boostMin)parts.push('Turbo 2× por '+res.r.boostMin+' min');
      $('#wheelResult').innerHTML=`<b style="font-size:16px;color:var(--mint-d)">${res.p.n}</b><br><span class="note">${parts.join(' · ')}</span>`;
      screenConfetti(100);sfx('unlock');vib([20,30,20]);
    });
  });}
const SLOT_ICON={
  c1:{ring:'#f6c343',svg:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="25" fill="#f6c343" stroke="#8a5a00" stroke-width="3"/><circle cx="32" cy="32" r="17" fill="none" stroke="#8a5a00" stroke-width="2.4" opacity=".55"/><text x="32" y="39" font-size="19" font-weight="900" text-anchor="middle" fill="#8a5a00" font-family="Arial,sans-serif">$</text></svg>'},
  c2:{ring:'#ffd65c',svg:'<svg viewBox="0 0 64 64"><circle cx="21" cy="39" r="14" fill="#e8ab1f" stroke="#7a4e00" stroke-width="2.4"/><circle cx="36" cy="33" r="14" fill="#f6c343" stroke="#7a4e00" stroke-width="2.4"/><circle cx="30" cy="20" r="14" fill="#ffe9ac" stroke="#7a4e00" stroke-width="2.4"/></svg>'},
  c3:{ring:'#ffd65c',svg:'<svg viewBox="0 0 64 64"><path d="M19 9h26v5a13 13 0 01-26 0V9z" fill="#ffd65c" stroke="#7a4e00" stroke-width="2.6"/><path d="M19 12c-7-1-9 9 1 13M45 12c7-1 9 9-1 13" fill="none" stroke="#7a4e00" stroke-width="2.6" stroke-linecap="round"/><rect x="28" y="27" width="8" height="12" fill="#ffd65c" stroke="#7a4e00" stroke-width="2.4"/><rect x="18" y="43" width="28" height="7" rx="2.5" fill="#ffd65c" stroke="#7a4e00" stroke-width="2.4"/></svg>'},
  gem:{ring:'#5fe0ff',svg:'<svg viewBox="0 0 64 64"><polygon points="32,9 49,24 40,55 24,55 15,24" fill="#5fe0ff" stroke="#0b6a8c" stroke-width="2.6"/><polygon points="32,9 49,24 32,31 15,24" fill="#c7f4ff" stroke="#0b6a8c" stroke-width="1.6"/></svg>'},
  turbo:{ring:'#ffe169',svg:'<svg viewBox="0 0 64 64"><polygon points="35,5 15,36 28,36 21,59 50,27 36,27" fill="#ffe169" stroke="#8a6a00" stroke-width="2.6" stroke-linejoin="round"/></svg>'},
  crys:{ring:'#c9a6ff',svg:'<svg viewBox="0 0 64 64"><polygon points="32,6 51,21 44,55 20,55 13,21" fill="#c9a6ff" stroke="#5a2fb0" stroke-width="2.6" stroke-linejoin="round"/><line x1="32" y1="6" x2="32" y2="55" stroke="#5a2fb0" stroke-width="1.6" opacity=".55"/></svg>'},
  star:{ring:'#fff6cf',svg:'<svg viewBox="0 0 64 64"><polygon points="32,5 39,24 60,24 43,36 49,57 32,45 15,57 21,36 4,24 25,24" fill="#fff6cf" stroke="#b8860b" stroke-width="2.6" stroke-linejoin="round"/></svg>'},
};
function schip(symId){const s=SLOT_ICON[symId]||SLOT_ICON.c1;return `<div class="schip" style="border:3px solid ${s.ring};box-shadow:0 0 9px ${s.ring}66,inset 0 2px 4px rgba(255,255,255,.08)">${s.svg}</div>`;}
function slotRow(){const n=S.spins,cap=spinCap();
  let timeTxt='';if(n<cap&&S.spinNext)timeTxt=' · próximo giro em '+fmtTime(Math.max(0,(S.spinNext-Date.now())/1000));
  return `<div id="slotCount" class="note" style="text-align:center">Giros: <b>${n}/${cap}</b>${timeTxt}</div>`;}
function buildReelStrip(finalId){const n=10,ids=[];for(let i=0;i<n;i++)ids.push(SLOT_SYMS[Math.floor(Math.random()*SLOT_SYMS.length)].id);ids.push(finalId);return ids;}
function animateReel(stripEl,finalId,delay){return new Promise(res=>{
  const cellH=84,ids=buildReelStrip(finalId);
  stripEl.innerHTML=ids.map(id=>`<div style="height:${cellH}px;display:flex;align-items:center;justify-content:center">${schip(id)}</div>`).join('');
  stripEl.style.transition='none';stripEl.style.transform='translateY(0px)';
  void stripEl.offsetHeight;
  const targetY=-(ids.length-1)*cellH;
  setTimeout(()=>{stripEl.style.transition='transform 900ms cubic-bezier(.15,.68,.28,1.05)';stripEl.style.transform='translateY('+targetY+'px)';sfx('click');},delay);
  setTimeout(res,delay+940);});}
function openSlot(){
  openModal(`<div id="slotCab" class="slot-cab">
  <div class="marquee">${Array(9).fill('<i></i>').join('')}</div>
  <h2>CAÇA-MOEDAS</h2>
  <p class="note" style="text-align:center;margin-top:0">Gaste 1 giro e combine 3 símbolos iguais pra um prêmio x4. Os giros recarregam sozinhos.</p>
  <div id="slotReels" style="display:flex;gap:10px;justify-content:center;margin:14px 0">
    ${[0,1,2].map(()=>`<div class="reelWin"><div class="reelStrip">${`<div style="height:84px;display:flex;align-items:center;justify-content:center">${schip('c1')}</div>`}</div><div class="shine"></div></div>`).join('')}
  </div>
  <div id="slotResult" style="text-align:center;min-height:30px"></div>
  <div id="slotCountWrap">${slotRow()}</div>
  <button class="btn big slot-go" id="slotGo" ${S.spins<=0?'disabled':''}>GIRAR (1 giro)</button>
  <button class="btn slot-buy" id="slotBuy" style="margin-top:8px" ${S.spins>=spinCap()?'disabled':''}>Giro extra · 💎10</button>
  </div>
  <button class="btn big" data-m="close">Fechar</button>`);
  let spinning=false;
  clearInterval(openSlot._t);
  openSlot._t=setInterval(()=>{const wrap=$('#slotCountWrap');if(!wrap||$('#modal').hidden){clearInterval(openSlot._t);return;}wrap.innerHTML=slotRow();
    const go=$('#slotGo'),buy=$('#slotBuy');if(go&&!spinning)go.disabled=S.spins<=0;if(buy)buy.disabled=S.spins>=spinCap();},1000);
  $('#slotGo').addEventListener('click',async()=>{
    if(spinning||S.spins<=0)return;spinning=true;$('#slotGo').disabled=true;$('#slotResult').innerHTML='';
    const res=doSpin();if(!res){spinning=false;$('#slotGo').disabled=S.spins<=0;return;}
    const strips=document.querySelectorAll('#slotReels .reelStrip');
    sfx('click');
    await Promise.all([animateReel(strips[0],res.reels[0].id,0),animateReel(strips[1],res.reels[1].id,180),animateReel(strips[2],res.reels[2].id,360)]);
    spinning=false;
    const parts=[];if(res.coins)parts.push('+'+fmt(res.coins)+' moedas');if(res.gems)parts.push('+'+res.gems+' joias');if(res.crys)parts.push('+'+res.crys+' Cristal');if(res.turboMin)parts.push('Turbo 2× por '+Math.round(res.turboMin)+' min');
      $('#slotResult').innerHTML=res.combo?`<b style="font-size:17px;color:#ffd65c;text-shadow:0 0 10px rgba(255,214,92,.6)">★ COMBO x4 ★</b><br><span class="note">${parts.join(' · ')}</span>`:`<span class="note">${parts.join(' · ')}</span>`;
    const wrap=$('#slotCountWrap');if(wrap)wrap.innerHTML=slotRow();
    $('#slotGo').disabled=S.spins<=0;
    const cab=$('#slotCab');if(res.combo&&cab){cab.classList.add('winGlow');setTimeout(()=>cab.classList.remove('winGlow'),1500);}
    screenConfetti(res.combo?120:35);sfx(res.combo?'unlock':'coin');vib(res.combo?[20,30,20,30,20]:[15]);
  });
  $('#slotBuy').addEventListener('click',()=>{if(buySpin()){sfx('up');const wrap=$('#slotCountWrap');if(wrap)wrap.innerHTML=slotRow();$('#slotGo').disabled=S.spins<=0;$('#slotBuy').disabled=S.spins>=spinCap();}else{sfx('err');toast('Joias insuficientes ou giros no máximo','r');}});
}
function showBanner(title,small){$('#banner').innerHTML=`<div class="in"><small>${small}</small><h1>${title}</h1></div>`;clearTimeout(showBanner.t);showBanner.t=setTimeout(()=>$('#banner').innerHTML='',3300);}
function newComplex(cp,d){showBanner(cp.n,'Complexo formado em '+DIST[d].n);screenConfetti(90);sfx('unlock');const gx=d%GXN,gy=Math.floor(d/GXN);const [wx,wy]=proj(gx*DS+3.5,gy*DS+3.5);burst(wx,wy-20,40);toast(cp.fx,'p');}
function v2Intro(){openModal(`<div class="speaker">${portrait('lucia','talk')}<div><small style="color:${CHARS.lucia.col}">Prefeita Lúcia</small><h2 style="text-align:left;font-size:22px">A cidade ganhou vida!</h2></div></div>
  <p style="text-align:left">Agora cada prédio tem uma função. Casas trazem moradores, lojas precisam de clientes e mercadorias, fábricas precisam de energia e funcionários, e tudo depende da felicidade.</p>
  <div class="why"><div class="up"><i></i>Vizinhos importam: verde perto de casas, casas perto de lojas</div><div class="up"><i></i>Pesquisa com 36 tecnologias</div><div class="up"><i></i>Projetos gigantes, eventos com escolhas e 6 personagens</div><div class="up"><i></i>Mais de 80 construções em 11 categorias</div></div>
  <p class="note" style="text-align:center">A faixa no topo mostra população, felicidade, energia e pesquisa. Toque nela para abrir a gestão da cidade.</p><button class="btn big" data-m="close">Vamos lá!</button>`);S.seen2=true;save();}

/* ---------- tutorial ---------- */
const TUT=[
  ['Bem-vinda, prefeitura nova!','Sua vila já está produzindo moedas. Toque na <b style="color:#d98a00">moeda brilhante</b> sobre a casinha para coletar.'],
  ['Hora de construir','Toque em <b>Construir</b> lá embaixo e compre uma Cafeteria ou Padaria. Perto de casas, ela vende mais!'],
  ['Melhore seus prédios','Toque em qualquer prédio da cidade e aperte <b>+1</b> para subir de nível. O painel explica tudo que afeta a renda dele.'],
  ['Você pegou o jeito!','Moradores, empregos, energia e felicidade agora movem a cidade. Olhe a faixa no topo, siga os pedidos dos personagens e combine prédios vizinhos.'],
];
function tutRender(){const c=$('#coach');document.querySelectorAll('.hl').forEach(e=>e.classList.remove('hl'));
  if(S.tut>=4){if(!sayCur)c.hidden=true;return;}
  if(sheetMode&&S.tut!==1){c.hidden=true;return;}
  if(S.tut===1&&sheetMode==='build'){c.hidden=true;return;}
  const [t,m]=TUT[S.tut];c.hidden=false;c.innerHTML=portrait('lucia')+`<div class="bub"><small style="color:${CHARS.lucia.col}">Prefeita Lúcia</small><b class="t">${t}</b>${m}<div class="row2">${S.tut===3?'<button class="btn" id="tutOk">Vamos lá! +10 joias</button>':'<button class="skip" id="tutSkip">Pular tutorial</button>'}</div></div>`;
  if(S.tut===1)$('#nb-build').classList.add('hl');
  if(S.tut===0){const h=S.buildings.find(b=>b.t==='casa');if(h)h.bub=Math.max(h.bub||0,20);}
  const ok=$('#tutOk');if(ok)ok.onclick=()=>{S.tut=4;S.gems+=10;sfx('chest');toast('+10 joias','p');c.hidden=true;save();setTimeout(()=>{say('lucia','Criei um Guia com os primeiros passos pra você não se perder. Dá uma olhada!',8,['Ver guia',()=>openSheet('missions','guide')]);},800);};
  const sk=$('#tutSkip');if(sk)sk.onclick=()=>{S.tut=4;c.hidden=true;save();openSheet('missions','guide');};}
