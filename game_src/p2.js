/* =====================================================================
   UTIL
   ===================================================================== */
const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-t,3);
function hash(n){let x=Math.imul((n|0)^0x9e3779b9,2654435761)>>>0;x^=x>>>15;x=Math.imul(x,2246822519)>>>0;x^=x>>>13;return x>>>0;}
const SUF=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','UDc','DDc','TDc','QaDc','QiDc'];
function fmt(n){
  if(!isFinite(n)) return '∞';
  const neg=n<0; if(neg) n=-n;
  let r;
  if(n<1000){ r=(n<10&&n%1>0.05)?n.toFixed(1):String(Math.floor(n)); }
  else{ const i=Math.floor(Math.log10(n)/3);
    if(i>=SUF.length) r=n.toExponential(2).replace('+','');
    else{ const v=n/Math.pow(1000,i); r=(v<10?v.toFixed(2):v<100?v.toFixed(1):String(Math.floor(v)))+SUF[i]; } }
  return (neg?'−':'')+r;
}
function pct(v){return Math.round(v*100)+'%';}
function sgn(v){return (v>=0?'+':'−')+Math.round(Math.abs(v)*100)+'%';}
function fmtTime(s){s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),ss=s%60;
  if(h) return h+'h '+String(m).padStart(2,'0')+'min'; if(m) return m+':'+String(ss).padStart(2,'0'); return ss+'s';}
function today(){const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
const SC=new Map();
function hexRGB(h){const n=parseInt(h.slice(1),16);return [n>>16&255,n>>8&255,n&255];}
function rgbHex(r,g,b){return '#'+((1<<24)|(Math.round(clamp(r,0,255))<<16)|(Math.round(clamp(g,0,255))<<8)|Math.round(clamp(b,0,255))).toString(16).slice(1);}
function shade(h,p){if(typeof h!=='string'||h[0]!=='#')return h;const k=h+'|'+p;let r=SC.get(k);if(r)return r;let [R,G,B]=hexRGB(h);
  if(p>0){R+=(255-R)*p;G+=(255-G)*p;B+=(255-B)*p;}else{R*=1+p;G*=1+p;B*=1+p;}r=rgbHex(R,G,B);SC.set(k,r);return r;}
function mix(a,b,t){const A=hexRGB(a),B=hexRGB(b);return rgbHex(lerp(A[0],B[0],t),lerp(A[1],B[1],t),lerp(A[2],B[2],t));}
function ramp(stops){const cache=new Map();return h=>{let r=cache.get(h);if(r)return r;const [R,G,B]=hexRGB(h);const l=(0.3*R+0.59*G+0.11*B)/255;
  r=l<0.5?mix(stops[0],stops[1],l/0.5):mix(stops[1],stops[2],(l-0.5)/0.5);cache.set(h,r);return r;};}
const gold=ramp(['#8a5200','#ffbf1f','#fff6c4']);
const SKINS={
  doces:{n:'Doces',r:ramp(['#b8467a','#ff9ccf','#fff3fa']),acc:'#ff5fa2'},
  brinq:{n:'Brinquedo',r:ramp(['#1d4fb8','#ff4d4d','#ffe14d']),acc:'#ffd23f'},
  neon:{n:'Neon',r:ramp(['#120d2a','#3b2a7a','#ff4fd8']),acc:'#ff4fd8'},
  fant:{n:'Fantasia',r:ramp(['#3a1f6b','#9b7bff','#e2fff7']),acc:'#c9a8ff'},
  scifi:{n:'Ficção científica',r:ramp(['#232b3a','#9fb1c9','#eafcff']),acc:'#4cf0ff'},
};

/* =====================================================================
   MUNDO
   ===================================================================== */
const HW=32,HH=16,DS=6,GXN=4,GYN=3,WT=GXN*DS+1,HT=GYN*DS+1;
const DEV=[['Abandonado','#9a8f86',0.85],['Emergente','#7fbf6a',1],['Desenvolvido','#2fd08a',1.1],['Sofisticado','#38b6ff',1.25],['Extraordinário','#ffb703',1.5]];
const DIST=[
 {n:'Centro Histórico',cost:0,pref:1,g:'#8fd65a',deco:'round',acc:'#ff8fab',mech:'Patrimônio: monumentos e decorações dão turismo em dobro aqui.',ex:'Torre do Relógio e Museu',ch:'lucia'},
 {n:'Centro Comercial',cost:3000,pref:3,g:'#a7dd72',deco:'lamp',acc:'#ffb703',mech:'Movimento: comércios rendem +30% aqui.',ex:'Mercado de Rua e Cinema',ch:'bento'},
 {n:'Distrito Industrial',cost:60000,pref:5,g:'#bcc584',deco:'pine',acc:'#fb8500',mech:'Produção: fábricas fazem 50% mais mercadorias e a fumaça daqui incomoda menos.',ex:'Refinaria e Mineradora',ch:'zeca'},
 {n:'Bairro Nobre',cost:1.5e6,pref:8,g:'#7fd39a',deco:'cypress',acc:'#e9c46a',mech:'Alto padrão: moradores pagam o dobro de impostos se a felicidade passar de 70%.',ex:'Mansão',ch:'iris'},
 {n:'Distrito do Entretenimento',cost:4e7,pref:11,g:'#4b3f86',deco:'neon',acc:'#ff4fd8',mech:'Vida noturna: entretenimento rende 2× durante a noite.',ex:'Arena Holográfica',ch:'tuca'},
 {n:'Polo Tecnológico',cost:1.2e9,pref:14,g:'#8fd8d8',deco:'crystal',acc:'#00b4d8',mech:'Universitário: toda pesquisa feita aqui vale 2×.',ex:'Robótica e Laboratório de IA',ch:'faisca'},
 {n:'Região Litorânea',cost:4e10,pref:17,g:'#f4d98e',deco:'palm',acc:'#06d6a0',mech:'Praia: turismo +50% aqui.',ex:'Praia, Parque Aquático e Resort',ch:'tuca'},
 {n:'Distrito Financeiro',cost:1.5e12,pref:20,g:'#aab8ea',deco:'holo',acc:'#4cc9f0',mech:'Aglomeração: cada prédio aqui rende +2% para os vizinhos de bairro (até +50%).',ex:'Bolsa de Valores',ch:'bento'},
 {n:'Cidade nas Nuvens',cost:6e13,pref:24,g:'#eef3ff',deco:'cloud',acc:'#a0c4ff',mech:'Céu aberto: sem trânsito e a energia gerada aqui vale 2×.',ex:'Ilha Flutuante e Complexo Futurista',ch:'zeca'},
 {n:'Capital Cósmica',cost:2.5e15,pref:28,g:'#30286a',deco:'star',acc:'#ffd166',mech:'Maravilhas: construções lendárias rendem +50% aqui.',ex:'Cidade Suspensa e Portal Cósmico',ch:'faisca'},
 {n:'Reino da Essência',cost:1e9,pref:10,ess:25,g:'#cbb0ff',deco:'crystal',acc:'#b388ff',mech:'Região secreta do prestígio. Monumentos 2× aqui.',ex:'Monumento da Essência',ch:'iris'},
];
const RANKS=[[0,'Vila'],[100,'Vilarejo'],[600,'Cidade'],[3000,'Cidade Grande'],[15000,'Metrópole'],[80000,'Megalópole'],[500000,'Capital Cósmica']];
const RANK_UNLOCK=['Casas, comércio, natureza e decoração','Indústria, energia, escolas e pesquisa','Serviços, hospitais e entretenimento','Turismo, tecnologia e projetos municipais','Extravagâncias e monumentos','Construções lendárias','Arquitetura impossível'];

/* =====================================================================
   CATÁLOGO DE CONSTRUÇÕES
   f: pop moradores · jobs empregos · pw energia (+gera / −consome) · goods mercadorias/s · gd demanda de mercadorias
      cust clientes atendidos · happy felicidade · tour turismo · edu educação · health saúde · safe segurança
      trans capacidade de transporte · rp pesquisa/s · pol poluição · hotel quartos · logi logística · green verde · up manutenção/s
   ===================================================================== */
const CATS={res:'Residencial',com:'Comércio',ent:'Entretenimento',ind:'Indústria',pub:'Serviços',nat:'Natureza',tech:'Tecnologia',extra:'Extravagantes',mon:'Monumentos',leg:'Lendárias',deco:'Decoração'};
const CAT_ORDER=['res','com','ind','pub','nat','deco','ent','tech','extra','mon','leg'];
const RAR=['comum','incomum','raro','épico','lendário'];
const TYPES={};
function T(k,n,cat,cost,inc,d,home,rk,rar,f,draw,desc,x){TYPES[k]=Object.assign({k,n,cat,cost,inc,d,home,rk,rar,f,draw,desc},x||{});}
// Residencial
T('casa','Casinha Suburbana','res',15,.4,0,0,0,'comum',{pop:5},dCasa,'Cresce com os níveis: vira sobrado e depois casa grande.');
T('sobrado','Sobrado Geminado','res',120,1.6,0,0,0,'comum',{pop:14},dSobrado,'Duas famílias, um muro só.');
T('apto','Prédio de Apartamentos','res',260,3,0,0,0,'comum',{pop:30,pw:-1},dApto,'Vizinhos barulhentos, aluguel em dia.');
T('popular','Conjunto Popular','res',1800,14,1,0,1,'incomum',{pop:90,pw:-2},dPopular,'Muita gente, varal colorido.',{req:'arq1'});
T('condo','Condomínio Luxuoso','res',4500,32,2,3,2,'incomum',{pop:70,pw:-3,happy:1},dCondo,'Cúpula dourada e piscina no terraço.');
T('mansao','Mansão com Piscina','res',30000,160,3,3,2,'raro',{pop:20,pw:-2,happy:2},dMansao,'Pouca gente, muito imposto.',{req:'arq2'});
T('torre','Torre Residencial Futurista','res',95000,420,4,7,3,'raro',{pop:420,pw:-12},dTorre,'Elevadores a jato até o céu.');
T('arranha','Arranha-céu Habitacional','res',2.4e6,7000,5,7,4,'épico',{pop:2200,pw:-40},dArranha,'Uma cidade inteira em pé.',{req:'arq3'});
// Comércio
T('padaria','Padaria do Bairro','com',40,.8,0,1,0,'comum',{jobs:3,cust:25},dPadaria,'Pão quentinho às seis da manhã.',{tags:['food']});
T('cafe','Cafeteria','com',80,1.2,0,1,0,'comum',{jobs:4,cust:30},dCafe,'O cheirinho que acorda a cidade.',{tags:['food']});
T('lanche','Lanchonete','com',950,9,1,1,1,'comum',{jobs:6,cust:60,pw:-1},dLanche,'Hambúrguer gigante no telhado.',{tags:['food']});
T('pizzaria','Pizzaria Forno a Lenha','com',2200,19,1,1,1,'comum',{jobs:8,cust:80,pw:-1},dPizzaria,'Sexta-feira é dia de pizza.',{tags:['food']});
T('roupas','Loja de Roupas','com',5500,46,1,1,1,'incomum',{jobs:8,cust:90,gd:3,pw:-1},dRoupas,'Vitrine com manequins dançantes.');
T('feira','Mercado de Rua','com',3800,30,1,1,1,'incomum',{jobs:10,cust:140,gd:2,tour:3,happy:1},dFeira,'Barracas, frutas e pastel.',{only:1});
T('mercado','Supermercado','com',13000,92,1,1,1,'incomum',{jobs:20,cust:220,gd:6,pw:-3},dMercado,'Carrinhos cheios, caixas tilintando.');
T('restaurante','Restaurante Chique','com',9000,70,2,1,2,'incomum',{jobs:14,cust:120,pw:-2,tour:2},dRestaurante,'Terraço com luzinhas à noite.',{tags:['food']});
T('pousada','Pousada Aconchego','com',15000,100,2,6,2,'incomum',{jobs:8,hotel:80,pw:-2},dPousada,'Café da manhã incluso.');
T('cinema','Cinema Pipoca','com',60000,360,1,1,2,'raro',{jobs:18,cust:300,pw:-6,happy:3,tour:4},dCinema,'Sessão dupla todo sábado.',{only:1});
T('shopping','Shopping Center','com',210000,1050,3,3,3,'raro',{jobs:80,cust:1200,gd:30,pw:-15,tour:8},dShopping,'Escadas rolantes e liquidação eterna.');
T('brinq','Loja de Brinquedos','com',3.2e6,13500,4,4,3,'raro',{jobs:40,cust:800,gd:25,pw:-8,happy:2},dBrinq,'Bola gigante e cata-vento girando.');
T('bolsa','Bolsa de Valores','com',4e10,1.4e8,7,7,4,'épico',{jobs:600,pw:-80},dBolsa,'Touro dourado e números subindo.',{only:7});
// Entretenimento
T('fliper','Fliperama Neon','ent',7000,55,1,4,1,'comum',{jobs:6,happy:2,tour:2,pw:-2},dFliper,'Recorde da semana: 999.999.');
T('boliche','Boliche Strike','ent',26000,180,2,4,2,'incomum',{jobs:10,happy:3,tour:3,pw:-3},dBoliche,'Pino gigante no telhado.');
T('circo','Circo Mágico','ent',180000,1100,2,4,2,'incomum',{jobs:30,happy:6,tour:20},dCirco,'Lona listrada e palhaços.');
T('parque','Parque de Diversões','ent',420000,2700,2,6,3,'raro',{jobs:60,happy:8,tour:40,pw:-15},dParque,'Roda-gigante que nunca para.');
T('aquario','Aquário Gigante','ent',1.1e6,6500,3,6,3,'raro',{jobs:40,happy:5,tour:60,pw:-12},dAquario,'Peixinhos curiosos na vitrine.');
T('zoo','Zoológico Divertido','ent',2.5e6,12000,3,6,3,'raro',{jobs:50,happy:8,tour:70},dZoo,'Girafa, elefante e muita torcida.');
T('estadio','Estádio Gigante','ent',8.5e6,41000,4,4,3,'épico',{jobs:200,happy:10,tour:150,pw:-40},dEstadio,'Torcida animada, refletores acesos.');
T('arena','Arena Holográfica','ent',9e8,3.6e6,4,4,4,'épico',{jobs:400,happy:12,tour:300,pw:-90},dArena,'Shows em 3D flutuante.',{only:4});
T('aquatico','Parque Aquático','ent',2e9,7e6,6,6,4,'épico',{jobs:300,happy:14,tour:400,pw:-60},dAquatico,'Tobogãs em espiral.',{only:6});
T('cassino','Cassino Cartoon','ent',7.2e10,2.3e8,6,4,4,'épico',{jobs:800,happy:4,tour:900,pw:-150},dCassino,'Fichas de chocolate e dados gigantes.');
// Indústria e energia
T('moinho','Moinho de Vento','ind',300,0,0,2,0,'comum',{pw:12,jobs:1},dMoinho,'Energia limpa para começar a cidade.');
T('fabrica','Fábrica de Brinquedos','ind',2600,22,1,2,1,'comum',{jobs:15,goods:4,pw:-3,pol:3},dFabrica,'Produz mercadorias para as lojas.');
T('deposito','Depósito Expresso','ind',9000,50,1,2,1,'comum',{jobs:8,logi:20,pw:-1},dDeposito,'Leva mercadorias das fábricas às lojas.');
T('solar','Fazenda Solar','ind',40000,80,2,2,2,'incomum',{pw:70,jobs:4},dSolar,'Energia sem fumaça.',{req:'ene1'});
T('usina','Usina Termelétrica','ind',52000,330,2,2,2,'incomum',{jobs:25,pw:120,pol:8},dUsina,'Muita energia, um pouco de fumaça.');
T('refinaria','Refinaria de Geleia','ind',300000,2100,2,2,3,'incomum',{jobs:50,goods:60,pw:-20,pol:15},dRefinaria,'Tanques de geleia borbulhante.',{only:2});
T('distrib','Centro Logístico','ind',950000,4600,3,2,3,'raro',{jobs:60,logi:120,pw:-10,pol:2},dDistrib,'Caixas, caminhões e mais caixas.');
T('fazendav','Fazenda Vertical','ind',4e6,20000,3,5,3,'raro',{jobs:40,goods:120,pw:-25,happy:2},dFazendaV,'Alface no 40º andar.',{req:'ind3'});
T('mina','Mineradora de Cristal','ind',5e6,26000,2,2,3,'raro',{jobs:80,goods:80,pw:-30,pol:12},dMina,'Extrai Cristais raros devagarinho.',{only:2});
T('robos','Fábrica de Robôs','ind',8e7,330000,5,2,4,'épico',{jobs:120,goods:500,pw:-80,pol:6},dRobos,'Braço robótico que nunca cansa.',{req:'ind2'});
// Tecnologia
T('pesq','Centro de Pesquisa','tech',70000,300,2,5,2,'incomum',{jobs:25,rp:2,pw:-10},dPesq,'Antena parabólica e ideias novas.');
T('antena','Torre de Comunicação','tech',400000,1800,3,5,3,'incomum',{jobs:10,rp:1,trans:20,pw:-15},dAntena,'Trabalho remoto reduz o trânsito.',{req:'fut1'});
T('robotica','Empresa de Robótica','tech',1.2e7,50000,5,5,3,'raro',{jobs:100,rp:5,goods:30,pw:-30},dRobotica,'Um robô gigante na fachada.',{only:5});
T('lab','Laboratório Futurista','tech',2.6e7,92000,5,5,3,'raro',{jobs:80,rp:8,pw:-40},dLab,'Gosma verde brilhante (inofensiva).');
T('ia','Laboratório de IA','tech',1.5e9,5e6,5,5,4,'épico',{jobs:150,rp:30,pw:-120},dIA,'Um cérebro holográfico pensando.',{only:5,req:'fut2'});
T('complexo','Complexo Futurista','tech',3e11,9e8,8,8,5,'lendário',{jobs:2000,rp:80,pw:-300,pop:500},dComplexo,'Cúpulas ligadas por tubos de vidro.',{req:'fut3'});
// Serviços públicos
T('pref','Prefeitura','pub',60,1,0,-1,0,'raro',{jobs:5,pw:10,safe:2,rp:0.05},dPref,'+5% de renda na cidade inteira por nível.');
T('escola','Escola Primária','pub',1500,0,0,5,1,'comum',{jobs:8,edu:20,rp:0.15,up:1.5},dEscola,'Qualifica os trabalhadores e gera pesquisa.',{tags:['school']});
T('policia','Delegacia','pub',6000,0,1,0,1,'comum',{jobs:12,safe:40,up:4},dPolicia,'Segurança deixa todo mundo tranquilo.',{tags:['safety']});
T('bombeiros','Corpo de Bombeiros','pub',8000,0,1,0,1,'comum',{jobs:12,safe:40,up:5},dBombeiros,'Protege a cidade de tempestades e acidentes.',{tags:['safety']});
T('onibus','Terminal de Ônibus','pub',12000,40,1,1,1,'comum',{jobs:10,trans:60,pw:-1,up:3},dOnibus,'Desafoga o trânsito e leva clientes ao comércio.',{req:'tra1',tags:['transit']});
T('hospital','Hospital Sorriso','pub',20000,0,1,0,2,'incomum',{jobs:40,health:60,up:12,pw:-5},dHospital,'Saúde aumenta o bem-estar dos moradores.',{tags:['health']});
T('univ','Universidade','pub',120000,0,2,5,2,'raro',{jobs:60,edu:150,rp:2.5,up:60,tour:5},dUniv,'Muita pesquisa e trabalhadores qualificados.',{tags:['school']});
T('metro','Estação de Metrô','pub',600000,1500,3,1,3,'raro',{jobs:30,trans:400,pw:-20,up:80},dMetro,'Transporte rápido por baixo da terra.',{req:'tra3',tags:['transit']});
T('aeroporto','Aeroporto Regional','pub',2e8,6e5,6,6,4,'épico',{jobs:400,trans:300,tour:500,pw:-80,up:2000},dAeroporto,'Traz visitantes de outras regiões.',{tags:['transit']});
// Natureza
T('jardim','Jardim Florido','nat',50,0,0,0,0,'comum',{happy:3,green:2},dJardim,'Canteiros e borboletas.');
T('praca','Praça com Coreto','nat',400,0,0,0,0,'comum',{happy:5,tour:1,green:1},dPraca,'Banda toca aos domingos.');
T('lago','Lago dos Patos','nat',2500,0,0,0,1,'comum',{happy:8,tour:2,green:4},dLago,'Patinhos nadando em roda.');
T('bosque','Bosque Encantado','nat',6000,0,1,0,1,'incomum',{happy:9,green:10},dBosque,'Absorve muita poluição.');
T('fonte','Fonte Dançante','nat',30000,120,2,0,2,'incomum',{happy:14,tour:10,green:2,pw:-2},dFonte,'Jatos coloridos à noite.');
T('botanico','Jardim Botânico','nat',2e6,6000,3,0,3,'raro',{jobs:20,happy:40,tour:80,green:40,rp:2},dBotanico,'Estufa gigante de vidro.',{req:'amb3'});
T('praia','Praia Artificial','nat',3e7,50000,6,6,3,'raro',{jobs:20,happy:30,tour:250,green:6},dPraia,'Areia, guarda-sol e bola de praia.',{only:6});
// Extravagantes
T('hotelg','Hotel Gigante','extra',3e6,15000,3,6,3,'raro',{jobs:120,hotel:2500,pw:-30,tour:20},dHotelG,'Mil quartos e letreiro vertical.',{req:'arq2'});
T('doces','Torre de Pirulito','extra',6e7,2.6e5,4,4,4,'raro',{jobs:60,tour:200,happy:6},dDoces,'Um pirulito girando no topo.',{req:'arq4'});
T('bule','Prédio Bule de Chá','extra',1.2e8,5e5,5,5,4,'épico',{jobs:80,tour:250,pw:-20},dBule,'Escritórios dentro de um bule.',{req:'arq4'});
T('castelo','Castelo de Doces','extra',1.6e8,6.6e5,5,5,4,'épico',{jobs:100,tour:400,happy:10,pw:-20},dCastelo,'Torres de algodão-doce. Não lamba.');
T('resort','Resort Tropical','extra',2e8,7e5,6,6,4,'épico',{jobs:300,hotel:20000,tour:200,pw:-40},dResort,'Bangalôs de palha e piscina.',{only:6,req:'tur3'});
T('dourada','Torre Dourada','extra',3.2e9,1.15e7,6,7,4,'épico',{jobs:300,tour:600,pw:-60},dDourada,'Ouro maciço, estrela no topo.');
T('piramide','Pirâmide Dourada','extra',9e9,3e7,6,6,4,'épico',{jobs:200,tour:1500},dPiramide,'Degraus de ouro e um topo que brilha.',{req:'arq4'});
T('neon','Arranha-céu Neon','extra',1.6e12,4.2e9,7,4,5,'épico',{jobs:3000,tour:1500,pw:-400},dNeon,'Brilha mais que a lua.');
T('ilha','Ilha Flutuante','extra',4.2e13,9.5e10,8,8,5,'lendário',{jobs:500,tour:5000,happy:20,pop:1000},dIlha,'Flutua por pura teimosia.');
// Monumentos
T('estatua','Estátua da Prefeita','mon',50000,200,1,0,2,'incomum',{tour:30,happy:4},dEstatua,'De bronze, acenando para todos.');
T('relogio','Torre do Relógio','mon',250000,1200,0,0,2,'raro',{tour:80,happy:6},dRelogio,'Marca a hora de verdade.',{only:0});
T('museu','Museu de História','mon',400000,2000,0,0,2,'raro',{jobs:20,tour:120,rp:1,edu:20},dMuseu,'Um dinossauro na porta.',{only:0});
T('monu','Monumento da Essência','mon',600000,4000,0,10,0,'épico',{tour:50,happy:10},dMonu,'Exclusivo do prestígio. Cristal que pulsa.',{ess:5});
T('arco','Arco da Cidade','mon',1.5e6,7000,2,0,3,'incomum',{tour:120,happy:8},dArco,'Portal de boas-vindas.');
T('roda','Roda-Gigante Monumental','mon',9e6,40000,3,6,3,'raro',{jobs:30,tour:200,happy:10,pw:-15},dRoda,'Vista da cidade inteira.');
// Lendárias
T('cristal','Catedral de Cristal','leg',1e14,2e11,8,9,5,'lendário',{tour:30000,happy:40,rp:100},dCristal,'Torres de cristal que cantam ao vento.',{cry:10});
T('mega','Megatorre Lendária','leg',1.3e15,2.4e12,9,9,5,'lendário',{jobs:5000,pop:20000,tour:20000,pw:5000},dMega,'Toca as estrelas. Literalmente.');
T('suspensa','Cidade Suspensa','leg',8e15,1.2e13,9,9,6,'lendário',{pop:100000,happy:60,tour:50000},dSuspensa,'Bairros flutuando ligados por pontes.',{only:9,req:'fut3',cry:20});
T('portal','Portal Cósmico','leg',6e16,9e13,9,9,6,'lendário',{tour:200000,rp:500},dPortal,'Turistas de outras galáxias.',{only:9,req:'fut4',cry:50});
// Decoração
T('arvore','Árvore Redonda','deco',8,0,0,-1,0,'comum',{happy:.6,green:1},dArvore,'Sombra fresca.');
T('pinheiro','Pinheiro','deco',12,0,0,-1,0,'comum',{happy:.6,green:1.2},dPinheiro,'Cheirinho de mato.');
T('canteiro','Canteiro de Flores','deco',20,0,0,-1,0,'comum',{happy:1},dCanteiro,'Margaridas e tulipas.');
T('banco','Banco de Praça','deco',15,0,0,-1,0,'comum',{happy:.8},dBanco,'Para ver a cidade passar.');
T('poste','Poste Charmoso','deco',25,0,0,-1,0,'comum',{happy:.5,safe:1},dPoste,'Ilumina a rua à noite.');
T('calcada','Calçada de Ondas','deco',100,0,0,-1,0,'incomum',{happy:1,tour:.5},dCalcada,'Mosaico de ondas preto e branco.');
T('estatuap','Estatueta de Pato','deco',300,0,0,-1,0,'incomum',{happy:1.5,tour:1},dEstatuaP,'Um pato muito orgulhoso.');
T('sazonal','Decoração Sazonal','deco',150,0,0,-1,0,'incomum',{happy:2},dSazonal,'Muda com a época do ano.');
T('placa','Letreiro da Cidade','deco',600,0,0,-1,1,'raro',{tour:3,happy:.5},dPlaca,'Letras gigantes num morrinho.');
T('ponte','Ponte Decorativa','deco',800,0,0,-1,1,'raro',{happy:2,tour:2},dPonte,'Canal com patos e uma ponte em arco.');
// Projetos (não aparecem no menu)
T('prj','Projeto Municipal','hidden',0,0,0,-1,0,'lendário',{},dProject,'');

// tags derivadas
for(const k in TYPES){const t=TYPES[k];const f=t.f;const tg=new Set(t.tags||[]);
  if(t.cat==='res'||f.pop>0&&t.cat!=='tech')tg.add('res');
  if(t.cat==='com')tg.add('shop');
  if(t.cat==='ent')tg.add('ent');
  if(t.cat==='ind')tg.add('ind');
  if(t.cat==='tech')tg.add('tech');
  if(t.cat==='pub'&&k!=='pref')tg.add('service');
  if(t.cat==='nat')tg.add('green');
  if(t.cat==='deco'){tg.add('deco');if(f.green)tg.add('green');}
  if(t.cat==='mon'||t.cat==='leg')tg.add('monument');
  if(f.pw>0)tg.add('power');
  if(f.goods>0&&t.cat==='ind')tg.add('factory');
  if(f.logi>0)tg.add('logistics');
  if(f.pol>0)tg.add('polluter');
  if(f.hotel>0)tg.add('hotel');
  if(f.jobs>0)tg.add('work');
  if(t.cat==='ent'||t.cat==='mon'||t.cat==='leg'||t.cat==='extra'||(f.tour||0)>=20)tg.add('attraction');
  t.tags=[...tg];
  if(!t.rar)t.rar='comum';
}
const TAGN={res:'Residências',shop:'Comércios',food:'Comida',ent:'Entretenimento',ind:'Indústria',tech:'Tecnologia',service:'Serviços públicos',green:'Áreas verdes',deco:'Decorações',monument:'Monumentos',power:'Energia',factory:'Fábricas',logistics:'Logística',polluter:'Poluidores',hotel:'Hotéis',work:'Locais de trabalho',attraction:'Atrações',transit:'Transporte',school:'Educação',health:'Saúde',safety:'Segurança'};
function hasTag(t,tg){return TYPES[t]&&TYPES[t].tags.includes(tg);}

/* ---------- sinergias ---------- */
const SYN=[
 {t:'res',s:'green',v:.08,max:.4,n:'Áreas verdes por perto'},
 {t:'res',s:'service',v:.06,max:.24,n:'Serviços na vizinhança'},
 {t:'res',s:'polluter',v:-.12,max:-.36,n:'Poluição vizinha'},
 {t:'shop',s:'res',v:.06,max:.36,n:'Clientes da vizinhança'},
 {t:'shop',s:'transit',v:.25,max:.25,n:'Estação de transporte perto'},
 {t:'ent',s:'transit',v:.2,max:.2,n:'Fácil de chegar'},
 {t:'ent',s:'food',v:.08,max:.24,n:'Comida por perto'},
 {t:'hotel',s:'attraction',v:.15,max:.6,n:'Atrações turísticas perto'},
 {t:'factory',s:'logistics',v:.3,max:.3,n:'Logística ao lado'},
 {t:'factory',s:'power',v:.1,max:.1,n:'Energia ao lado'},
 {t:'tech',s:'school',v:.12,max:.48,n:'Polo de inovação'},
 {t:'school',s:'tech',v:.12,max:.48,n:'Polo de inovação'},
 {t:'monument',s:'green',v:.06,max:.24,n:'Cenário bonito'},
 {t:'green',s:'deco',v:.05,max:.2,n:'Bem decorado'},
];
const CPLX=[
 {id:'tur',n:'Complexo Turístico',need:[['attraction',1],['hotel',1],['food',1],['transit',1]],fx:'Turismo +50% e atrações/hotéis +25% no bairro',col:'#ff8fab'},
 {id:'ind',n:'Polo Industrial',need:[['factory',2],['logistics',1],['power',1]],fx:'Mercadorias +50% no bairro',col:'#fb8500'},
 {id:'campus',n:'Campus de Inovação',need:[['school',1],['tech',2]],fx:'Pesquisa +60% no bairro',col:'#4cc9f0'},
 {id:'verde',n:'Bairro Verde',need:[['green',3],['res',3]],fx:'Felicidade da cidade +6',col:'#2fd08a'},
 {id:'gastro',n:'Polo Gastronômico',need:[['food',4]],fx:'Comida rende +50% no bairro',col:'#ffb703'},
 {id:'diversao',n:'Distrito da Diversão',need:[['ent',3]],fx:'Entretenimento +50% no bairro',col:'#9b5de5'},
 {id:'civico',n:'Coração Cívico',need:[['service',3]],fx:'Cobertura de serviços +30%',col:'#5aa9ff'},
];

/* ---------- pesquisa ---------- */
const BRANCH=[
 ['arq','Arquitetura','#ff8fab'],['ene','Energia','#ffc53d'],['tra','Transporte','#38b6ff'],['com','Comércio','#2fd08a'],['ind','Indústria','#fb8500'],
 ['tur','Turismo','#ff6b6b'],['amb','Meio ambiente','#3bb273'],['aut','Automação','#8a95a8'],['fut','Futurista','#8e5cff']];
const TECH=[
 ['arq1','Plantas Modernas','Libera o Conjunto Popular. Residências +20%.',[]],
 ['arq2','Concreto Leve','Libera Mansão e Hotel Gigante. Construir fica 10% mais barato.',[]],
 ['arq3','Arranha-céus','Libera o Arranha-céu Habitacional. Moradias abrigam +30% pessoas.',['tra1']],
 ['arq4','Arquitetura Impossível','Libera Pirulito, Bule e Pirâmide. Extravagantes +50%.',[]],
 ['ene1','Painéis Solares','Libera a Fazenda Solar.',[]],
 ['ene2','Rede Inteligente','Prédios gastam 20% menos energia.',[]],
 ['ene3','Energia Limpa','Usinas poluem 60% menos e o consumo cai mais 15%.',[]],
 ['ene4','Fusão a Frio','Toda energia gerada vale 2×.',[]],
 ['tra1','Linhas de Ônibus','Libera o Terminal de Ônibus.',[]],
 ['tra2','Ônibus Elétricos','Ônibus modernos nas ruas. Transporte +30%.',[]],
 ['tra3','Metrô','Libera a Estação de Metrô.',['ene2']],
 ['tra4','Avenidas Largas','Ruas viram avenidas. Transporte +50%.',[]],
 ['com1','Vitrines Chamativas','Comércio +25% e letreiros novos.',[]],
 ['com2','Delivery','Lojas atendem +20% clientes e pedem 20% menos mercadorias.',[]],
 ['com3','Franquias','Comércio +50%.',[]],
 ['com4','Comércio Holográfico','Comércio 2×.',[]],
 ['ind1','Linha de Montagem','Fábricas produzem +30%.',[]],
 ['ind2','Automação Industrial','Libera a Fábrica de Robôs. Indústrias precisam de 25% menos funcionários.',[]],
 ['ind3','Agricultura Vertical','Libera a Fazenda Vertical.',[]],
 ['ind4','Nanofábricas','Mercadorias 2× e indústria polui metade.',[]],
 ['tur1','Guias Turísticos','Turismo +25%.',[]],
 ['tur2','Marketing Turístico','Turismo +50%.',[]],
 ['tur3','Hotelaria de Luxo','Hotéis +50% de quartos. Libera o Resort Tropical.',['arq2']],
 ['tur4','Turismo Espacial','Turismo 2×.',[]],
 ['amb1','Coleta Seletiva','Poluição −20%.',[]],
 ['amb2','Telhados Verdes','Felicidade +5.',[]],
 ['amb3','Rios Limpos','Libera o Jardim Botânico. Áreas verdes limpam +50%.',[]],
 ['amb4','Cidade-Jardim','Natureza e decorações dão felicidade em dobro.',[]],
 ['aut1','Semáforos Inteligentes','Transporte +25%.',[]],
 ['aut2','Manutenção por Drones','Manutenção dos serviços −30%.',[]],
 ['aut3','Coleta Turbo','Bolhas de moedas valem +50%.',[]],
 ['aut4','Prefeitura Digital','Cobertura de serviços +30%.',[]],
 ['fut1','Supercondutores','Libera a Torre de Comunicação.',['ene2']],
 ['fut2','IA Urbana','Libera o Laboratório de IA. Pesquisa +50%.',['ind2']],
 ['fut3','Antigravidade','Libera o Complexo Futurista e a Cidade Suspensa.',['arq3']],
 ['fut4','Dobra Espacial','Libera o Portal Cósmico. Toda a renda 2×.',['tur4']],
].map(([id,n,d,x])=>{const br=id.slice(0,3),tier=+id[3];const base=[0,15,300,8000,150000][tier]*(br==='fut'?2:1);return {id,n,d,br,tier,cost:base,cry:id==='fut4'?20:id==='fut3'?5:0,req:[...(tier>1?[br+(tier-1)]:[]),...x]};});
const TECHM=Object.fromEntries(TECH.map(t=>[t.id,t]));

/* ---------- projetos municipais ---------- */
const PRJ=[
 {id:'metro',n:'Metrô da Cidade',ch:'zeca',fx:'Capacidade de transporte 2× e avenidas largas em todos os bairros',
  st:[{n:'Escavar túneis',cost:5e6,t:40,req:[['tech','tra1'],['pop',1500]]},{n:'Assentar trilhos',cost:2e7,t:60,req:[['surplus',50]]},{n:'Abrir estações',cost:6e7,t:80,req:[['districts',3]]}]},
 {id:'aero',n:'Aeroporto Internacional',ch:'tuca',fx:'Visitantes 2× e aviões pousando na cidade',
  st:[{n:'Pista de pouso',cost:2e7,t:45,req:[['pop',3000]]},{n:'Terminal de passageiros',cost:8e7,t:60,req:[['tag','transit',2]]},{n:'Torre de controle',cost:3e8,t:80,req:[['surplus',100]]}]},
 {id:'campus',n:'Grande Universidade',ch:'faisca',fx:'Pesquisa 2× e educação completa para todos',
  st:[{n:'Biblioteca',cost:3e6,t:30,req:[['type','univ']]},{n:'Laboratórios',cost:1.5e7,t:50,req:[['techn',5]]},{n:'Observatório',cost:6e7,t:70,req:[['tag','tech',2]]}]},
 {id:'jardins',n:'Jardins Suspensos',ch:'iris',fx:'Felicidade +10 e turismo +50%',
  st:[{n:'Terraços',cost:2e8,t:50,req:[['happy',60]]},{n:'Cascatas',cost:1e9,t:60,req:[['tag','green',6]]},{n:'Floresta aérea',cost:5e9,t:80,cry:10,req:[]}]},
 {id:'fusao',n:'Usina de Fusão',ch:'zeca',fx:'+100 mil de energia e poluição da cidade −80%',
  st:[{n:'Reator',cost:1e9,t:50,req:[['tech','ene3']]},{n:'Ímãs supercondutores',cost:5e9,t:60,cry:5,req:[['tech','fut1']]},{n:'Ignição',cost:2e10,t:80,rp:3000,req:[]}]},
 {id:'elev',n:'Elevador Espacial',ch:'faisca',fx:'Renda da cidade inteira 3×',
  st:[{n:'Base',cost:1e13,t:60,req:[['pop',8e4]]},{n:'Cabo de nanotubos',cost:1e14,t:80,cry:30,req:[]},{n:'Estação orbital',cost:1e15,t:100,rp:50000,req:[]}]},
];
const PRJM=Object.fromEntries(PRJ.map(p=>[p.id,p]));

/* ---------- personagens ---------- */
const CHARS={
 lucia:{n:'Prefeita Lúcia',role:'Prefeita',col:'#ff5d6c',bg:'#ffe1e6'},
 bento:{n:'Bento Bufunfa',role:'Empresário',col:'#179a62',bg:'#d8f8e8'},
 iris:{n:'Íris Prumo',role:'Arquiteta',col:'#8e3fd8',bg:'#ece2ff'},
 faisca:{n:'Dr. Faísca',role:'Cientista',col:'#1a7fc4',bg:'#dcefff'},
 tuca:{n:'Tuca Viajante',role:'Turista',col:'#d98a00',bg:'#fff0c2'},
 zeca:{n:'Zeca Parafuso',role:'Engenheiro',col:'#e07000',bg:'#ffe6cc'},
};
const CHAR_UNLOCK={lucia:0,bento:0,zeca:1,faisca:1,tuca:2,iris:2};

/* ---------- cosméticos ---------- */
const COS=[
 {id:'tree_autumn',slot:'tree',n:'Árvores de Outono',r:'comum'},
 {id:'tree_sakura',slot:'tree',n:'Árvores Cerejeira',r:'raro'},
 {id:'tree_candy',slot:'tree',n:'Árvores Algodão-Doce',r:'épico'},
 {id:'car_bus',slot:'car',n:'Ônibus Amarelinhos',r:'comum'},
 {id:'car_rainbow',slot:'car',n:'Carros Arco-íris',r:'raro'},
 {id:'car_gold',slot:'car',n:'Carros Dourados',r:'épico'},
 {id:'statue_founder',slot:'statue',n:'Estátua do Fundador',r:'raro'},
 {id:'statue_duck',slot:'statue',n:'Pato Gigante',r:'raro'},
 {id:'statue_robot',slot:'statue',n:'Robô de Pedra',r:'épico'},
 {id:'sky_balloon',slot:'sky',n:'Balões Arco-íris',r:'comum'},
 {id:'sky_fire',slot:'sky',n:'Fogos à Noite',r:'raro'},
 {id:'sky_aurora',slot:'sky',n:'Aurora no Céu',r:'lendário'},
 {id:'skin_mint',slot:'skin',n:'Prefeitura Menta',r:'raro'},
 {id:'skin_candy',slot:'skin',n:'Prefeitura Doce',r:'épico'},
 {id:'skin_gold',slot:'skin',n:'Prefeitura Dourada',r:'lendário'},
 {id:'bs_doces',slot:'bskin',n:'Estilo Doces',r:'raro',sk:'doces'},
 {id:'bs_brinq',slot:'bskin',n:'Estilo Brinquedo',r:'raro',sk:'brinq'},
 {id:'bs_neon',slot:'bskin',n:'Estilo Neon',r:'épico',sk:'neon'},
 {id:'bs_fant',slot:'bskin',n:'Estilo Fantasia',r:'épico',sk:'fant'},
 {id:'bs_scifi',slot:'bskin',n:'Estilo Ficção Científica',r:'lendário',sk:'scifi'},
];
const SLOTN={tree:'Árvores',car:'Veículos',statue:'Estátuas',sky:'Céu',skin:'Skins da Prefeitura',bskin:'Estilos de prédio (aplique no painel do prédio)'};
const RAR_W={comum:50,incomum:40,raro:30,'épico':15,'lendário':5};
const ROADS=[
 {id:'asfalto',n:'Asfalto',cost:0,happy:0,c:'#7c84a8'},
 {id:'pedra',n:'Paralelepípedo',cost:5000,happy:1,tour:2,c:'#9c8a7b'},
 {id:'tijolo',n:'Tijolinho colorido',cost:80000,happy:1.5,tour:4,c:'#c9765a'},
 {id:'neon',n:'Pista neon',cost:5e6,happy:2,tour:10,c:'#3a2f6b'},
 {id:'ouro',n:'Calçada dourada',cost:5e9,happy:3,tour:40,c:'#d9b44a'},
];
const HOUSE=['#ffb4c6','#a8e6ff','#ffe08a','#c9f2a6','#d9c2ff','#ffcf9e'];
const ROOFS=['#ff5d6c','#4b7bec','#ff9f1c','#8854d0','#20bf6b'];
const MILES=(()=>{const a=[5,10,25,50,100];for(let v=150;v<=500;v+=50)a.push(v);for(let v=600;v<=10000;v+=100)a.push(v);return a;})();
function tierOf(l){let t=0;for(const m of MILES){if(l>=m)t++;else break;}return t;}
function nextMile(l){for(const m of MILES) if(m>l) return m; return l+100;}
function prevMile(l){let p=1;for(const m of MILES){if(m<=l)p=m;else break;}return p;}
const CU=[
 {id:'cafe',n:'Café Extra-Forte',d:'Comércio produz 2×',cost:4000,cat:'com',m:2},
 {id:'solar',n:'Telhados Solares',d:'Residências produzem 2×',cost:20000,cat:'res',m:2},
 {id:'robo',n:'Robô Coletor',d:'Coleta as bolhas de moedas sozinho',cost:75000,sp:'auto'},
 {id:'esteira',n:'Esteiras Turbo',d:'Indústria produz 2×',cost:400000,cat:'ind',m:2},
 {id:'mkt',n:'Marketing Cartoon',d:'Toda a cidade produz 1,5×',cost:3e6,cat:'all',m:1.5},
 {id:'fogos',n:'Festival de Fogos',d:'Entretenimento, extravagantes e monumentos 2×',cost:8e7,cat:'esp',m:2},
 {id:'banco',n:'Banco Central',d:'Renda offline +25%',cost:5e8,sp:'off'},
 {id:'metro',n:'Bilhete Único',d:'Toda a cidade produz 2×',cost:2e10,cat:'all',m:2},
 {id:'res2',n:'Apartamentos Inteligentes',d:'Residências produzem 3×',cost:5e11,cat:'res',m:3},
 {id:'com2',n:'Shopping 24 Horas',d:'Comércio produz 3×',cost:3e12,cat:'com',m:3},
 {id:'ind2',n:'Fábricas Robóticas',d:'Indústria e tecnologia 3×',cost:2e13,cat:'ind',m:3},
 {id:'cosmo',n:'Satélite Cósmico',d:'Toda a cidade produz 3×',cost:1e15,cat:'all',m:3},
 {id:'esp2',n:'Parque Temático Mundial',d:'Entretenimento, extravagantes e monumentos 3×',cost:5e16,cat:'esp',m:3},
 {id:'inf',n:'Motor do Infinito',d:'Toda a cidade produz 5×',cost:1e19,cat:'all',m:5},
];
const PERKS=[
 [1,'Renda offline sobe de 50% para 75%'],
 [3,'Começo turbo: cada ciclo começa com 5.000 moedas'],
 [5,'Construção exclusiva: Monumento da Essência'],
 [10,'Tempo offline máximo sobe de 4h para 8h'],
 [15,'Rastros de luz neon nos carros'],
 [25,'Nova região: Reino da Essência'],
 [35,'Robô Coletor já vem instalado'],
 [50,'Meteoros dourados 2× mais frequentes e valiosos'],
];
