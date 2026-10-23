/* =====================================================================
   PRIMITIVAS DE DESENHO (mundo isométrico)
   ===================================================================== */
const cv=$('#cv');const ctx=cv.getContext('2d');let X=ctx;let W=0,H=0,DPR=1;
let TINT=null,PREVIEW=false,NIGHT=0,TIME=0;let LIGHTS=[];
const OUT='rgba(43,35,80,.55)';
function tc(c){return TINT&&typeof c==='string'&&c[0]==='#'?TINT(c):c;}
function proj(u,v){return [(u-v)*HW,(u+v)*HH];}
function P(cx,cy,a,b,z){return [cx+(a-b)*HW,cy+(a+b)*HH-z];}
function off(cx,cy,a,b){return P(cx,cy,a,b,0);}
function poly(pts,fill,stroke){X.beginPath();X.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)X.lineTo(pts[i][0],pts[i][1]);X.closePath();
  if(fill){X.fillStyle=tc(fill);X.fill();}if(stroke!==false){X.strokeStyle=OUT;X.lineWidth=1.3;X.lineJoin='round';X.stroke();}}
function box(cx,cy,w,d,h,col,z0){z0=z0||0;const a=w/2,b=d/2;
  const L=P(cx,cy,-a,b,z0),B=P(cx,cy,a,b,z0),R=P(cx,cy,a,-b,z0),Lt=P(cx,cy,-a,b,z0+h),Bt=P(cx,cy,a,b,z0+h),Rt=P(cx,cy,a,-b,z0+h),Tt=P(cx,cy,-a,-b,z0+h);
  poly([L,B,Bt,Lt],col);poly([B,R,Rt,Bt],shade(col,-0.22));poly([Lt,Bt,Rt,Tt],shade(col,0.2));
  return {cx,cy,a,b,z0,h};}
function fp(g,f,s,z){const zz=g.z0+z;let A,B;if(f===0){A=P(g.cx,g.cy,-g.a,g.b,zz);B=P(g.cx,g.cy,g.a,g.b,zz);}else{A=P(g.cx,g.cy,g.a,g.b,zz);B=P(g.cx,g.cy,g.a,-g.b,zz);}return [A[0]+(B[0]-A[0])*s,A[1]+(B[1]-A[1])*s];}
function quadF(g,f,s0,s1,z0,z1){return [fp(g,f,s0,z0),fp(g,f,s1,z0),fp(g,f,s1,z1),fp(g,f,s0,z1)];}
function face(g,f,s0,s1,z0,z1,c){poly(quadF(g,f,s0,s1,z0,z1),f?shade(c,-0.22):c,false);}
function wins(g,cols,rows,col,seed,faces,lc){faces=faces||3;
  for(let f=0;f<2;f++){if(!(faces&(1<<f)))continue;
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
      const q=quadF(g,f,(i+.22)/cols,(i+.78)/cols,g.h*(j+.25)/rows,g.h*(j+.75)/rows);
      poly(q,f?shade(col,-0.25):col,false);
      if(!PREVIEW&&NIGHT>0.25&&hash(seed*31+i*7+j*13+f*3)%10<6)LIGHTS.push({p:q,c:lc||'#ffe28a'});
    }}}
function stripes(g,f,n,z0,z1,c1,c2){for(let i=0;i<n;i++)face(g,f,i/n,(i+1)/n,z0,z1,i%2?c2:c1);}
function pyramid(cx,cy,w,d,z,h,col){const a=w/2,b=d/2;const L=P(cx,cy,-a,b,z),B=P(cx,cy,a,b,z),R=P(cx,cy,a,-b,z),T=[cx,cy-z-h];poly([L,B,T],col);poly([B,R,T],shade(col,-0.25));}
function gableA(cx,cy,w,d,z,h,col){const a=w/2,b=d/2;poly([P(cx,cy,-a,b,z),P(cx,cy,a,b,z),P(cx,cy,a,0,z+h),P(cx,cy,-a,0,z+h)],col);poly([P(cx,cy,a,b,z),P(cx,cy,a,-b,z),P(cx,cy,a,0,z+h)],shade(col,-0.25));}
function gableB(cx,cy,w,d,z,h,col){const a=w/2,b=d/2;poly([P(cx,cy,a,b,z),P(cx,cy,a,-b,z),P(cx,cy,0,-b,z+h),P(cx,cy,0,b,z+h)],shade(col,-0.18));poly([P(cx,cy,-a,b,z),P(cx,cy,a,b,z),P(cx,cy,0,b,z+h)],col);}
function cyl(cx,cy,r,z0,h,col){const ry=r/2,y0=cy-z0,y1=cy-z0-h;
  X.beginPath();X.moveTo(cx-r,y1);X.lineTo(cx-r,y0);X.ellipse(cx,y0,r,ry,0,Math.PI,0,true);X.lineTo(cx+r,y1);X.closePath();
  const c=tc(col);const gr=X.createLinearGradient(cx-r,0,cx+r,0);gr.addColorStop(0,shade(c,0.15));gr.addColorStop(0.55,c);gr.addColorStop(1,shade(c,-0.3));
  X.fillStyle=gr;X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();
  X.beginPath();X.ellipse(cx,y1,r,ry,0,0,Math.PI*2);X.fillStyle=tc(shade(col,0.25));X.fill();X.stroke();}
function dome(cx,cy,r,z,col,hr){hr=hr||r*0.9;const y=cy-z;X.beginPath();X.ellipse(cx,y,r,r/2,0,0,Math.PI);X.ellipse(cx,y,r,hr,0,Math.PI,Math.PI*2);X.closePath();
  const c=tc(col);const gr=X.createRadialGradient(cx-r*.35,y-hr*.6,1,cx,y-hr*.3,r*1.2);gr.addColorStop(0,shade(c,0.6));gr.addColorStop(0.5,c);gr.addColorStop(1,shade(c,-0.3));
  X.fillStyle=gr;X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();}
function ball(x,y,r,col){const c=tc(col);const gr=X.createRadialGradient(x-r*.35,y-r*.4,1,x,y,r);gr.addColorStop(0,shade(c,0.6));gr.addColorStop(0.6,c);gr.addColorStop(1,shade(c,-0.3));
  X.beginPath();X.arc(x,y,r,0,Math.PI*2);X.fillStyle=gr;X.fill();X.strokeStyle=OUT;X.lineWidth=1.2;X.stroke();}
function ell(x,y,rx,ry,col,stroke){X.beginPath();X.ellipse(x,y,rx,ry,0,0,Math.PI*2);X.fillStyle=tc(col);X.fill();if(stroke!==false){X.strokeStyle=OUT;X.lineWidth=1.2;X.stroke();}}
function rr(x,y,w,h,r){X.beginPath();X.moveTo(x+r,y);X.arcTo(x+w,y,x+w,y+h,r);X.arcTo(x+w,y+h,x,y+h,r);X.arcTo(x,y+h,x,y,r);X.arcTo(x,y,x+w,y,r);X.closePath();}
function sign(x,y,txt,bg,fg,size){size=size||8;X.font=size+'px "Lilita One",sans-serif';const w=X.measureText(txt).width+8;rr(x-w/2,y-size/2-3,w,size+6,4);X.fillStyle=tc(bg);X.fill();X.strokeStyle=OUT;X.lineWidth=1.2;X.stroke();
  X.fillStyle=fg;X.textAlign='center';X.textBaseline='middle';X.fillText(txt,x,y+0.5);}
function glow(x,y,r,c){if(!PREVIEW)LIGHTS.push({x,y,r,c});}
function line(x1,y1,x2,y2,c,w){X.beginPath();X.moveTo(x1,y1);X.lineTo(x2,y2);X.strokeStyle=tc(c);X.lineWidth=w||1.5;X.lineCap='round';X.stroke();}
function smoke(x,y,z,big){if(!PREVIEW&&Math.random()<(big?.12:.06))parts.push({k:'smoke',x,y:y-z,vx:rnd(-3,3),vy:rnd(-14,-8),t:0,life:rnd(2,3.2),r:big?rnd(5,8):rnd(3,5)});}
function star(x,y,r1,r2,rot,c){X.save();X.translate(x,y);X.rotate(rot||0);X.beginPath();for(let i=0;i<10;i++){const r=i%2?r2:r1;const a=-Math.PI/2+i*Math.PI/5;X.lineTo(Math.cos(a)*r,Math.sin(a)*r);}X.closePath();X.fillStyle=tc(c);X.fill();X.strokeStyle=OUT;X.lineWidth=1;X.stroke();X.restore();}
function tree(x,y,s,c1,c2){ell(x,y,7*s,3.5*s,'rgba(43,35,80,.16)',false);line(x,y,x,y-9*s,'#8b5a2b',3*s);const sw=Math.sin(TIME*1.6+x)*1.2;ball(x+sw,y-15*s,8*s,c1);ball(x+sw-4*s,y-12*s,5*s,c2||c1);}
function pine(x,y,s,c){ell(x,y,6*s,3*s,'rgba(43,35,80,.16)',false);line(x,y,x,y-6*s,'#8b5a2b',3*s);for(let i=0;i<3;i++){const yy=y-6*s-i*7*s;poly([[x-8*s+i*2*s,yy],[x,yy-11*s],[x+8*s-i*2*s,yy]],i%2?(c||'#2e9e5b'):shade(c||'#2e9e5b',.15));}}
function palm(x,y,s){ell(x,y,7*s,3.5*s,'rgba(43,35,80,.16)',false);const sw=Math.sin(TIME*1.6+x)*1.5;X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+4*s,y-12*s,x+2*s+sw,y-24*s);X.strokeStyle=tc('#a0703c');X.lineWidth=3*s;X.stroke();
  for(let i=0;i<5;i++){const a=-Math.PI/2+(i-2)*.7;X.beginPath();X.moveTo(x+2*s+sw,y-24*s);X.quadraticCurveTo(x+2*s+sw+Math.cos(a)*8*s,y-24*s+Math.sin(a)*8*s-4*s,x+2*s+sw+Math.cos(a)*14*s,y-24*s+Math.sin(a)*14*s+4*s);X.strokeStyle=tc('#2fb35a');X.lineWidth=3.5*s;X.stroke();}}
function person(x,y,c,sk,ph){const bob=Math.abs(Math.sin(TIME*8+ph))*1.2;ell(x,y,2.6,1.3,'rgba(43,35,80,.2)',false);X.beginPath();X.ellipse(x,y-4.5-bob,2.3,3.6,0,0,Math.PI*2);X.fillStyle=tc(c);X.fill();X.strokeStyle=OUT;X.lineWidth=.8;X.stroke();ball(x,y-9.5-bob,2.3,sk||'#ffd7b5');}
function water(x,y,rx,ry,c){ell(x,y,rx,ry,c||'#5ccaf5');X.strokeStyle='rgba(255,255,255,.7)';X.lineWidth=1;for(let i=0;i<2;i++){const o=Math.sin(TIME*2+i*2+x)*rx*.3;X.beginPath();X.moveTo(x-rx*.4+o,y-ry*.2+i*ry*.5);X.quadraticCurveTo(x+o,y-ry*.5+i*ry*.5,x+rx*.4+o,y-ry*.2+i*ry*.5);X.stroke();}}
function wheel(x,y,R,rot,cols){X.beginPath();X.arc(x,y,R,0,Math.PI*2);X.strokeStyle=tc(cols[0]);X.lineWidth=3;X.stroke();for(let i=0;i<8;i++){const a=rot+i*Math.PI/4;line(x,y,x+Math.cos(a)*R,y+Math.sin(a)*R,'rgba(107,90,143,.7)',1.2);}
  for(let i=0;i<8;i++){const a=rot+i*Math.PI/4;const cx=x+Math.cos(a)*R,cy=y+Math.sin(a)*R;rr(cx-4,cy,8,7,2.5);X.fillStyle=tc(cols[1+i%(cols.length-1)]);X.fill();X.strokeStyle=OUT;X.lineWidth=1;X.stroke();if(!PREVIEW&&NIGHT>.25)LIGHTS.push({x:cx,y:cy+3,r:7,c:'rgba(255,230,140,.8)'});}ball(x,y,4,'#ffd23f');}
const COL4=['#ff5d6c','#ffd23f','#2fd08a','#5aa9ff'];

/* =====================================================================
   PRÉDIOS — cada um com silhueta própria
   ===================================================================== */
function dPref(b,cx,cy,hf){
  const sk=S.cos.eq.skin;const wall=sk==='skin_mint'?'#c8f7e0':sk==='skin_candy'?'#ffd1e6':'#fff3d6';const dm=sk==='skin_gold'?'#ffcf33':sk==='skin_candy'?'#ff7eb6':sk==='skin_mint'?'#2fd08a':'#5aa9ff';
  const h=26*hf;const g=box(cx,cy,.86,.86,h,wall);
  for(let i=0;i<4;i++)poly(quadF(g,0,(i+.3)/4,(i+.6)/4,2,h-4),'#ffffff',false);
  wins(g,3,2,'#b8ecff',b.id,2);poly(quadF(g,0,.38,.62,0,12),'#b06a3b',false);
  const g2=box(cx,cy,.5,.5,14,shade(wall,-0.05),h);const c=fp(g2,0,.5,7);
  X.beginPath();X.arc(c[0],c[1],4.5,0,Math.PI*2);X.fillStyle='#fff';X.fill();X.strokeStyle=OUT;X.stroke();const a=TIME*1.3;line(c[0],c[1],c[0]+Math.cos(a)*3,c[1]+Math.sin(a)*3,'#2b2350',1.2);
  dome(cx,cy,16,h+14,dm,15);const fy=cy-h-14-15;line(cx,fy,cx,fy-16,'#6b5a8f',1.6);const wv=Math.sin(TIME*5)*2;poly([[cx,fy-16],[cx+12,fy-13+wv],[cx,fy-9]],'#ff5d6c');
  return h+14+32;}
function dCasa(b,cx,cy,hf,tier){const wall=HOUSE[b.id%HOUSE.length],rc=ROOFS[(b.id>>1)%ROOFS.length];
  if(tier>=4){const [mx,my]=off(cx,cy,-.06,-.12);const g=box(mx,my,.62,.5,26,wall);wins(g,2,2,'#bfefff',b.id);poly(quadF(g,0,.42,.6,0,11),'#8a5a3c',false);
    const [gx,gy]=off(cx,cy,.22,.24);const gg=box(gx,gy,.3,.3,12,shade(wall,-.08));poly(quadF(gg,0,.12,.88,0,9),'#d9d2e8',false);for(let k=1;k<4;k++)line(...fp(gg,0,.12,k*2.2),...fp(gg,0,.88,k*2.2),'#a79fc2',1);
    gableA(mx,my,.68,.56,26,14,rc);const [hx,hy]=off(cx,cy,-.34,.34);ell(hx,hy,7,3.5,'#5fd35f');return 42;}
  if(tier>=2){const g=box(cx,cy,.6,.58,30*hf*.85,wall);face(g,0,0,1,13,15,shade(wall,-.15));face(g,1,0,1,13,15,shade(wall,-.15));
    poly(quadF(g,0,.4,.6,0,10),'#8a5a3c',false);wins(g,2,2,'#bfefff',b.id,2);poly(quadF(g,0,.1,.3,17,24),'#bfefff',false);poly(quadF(g,0,.7,.9,17,24),'#bfefff',false);
    const hh=30*hf*.85;gableB(cx,cy,.66,.64,hh,14,rc);return hh+16;}
  const h=18*hf;const g=box(cx,cy,.62,.62,h,wall);poly(quadF(g,0,.38,.62,0,10),'#8a5a3c',false);
  poly(quadF(g,0,.08,.3,6,13),'#bfefff',false);wins(g,1,1,'#bfefff',b.id,2);
  if(!PREVIEW&&NIGHT>.25)LIGHTS.push({p:quadF(g,0,.08,.3,6,13),c:'#ffd27a'});
  const [chx,chy]=off(cx,cy,.12,-.18);box(chx,chy,.1,.1,14,'#d9785c',h);smoke(chx,chy,h+14);pyramid(cx,cy,.78,.78,h,15,rc);
  X.beginPath();X.arc(...fp(g,0,.18,1.5),3,0,Math.PI*2);X.fillStyle=tc('#ff6fa0');X.fill();return h+16;}
function dSobrado(b,cx,cy,hf){const h=28*hf;const cs=[HOUSE[(b.id+2)%6],HOUSE[(b.id+4)%6]];
  for(let k=0;k<2;k++){const [x,y]=off(cx,cy,-.17+k*.34,0);const g=box(x,y,.33,.62,h,cs[k]);poly(quadF(g,0,.25,.75,0,10),'#7a4a2a',false);poly(quadF(g,0,.25,.75,15,23),'#c6f1ff',false);
    face(g,0,0,1,13,14.5,'#ffffff');wins(g,2,2,'#c6f1ff',b.id+k,2);gableB(x,y,.37,.66,h,12,k?'#4b7bec':'#ff5d6c');}
  return h+14;}
function dApto(b,cx,cy,hf){const cols=['#ffd6a5','#cde7ff','#e5d4ff'];const col=cols[b.id%3];const h=42*hf;
  const g=box(cx,cy,.7,.7,h,col);wins(g,3,Math.round(4*hf),'#a8e4ff',b.id);poly(quadF(g,0,.4,.6,0,8),'#7a4a2a',false);
  box(cx,cy,.76,.76,4,shade(col,-.3),h);const [x,y]=off(cx,cy,-.1,-.12);cyl(x,y,6,h+4,10,'#9aa7c7');return h+16;}
function dPopular(b,cx,cy,hf){const h=34*hf;const g=box(cx,cy,.9,.5,h,'#e8cfa6');wins(g,5,Math.round(3*hf),'#9fd7ff',b.id);
  for(let j=1;j<Math.round(3*hf);j++){const z=h*j/Math.round(3*hf);face(g,0,0,1,z-1,z+1,'#c99a64');}
  for(let i=0;i<4;i++){const p=fp(g,0,.12+i*.25,h*.62);const q=fp(g,0,.22+i*.25,h*.62);X.beginPath();X.moveTo(...p);X.quadraticCurveTo((p[0]+q[0])/2,(p[1]+q[1])/2+3,...q);X.strokeStyle='#6b5a8f';X.lineWidth=.8;X.stroke();
    for(let k=0;k<3;k++){const t=(k+1)/4;X.fillStyle=COL4[(i+k)%4];X.fillRect(lerp(p[0],q[0],t)-1.5,lerp(p[1],q[1],t)+1,3,3.5);}}
  box(cx,cy,.94,.54,3,'#b07a4a',h);const [x,y]=off(cx,cy,.28,-.1);cyl(x,y,5,h+3,8,'#7fb2ff');return h+12;}
function dCondo(b,cx,cy,hf){const h1=22*hf,h2=20*hf;const g=box(cx,cy,.84,.84,h1,'#f6e7cf');wins(g,4,2,'#8fd3ff',b.id);
  const g2=box(cx,cy,.56,.56,h2,'#ecd5b0',h1);wins(g2,3,2,'#8fd3ff',b.id+5);const [px,py]=off(cx,cy,.3,.3);ell(px,py-h1-1,9,4.5,'#5ad8ff');
  dome(cx,cy,13,h1+h2,'#ffd166',12);return h1+h2+16;}
function dMansao(b,cx,cy,hf){const [mx,my]=off(cx,cy,-.08,-.1);const h=22*hf;const g=box(mx,my,.66,.5,h,'#fffaf0');for(let i=0;i<5;i++)face(g,0,(i+.35)/5,(i+.55)/5,0,h-3,'#e8dcc4');
  wins(g,4,2,'#bfe8ff',b.id,2);poly(quadF(g,0,.42,.58,0,10),'#8a5a3c',false);pyramid(mx,my,.74,.58,h,10,'#c94f4f');
  const [px,py]=off(cx,cy,.24,.3);X.beginPath();X.ellipse(px,py,12,6,0,0,Math.PI*2);X.fillStyle=tc('#e9e2d0');X.fill();X.stroke();water(px,py-.5,10,5,'#4fd0ff');
  palm(cx-24,cy+4,.7);return h+14;}
function dTorre(b,cx,cy,hf){const h=82*hf;cyl(cx,cy,19,0,h,'#9fe7ff');
  for(let i=1;i<6;i++){const y=cy-h*i/6;X.beginPath();X.ellipse(cx,y,19.5,9.75,0,0,Math.PI);X.strokeStyle=tc('#4f63ff');X.lineWidth=2;X.stroke();if(!PREVIEW&&NIGHT>.25)LIGHTS.push({x:cx,y:y-4,r:14,c:'rgba(160,240,255,.35)'});}
  for(let i=0;i<5;i++){const x=cx-14+i*7;line(x,cy-4,x,cy-h+6,'rgba(255,255,255,.45)',1.4);}
  dome(cx,cy,15,h,'#e2fbff',14);line(cx,cy-h-14,cx,cy-h-30,'#6b5a8f',1.6);const bl=Math.sin(TIME*4+b.id)>0;ell(cx,cy-h-31,2.5,2.5,bl?'#ff4d6d':'#7a2b3a',false);if(bl)glow(cx,cy-h-31,10,'rgba(255,77,109,.7)');
  return h+34;}
function dArranha(b,cx,cy,hf){let z=0;const L=[[.62,64],[.5,40],[.36,28]];
  for(const [s,h] of L){const g=box(cx,cy,s,s,h*hf,z?'#7ec8e3':'#5fb3d6',z);for(let f=0;f<2;f++)for(let i=0;i<4;i++)face(g,f,(i+.15)/4,(i+.85)/4,2,h*hf-2,f?'#a6e3f7':'#c9f1ff');
    for(let j=1;j<6;j++){const zz=h*hf*j/6;face(g,0,0,1,zz-.6,zz+.6,'#3c86a8');face(g,1,0,1,zz-.6,zz+.6,'#3c86a8');}
    if(!PREVIEW&&NIGHT>.25&&hash(b.id+z)%2)LIGHTS.push({p:quadF(g,0,.1,.9,4,h*hf-4),c:'rgba(255,240,180,.55)'});z+=h*hf;}
  line(cx,cy-z,cx,cy-z-26,'#c9d6e8',2.5);const bl=Math.sin(TIME*3)>0;if(bl){ell(cx,cy-z-27,2.2,2.2,'#ff4d6d',false);glow(cx,cy-z-27,10,'rgba(255,77,109,.8)');}return z+30;}
// Comércio
function dPadaria(b,cx,cy,hf){const h=18*hf;const g=box(cx,cy,.64,.64,h,'#fff1d6');poly(quadF(g,0,.1,.55,3,12),'#c6f1ff',false);poly(quadF(g,0,.65,.9,0,11),'#8a5a3c',false);wins(g,2,1,'#c6f1ff',b.id,2);
  stripes(g,0,6,h-6,h-2,'#a0522d','#fff3e0');stripes(g,1,6,h-6,h-2,'#a0522d','#fff3e0');
  const y=cy-h-5;X.save();X.translate(cx,y);X.rotate(-.15);X.beginPath();X.ellipse(0,0,13,6.5,0,0,Math.PI*2);X.fillStyle=tc('#e2a15a');X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();
  for(let i=-1;i<=1;i++){X.beginPath();X.moveTo(i*6-2,-4);X.lineTo(i*6+2,3);X.strokeStyle=tc('#fff2d0');X.lineWidth=1.6;X.stroke();}X.restore();
  const [chx,chy]=off(cx,cy,.18,-.2);box(chx,chy,.1,.1,10,'#c97b5a',h);smoke(chx,chy,h+10);return h+14;}
function dCafe(b,cx,cy,hf,tier){const h=20*hf;const g=box(cx,cy,.66,.66,h,'#ffe0b8');
  poly(quadF(g,0,.1,.55,3,13),'#c6f1ff',false);poly(quadF(g,0,.65,.9,0,12),'#8a5a3c',false);wins(g,2,1,'#c6f1ff',b.id,2);
  stripes(g,0,6,h-7,h-2,'#ff5d6c','#ffffff');stripes(g,1,6,h-7,h-2,'#ff5d6c','#ffffff');
  cyl(cx,cy,8,h,10,'#ffffff');ell(cx,cy-h-10,6,3,'#6b3a1e',false);X.beginPath();X.arc(cx+9,cy-h-5,3.5,-Math.PI/2,Math.PI/2);X.strokeStyle=tc('#ffffff');X.lineWidth=2.5;X.stroke();
  if(tier>=2){for(let k=0;k<2;k++){const [tx,ty]=off(cx,cy,-.15+k*.3,.46);line(tx,ty,tx,ty-6,'#6b5a8f',1);conePts(tx,ty-6,5,4,k?'#ffd23f':'#2fd08a');}}
  if(!PREVIEW&&Math.random()<.04)parts.push({k:'steam',x:cx+rnd(-3,3),y:cy-h-12,vx:0,vy:-10,t:0,life:1.4,r:2.5});return h+14;}
function dLanche(b,cx,cy,hf){const h=20*hf;const g=box(cx,cy,.7,.7,h,'#ff9f43');poly(quadF(g,0,.12,.6,3,13),'#fff3c4',false);poly(quadF(g,0,.68,.9,0,11),'#7a3b12',false);wins(g,2,1,'#fff3c4',b.id,2);
  const bob=Math.sin(TIME*3+b.id)*1.5;const y=cy-h-4+bob;ell(cx,y,13,6,'#f2a65a');ell(cx,y-3,14,6,'#6b3416');ell(cx,y-5,14.5,5,'#5fd35f');ell(cx,y-6,13,5,'#ffd23f');
  X.beginPath();X.ellipse(cx,y-7,13,10,0,Math.PI,Math.PI*2);X.closePath();X.fillStyle=tc('#f4a259');X.fill();X.strokeStyle=OUT;X.stroke();for(let i=0;i<5;i++)ell(cx-7+i*3.5,y-11-(i%2)*2,1,.7,'#fff8dc',false);return h+22;}
function dPizzaria(b,cx,cy,hf){const h=20*hf;const g=box(cx,cy,.68,.68,h,'#fff4e6');face(g,0,0,1,0,5,'#2f9e44');face(g,1,0,1,0,5,'#c92a2a');
  poly(quadF(g,0,.12,.58,6,14),'#ffe8a3',false);poly(quadF(g,0,.66,.88,0,12),'#7a3b12',false);wins(g,2,1,'#ffe8a3',b.id,2,'#ffb35a');
  const [ox,oy]=off(cx,cy,.1,-.12);dome(ox,oy,10,h,'#c4552f',9);ell(ox-3,oy-h-2,3.5,3,'#3b1d0e',false);if(!PREVIEW)glow(ox-3,oy-h-2,8,'rgba(255,140,40,.6)');smoke(ox,oy,h+10);
  const [sx,sy]=fp(g,0,.5,h+12);X.save();X.translate(sx-12,sy+2);X.rotate(TIME*.6);X.beginPath();X.arc(0,0,8,0,Math.PI*2);X.fillStyle=tc('#ffd166');X.fill();X.strokeStyle=tc('#d4881e');X.lineWidth=2;X.stroke();
  for(let i=0;i<5;i++){X.beginPath();X.arc(Math.cos(i*1.3)*4.5,Math.sin(i*1.3)*4.5,1.6,0,Math.PI*2);X.fillStyle='#d62828';X.fill();}X.restore();return h+20;}
function dRoupas(b,cx,cy,hf){const h=24*hf;const g=box(cx,cy,.7,.7,h,'#ffe3ef');poly(quadF(g,0,.08,.92,2,16),'#d9f5ff',false);poly(quadF(g,1,.1,.6,2,16),'#bfe3f2',false);
  if(!PREVIEW&&NIGHT>.25)LIGHTS.push({p:quadF(g,0,.08,.92,2,16),c:'#ffe9f3'});
  for(let i=0;i<3;i++){const [x,y]=fp(g,0,.22+i*.28,2);const sw=Math.sin(TIME*3+i)*1.2;ell(x,y-6+sw*.3,2.3,5,['#ff5d6c','#5aa9ff','#ffd23f'][i],false);ell(x+sw*.2,y-13,2,2,'#f1c27d',false);}
  for(let f=0;f<2;f++)face(g,f,0,1,h-4,h,'#ff4f9a');
  const [hx,hy]=off(cx,cy,0,0);const ty=hy-h-10;line(hx,ty-6,hx,ty-2,'#6b5a8f',1.4);poly([[hx-10,ty+5],[hx,ty-2],[hx+10,ty+5]],'#ffffff');poly([[hx-6,ty+5],[hx-6,ty+12],[hx+6,ty+12],[hx+6,ty+5]],'#ff4f9a');return h+20;}
function dFeira(b,cx,cy){box(cx,cy,.9,.9,2,'#d8c9b0');const st=[[-.25,-.2,'#ff5d6c'],[.22,-.22,'#2fd08a'],[-.22,.22,'#ffb703'],[.24,.2,'#5aa9ff']];
  for(const [a,bb,c] of st){const [x,y]=off(cx,cy,a,bb);const g=box(x,y,.3,.26,7,'#c9a37a',2);for(let k=0;k<4;k++)ell(...fp(g,0,.2+k*.2,8),1.6,1.4,['#ff6b6b','#ffd23f','#7ad35f','#ff9f1c'][k],false);
    line(...P(x,y,-.14,.12,9),...P(x,y,-.14,.12,17),'#6b5a8f',1);line(...P(x,y,.14,.12,9),...P(x,y,.14,.12,17),'#6b5a8f',1);pyramid(x,y,.38,.34,17,6,c);}
  const t=TIME*.5;person(cx+Math.sin(t)*14,cy+4+Math.cos(t)*4,'#9b5de5','#e0ac69',1);person(cx-10,cy-2,'#ff8fab','#8d5524',2);return 30;}
function dRestaurante(b,cx,cy,hf){const h=24*hf;const g=box(cx,cy,.76,.76,h,'#2e6b4f');face(g,0,0,1,h-3,h,'#e9c46a');face(g,1,0,1,h-3,h,'#e9c46a');
  for(let i=0;i<3;i++){const q=quadF(g,0,.12+i*.28,.32+i*.28,3,15);poly(q,'#fff2c6',false);if(!PREVIEW&&NIGHT>.25)LIGHTS.push({p:q,c:'#ffd88a'});}wins(g,2,1,'#fff2c6',b.id,2);
  box(cx,cy,.76,.76,2,'#c9a37a',h);const [ux,uy]=off(cx,cy,-.1,.05);line(ux,uy-h-2,ux,uy-h-14,'#6b5a8f',1.4);conePts(ux,uy-h-14,10,6,'#ffffff');
  for(let i=0;i<6;i++){const p=P(cx,cy,-.38+i*.15,.38,h+8+Math.sin(i)*1);ell(p[0],p[1],1.4,1.4,'#fff3a8',false);if(NIGHT>.25)glow(p[0],p[1],5,'rgba(255,240,150,.9)');}
  const [sx,sy]=off(cx,cy,.2,-.2);ell(sx,sy-h-6,5,3,'#fff');ell(sx,sy-h-10,6,5,'#fff');return h+22;}
function dPousada(b,cx,cy,hf){const h=20*hf;const g=box(cx,cy,.66,.6,h,'#b07a4a');for(let j=1;j<5;j++){face(g,0,0,1,h*j/5-.5,h*j/5+.5,'#8b5a2b');face(g,1,0,1,h*j/5-.5,h*j/5+.5,'#8b5a2b');}
  poly(quadF(g,0,.4,.6,0,10),'#5a3519',false);wins(g,2,1,'#ffe8a3',b.id,3,'#ffcf6e');face(g,0,0,1,11,12.5,'#ffffff');for(let i=0;i<4;i++)ell(...fp(g,0,.15+i*.23,11),1.6,1.2,COL4[i],false);
  gableB(cx,cy,.74,.68,h,18,'#2f9e44');const [sx,sy]=fp(g,0,.82,h-4);line(sx,sy,sx+8,sy+3,'#6b5a8f',1);sign(sx+8,sy+9,'POUSADA','#fff8dc','#8b5a2b',6);return h+20;}
function dCinema(b,cx,cy,hf){const h=30*hf;const g=box(cx,cy,.8,.8,h,'#9d1f3a');poly(quadF(g,0,.2,.8,0,12),'#2b1150',false);
  const [tx,ty]=fp(g,0,.5,19);sign(tx,ty,'CINE','#ffd23f','#9d1f3a',11);
  for(let f=0;f<2;f++)for(let i=0;i<10;i++){const p=fp(g,f,(i+.5)/10,13);const on=(Math.floor(TIME*5)+i)%2===0;ell(p[0],p[1],1.4,1.4,on?'#fff3a8':'#7a2b3a',false);if(on)glow(p[0],p[1],5,'rgba(255,240,150,.9)');}
  const [px,py]=off(cx,cy,0,-.05);cyl(px,py,10,h,14,'#ffffff');X.save();X.beginPath();X.rect(px-10,py-h-14,20,16);X.clip();for(let i=0;i<4;i++){X.fillStyle=tc('#e03131');X.fillRect(px-10+i*6,py-h-16,3,20);}X.restore();
  for(let i=0;i<5;i++)ball(px-7+i*3.5,py-h-15-(i%2)*2,3,'#fff8dc');return h+22;}
function dMercado(b,cx,cy,hf){const h=26*hf;const g=box(cx,cy,.88,.88,h,'#eafcff');
  poly(quadF(g,0,.06,.94,3,15),'#9fe3ff',false);poly(quadF(g,1,.06,.94,3,15),'#7fc7e6',false);if(!PREVIEW&&NIGHT>.25)LIGHTS.push({p:quadF(g,0,.06,.94,3,15),c:'#fff1b0'});
  for(let i=0;i<3;i++)line(...fp(g,0,(i+1)/4,3),...fp(g,0,(i+1)/4,15),'#ffffff',1.5);for(let f=0;f<2;f++)poly(quadF(g,f,0,1,h-6,h),f?'#169a5c':'#20bf6b',false);
  const [sx,sy]=fp(g,0,.5,h+6);sign(sx,sy,'MERCADO','#20bf6b','#fff',8);const [kx,ky]=off(cx,cy,-.3,.5);box(kx,ky,.12,.08,4,'#c0c8d8',2);return h+12;}
function dShopping(b,cx,cy,hf){const h=32*hf;const g=box(cx,cy,.92,.92,h,'#ffd1e8');wins(g,5,2,'#c6f1ff',b.id);for(let f=0;f<2;f++)poly(quadF(g,f,0,1,h-4,h),'#ff4f9a',false);
  dome(cx,cy,20,h,'#b9f0ff',16);const [sx,sy]=off(cx,cy,-.46,.1);sign(sx-2,sy-h-6,'SHOP','#ff4f9a','#fff',9);return h+20;}
function dBrinq(b,cx,cy,hf){const h=26*hf;const g=box(cx,cy,.78,.78,h,'#c6f0ff');poly(quadF(g,0,.1,.6,3,15),'#fff6c2',false);wins(g,2,1,'#fff6c2',b.id,2);
  for(let f=0;f<2;f++)for(let i=0;i<8;i++)poly(quadF(g,f,i/8,(i+1)/8,h-5,h),COL4[i%4],false);
  const bob=Math.abs(Math.sin(TIME*2.6+b.id))*5;const by=cy-h-14-bob;ell(cx,cy-h-2,10,4,'rgba(0,0,0,.18)',false);ball(cx-4,by,13,'#ff5d6c');
  X.save();X.beginPath();X.arc(cx-4,by,13,0,Math.PI*2);X.clip();X.fillStyle=tc('#ffffff');X.fillRect(cx-6,by-14,4,28);X.fillStyle=tc('#ffd23f');X.fillRect(cx-17,by-2,26,4);X.restore();
  X.beginPath();X.arc(cx-4,by,13,0,Math.PI*2);X.strokeStyle=OUT;X.stroke();const [px,py]=off(cx,cy,.22,-.22);line(px,py-h,px,py-h-24,'#6b5a8f',1.5);
  X.save();X.translate(px,py-h-24);X.rotate(TIME*4);for(let i=0;i<4;i++){X.rotate(Math.PI/2);X.beginPath();X.moveTo(0,0);X.lineTo(8,-3);X.lineTo(6,4);X.closePath();X.fillStyle=tc(COL4[i]);X.fill();}X.restore();return h+32;}
function dBolsa(b,cx,cy,hf){box(cx,cy,.94,.94,5,'#e8e2d4');box(cx,cy,.86,.86,4,'#f2ece0',5);const h=28*hf;const g=box(cx,cy,.74,.74,h,'#f7f2e8',9);
  for(let i=0;i<6;i++){const [x,y]=fp(g,0,(i+.5)/6,0);cyl(x,y,2.2,9,h-2,'#ffffff');}
  gableA(cx,cy,.82,.82,h+9,14,'#e8e2d4');const [fx,fy]=fp(g,0,.5,h-4);rr(fx-22,fy-3,44,6,2);X.fillStyle='#1d1b3a';X.fill();
  X.save();X.beginPath();X.rect(fx-21,fy-3,42,6);X.clip();X.font='5px "Nunito",sans-serif';X.textBaseline='middle';const o=(TIME*14)%40;for(let k=0;k<3;k++){X.fillStyle=k%2?'#ff6b6b':'#2fd08a';X.fillText(k%2?'▼1.2%':'▲3.4%',fx+20-o-k*22+40,fy);}X.restore();
  const [tx,ty]=off(cx,cy,-.1,.5);const pg=TINT;TINT=gold;box(tx,ty,.22,.1,7,'#d9a300',2);ball(tx-6,ty-9,4,'#d9a300');line(tx-9,ty-12,tx-12,ty-15,'#d9a300',1.6);TINT=pg;return h+26;}
// Entretenimento
function dFliper(b,cx,cy,hf){const h=22*hf;const g=box(cx,cy,.7,.7,h,'#3b1f6b');poly(quadF(g,0,.15,.85,2,14),'#120a2a',false);
  for(let i=0;i<4;i++){const p=quadF(g,0,.2+i*.17,.32+i*.17,4,12);const hue=(TIME*120+i*60)%360;poly(p,`hsl(${hue},90%,60%)`,false);if(!PREVIEW)LIGHTS.push({p,c:`hsl(${hue},90%,60%)`,always:1});}
  const [ix,iy]=off(cx,cy,0,0);const y=iy-h-14+Math.sin(TIME*4)*1.5;const px=[[0,1,0,0,0,1,0],[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[1,1,0,1,0,1,1],[1,1,1,1,1,1,1],[1,0,1,0,1,0,1]];
  for(let r=0;r<6;r++)for(let c=0;c<7;c++)if(px[r][c]){X.fillStyle=tc('#7dff6b');X.fillRect(ix-10.5+c*3,y+r*3,3,3);}glow(ix,y+8,22,'rgba(125,255,107,.55)');line(ix,iy-h,ix,y+18,'#6b5a8f',1.5);return h+30;}
function dBoliche(b,cx,cy,hf){const h=20*hf;const g=box(cx,cy,.8,.7,h,'#5aa9ff');poly(quadF(g,0,.2,.8,2,12),'#d9f0ff',false);stripes(g,0,8,h-4,h,'#ffffff','#ff5d6c');stripes(g,1,8,h-4,h,'#ffffff','#ff5d6c');
  const [px,py]=off(cx,cy,-.05,-.05);const y=py-h;const wob=Math.sin(TIME*2+b.id)*.08;X.save();X.translate(px,y);X.rotate(wob);
  X.beginPath();X.moveTo(-5,0);X.quadraticCurveTo(-10,-14,-4,-22);X.quadraticCurveTo(-6,-30,0,-34);X.quadraticCurveTo(6,-30,4,-22);X.quadraticCurveTo(10,-14,5,0);X.closePath();X.fillStyle=tc('#ffffff');X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();
  X.fillStyle=tc('#ff5d6c');X.fillRect(-4.8,-25,9.6,2.5);X.fillRect(-4.6,-21,9.2,2);X.restore();const [bx,by]=off(cx,cy,.28,-.1);ball(bx,by-h-6,6,'#2b2350');ell(bx-1.5,by-h-8,1,1,'#fff',false);return h+36;}
function dCirco(b,cx,cy,hf){const h=14;cyl(cx,cy,26,0,h,'#ff5d6c');X.save();X.beginPath();X.rect(cx-26,cy-h-14,52,h+16);X.clip();for(let i=0;i<7;i++){X.fillStyle=tc('#ffffff');X.fillRect(cx-24+i*8,cy-h-14,4,h+28);}X.restore();
  X.beginPath();X.ellipse(cx,cy,26,13,0,0,Math.PI);X.strokeStyle=OUT;X.stroke();const th=30*hf;
  X.beginPath();X.moveTo(cx-27,cy-h);X.lineTo(cx,cy-h-th);X.lineTo(cx+27,cy-h);X.ellipse(cx,cy-h,27,13.5,0,0,Math.PI);X.closePath();X.fillStyle=tc('#ffd23f');X.fill();X.strokeStyle=OUT;X.stroke();
  for(let i=1;i<6;i+=2){X.beginPath();X.moveTo(cx,cy-h-th);X.lineTo(cx-27+i*9,cy-h+Math.sin(i/6*Math.PI)*13);X.lineTo(cx-27+(i+1)*9,cy-h+Math.sin((i+1)/6*Math.PI)*13);X.closePath();X.fillStyle=tc('#ff5d6c');X.fill();}
  line(cx,cy-h-th,cx,cy-h-th-12,'#6b5a8f',1.4);poly([[cx,cy-h-th-12],[cx+9,cy-h-th-9+Math.sin(TIME*5)*1.5],[cx,cy-h-th-6]],'#5aa9ff');
  poly([P(cx,cy,-.1,.42,0),P(cx,cy,.1,.42,0),P(cx,cy,0,.42,12)],'#2b1150',false);return h+th+14;}
function dParque(b,cx,cy,hf){box(cx,cy,.9,.9,3,'#86e08a');const [tx,ty]=off(cx,cy,.25,.2);box(tx,ty,.3,.3,10,'#ffffff',3);
  const tl=P(tx,ty,-.15,.15,13),tb=P(tx,ty,.15,.15,13),tr=P(tx,ty,.15,-.15,13),tt=[tx,ty-30];poly([tl,tb,tt],'#ff5d6c');poly([tb,tr,tt],'#ffd23f');
  const [wx,wy]=off(cx,cy,-.1,-.15);const R=24*hf,hz=wy-R-10;line(wx-12,wy-3,wx,hz,'#6b5a8f',2.5);line(wx+12,wy-3,wx,hz,'#6b5a8f',2.5);wheel(wx,hz,R,TIME*.6,['#ff8fab',...COL4]);return R*2+16;}
function dAquario(b,cx,cy,hf){const h=24*hf;const g=box(cx,cy,.82,.82,h,'#2a6fd6');X.save();const q=quadF(g,0,.05,.95,2,h-3);poly(q,'rgba(120,210,255,.85)',false);X.clip();
  for(let i=0;i<5;i++){const t=(TIME*.25+i*.21+b.id*.1)%1;const p=fp(g,0,t,4+((i*5)%(h-9)));const dir=1;ell(p[0],p[1],3.2,1.8,['#ff9f1c','#ffd23f','#ff5d6c','#ffffff','#ff8fab'][i],false);poly([[p[0]-3*dir,p[1]],[p[0]-6*dir,p[1]-2],[p[0]-6*dir,p[1]+2]],'#ff9f1c',false);}
  for(let i=0;i<4;i++){const t=(TIME*.4+i*.25)%1;const p=fp(g,0,.2+i*.2,4+t*(h-8));ell(p[0],p[1],1,1,'rgba(255,255,255,.8)',false);}X.restore();
  dome(cx,cy,18,h,'rgba(150,230,255,.55)',15);const [wx,wy]=off(cx,cy,.2,-.2);const j=Math.abs(Math.sin(TIME*2));for(let i=0;i<5;i++)ell(wx+(i-2)*2,wy-h-16-j*8+Math.abs(i-2)*2,1.4,1.4,'#bde9ff',false);return h+30;}
function dZoo(b,cx,cy){box(cx,cy,.94,.94,2,'#9bd66a');for(let i=0;i<=8;i++){const p=P(cx,cy,-.45+i*.1125,.45,2);line(p[0],p[1],p[0],p[1]-6,'#8b5a2b',1.2);}
  for(let i=0;i<=8;i++){const p=P(cx,cy,.45,.45-i*.1125,2);line(p[0],p[1],p[0],p[1]-6,'#8b5a2b',1.2);}
  const [tx,ty]=off(cx,cy,-.25,-.25);tree(tx,ty-2,.9,'#3cb44b');
  const [ex,ey]=off(cx,cy,.18,-.12);const st=Math.sin(TIME*1.5)*1.2;ell(ex,ey-8,9,6.5,'#9aa7c7');ell(ex-8,ey-10,4.5,4,'#9aa7c7');X.beginPath();X.moveTo(ex-11,ey-9);X.quadraticCurveTo(ex-14,ey-2+st,ex-12,ey+1);X.strokeStyle=tc('#8a96b5');X.lineWidth=2.2;X.stroke();for(const o of [-5,5])line(ex+o,ey-3,ex+o,ey+1,'#8a96b5',3);
  const [gx,gy]=off(cx,cy,-.15,.18);const nb=Math.sin(TIME*1.2)*2;ell(gx,gy-10,6,4,'#ffc94d');for(const o of [-4,4])line(gx+o,gy-8,gx+o,gy,'#e0a43a',2);line(gx+4,gy-12,gx+7+nb,gy-28,'#ffc94d',3.5);ell(gx+8+nb,gy-29,3.5,2.3,'#ffc94d');
  for(let i=0;i<4;i++)ell(gx-3+i*2.2,gy-11+(i%2),1,1,'#a0662a',false);
  person(cx+16,cy+10,'#ff8fab','#f1c27d',3);return 34;}
function dEstadio(b,cx,cy,hf){const h=14*hf;cyl(cx,cy,30,0,h,'#e85d75');
  X.beginPath();X.ellipse(cx,cy-h,30,15,0,0,Math.PI*2);X.fillStyle=tc('#5aa9ff');X.fill();X.strokeStyle=OUT;X.stroke();
  X.beginPath();X.ellipse(cx,cy-h,24,12,0,0,Math.PI*2);X.fillStyle=tc('#ffd23f');X.fill();X.beginPath();X.ellipse(cx,cy-h+1,18,9,0,0,Math.PI*2);X.fillStyle=tc('#4fcf5f');X.fill();X.strokeStyle='#fff';X.lineWidth=1;X.stroke();
  line(cx,cy-h-8,cx,cy-h+10,'rgba(255,255,255,.8)',1);for(let i=0;i<14;i++){const a=i/14*Math.PI*2;const j=Math.sin(TIME*8+i)*1.2;ell(cx+Math.cos(a)*27,cy-h+Math.sin(a)*13.5-1+j,1.3,1.3,['#fff','#ff5d6c','#2b2350'][i%3],false);}
  ball(cx+Math.sin(TIME*1.7)*10,cy-h-1+Math.cos(TIME*1.3)*4,2,'#ffffff');
  for(const [a,bb] of [[-.42,.42],[.42,.42],[.42,-.42],[-.42,-.42]]){const [x,y]=off(cx,cy,a,bb);line(x,y,x,y-h-30,'#6b5a8f',2);rr(x-5,y-h-36,10,6,2);X.fillStyle='#fff8dc';X.fill();X.stroke();if(!PREVIEW&&NIGHT>.15)LIGHTS.push({x,y:y-h-33,r:26,c:'rgba(255,250,210,.55)'});}return h+40;}
function dArena(b,cx,cy,hf){const h=22*hf;cyl(cx,cy,30,0,h,'#2a2350');for(let i=0;i<12;i++){const a=i/12*Math.PI;const x=cx-Math.cos(a)*29;const y=cy+Math.sin(a)*14.5;const hue=(TIME*90+i*30)%360;line(x,y-2,x,y-h+3,`hsl(${hue},100%,65%)`,1.6);}
  const hue=(TIME*60)%360;X.beginPath();X.ellipse(cx,cy-h,30,15,0,Math.PI,Math.PI*2);X.ellipse(cx,cy-h,30,24,0,0,Math.PI,true);X.closePath();
  X.fillStyle=`hsla(${hue},100%,70%,.35)`;X.fill();X.strokeStyle=`hsla(${hue},100%,75%,.9)`;X.lineWidth=1.5;X.stroke();
  X.save();X.translate(cx,cy-h-12);X.scale(1,.35);X.rotate(TIME);X.beginPath();X.arc(0,0,20,0,Math.PI*1.4);X.strokeStyle=`hsla(${(hue+120)%360},100%,70%,.9)`;X.lineWidth=4;X.stroke();X.restore();
  star(cx,cy-h-14,6,2.5,TIME*2,'#fff3a8');glow(cx,cy-h-10,40,`hsla(${hue},100%,70%,.6)`);return h+32;}
function dAquatico(b,cx,cy,hf){box(cx,cy,.94,.94,2,'#dff3ff');const [p1x,p1y]=off(cx,cy,.15,.15);water(p1x,p1y-2,18,9,'#38c5ff');const [p2x,p2y]=off(cx,cy,-.28,.22);water(p2x,p2y-2,9,4.5,'#5ad8ff');
  const [tx,ty]=off(cx,cy,-.2,-.25);const g=box(tx,ty,.22,.22,34*hf,'#ffd23f');const top=34*hf;
  for(let k=0;k<2;k++){X.beginPath();const c=k?'#ff5d6c':'#2fd08a';for(let i=0;i<=30;i++){const t=i/30;const a=t*Math.PI*3+k*Math.PI;const x=tx+Math.cos(a)*(10+k*4)+t*(k?18:24);const y=ty-top+t*(top-4)+Math.sin(a)*4+t*(k?6:12);i?X.lineTo(x,y):X.moveTo(x,y);}
    X.strokeStyle=tc(c);X.lineWidth=4;X.lineCap='round';X.stroke();}
  const sl=(TIME*.5)%1;ell(tx+Math.cos(sl*Math.PI*3)*10+sl*24,ty-top+sl*(top-4)+sl*12-2,2,2,'#ffd7b5',false);return top+10;}
function dCassino(b,cx,cy,hf){const h=28*hf;const g=box(cx,cy,.88,.88,h,'#7b2cbf');poly(quadF(g,0,.12,.88,3,14),'#2b1150',false);
  const [tx,ty]=fp(g,0,.5,9);X.font='9px "Lilita One",sans-serif';X.fillStyle='#ffd23f';X.textAlign='center';X.textBaseline='middle';X.fillText('SORTE!',tx,ty);glow(tx,ty,18,'rgba(255,210,63,.5)');
  for(let f=0;f<2;f++)for(let i=0;i<9;i++){const [x,y]=fp(g,f,(i+.5)/9,h-2);const on=(Math.floor(TIME*6)+i+f)%3===0;ell(x,y,1.6,1.6,on?'#fff3a8':'#a15ddf',false);if(on)glow(x,y,6,'rgba(255,240,150,.9)');}
  const [dx,dy]=off(cx,cy,-.02,-.02);const dg=box(dx,dy,.32,.32,18,'#ffffff',h);ell(dx,dy-h-18-5,1.8,1,'#2b2350',false);ell(dx-5,dy-h-18-2,1.8,1,'#2b2350',false);ell(dx+5,dy-h-18-8,1.8,1,'#2b2350',false);
  ell(...fp(dg,0,.5,9),1.8,1.8,'#ff4d6d',false);ell(...fp(dg,1,.3,13),1.4,1.4,'#2b2350',false);ell(...fp(dg,1,.7,5),1.4,1.4,'#2b2350',false);return h+28;}
// Indústria
function dMoinho(b,cx,cy,hf){box(cx,cy,.4,.4,3,'#c9b79c');const h=40*hf;X.beginPath();X.moveTo(cx-10,cy-3);X.lineTo(cx-5,cy-h);X.lineTo(cx+5,cy-h);X.lineTo(cx+10,cy-3);X.ellipse(cx,cy-3,10,5,0,0,Math.PI);X.closePath();
  const gr=X.createLinearGradient(cx-10,0,cx+10,0);gr.addColorStop(0,tc('#ffffff'));gr.addColorStop(1,tc('#c9cfe0'));X.fillStyle=gr;X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();
  conePts(cx,cy-h,7,8,'#ff5d6c');rr(cx-2.5,cy-12,5,8,2);X.fillStyle=tc('#8a5a3c');X.fill();const hy=cy-h+2;X.save();X.translate(cx-2,hy);X.rotate(TIME*2.2);
  for(let i=0;i<4;i++){X.rotate(Math.PI/2);X.beginPath();X.rect(1,-1.5,22,3);X.fillStyle=tc('#8b5a2b');X.fill();X.beginPath();X.rect(6,-1.5,15,7);X.fillStyle=tc('#fff8ec');X.fill();X.strokeStyle=OUT;X.lineWidth=.8;X.stroke();}X.restore();ball(cx-2,hy,2.5,'#6b5a8f');return h+26;}
function dFabrica(b,cx,cy,hf,tier){const h=24*hf;const g=box(cx,cy,.84,.84,h,'#d4c3ad');wins(g,3,1,'#ffeaa7',b.id,3,'#ffcf6e');
  poly(quadF(g,0,.38,.62,0,13),'#8b8fa3',false);for(let i=0;i<4;i++)line(...fp(g,0,.38,i*3+2),...fp(g,0,.62,i*3+2),'#6b6f85',1);
  for(let i=0;i<3;i++){const a=-.3+i*.28;const A=P(cx,cy,a-.12,.32,h),B=P(cx,cy,a+.12,.32,h),T=P(cx,cy,a+.12,-.32,h),T2=P(cx,cy,a-.12,-.32,h);poly([A,[A[0],A[1]-9],[T2[0],T2[1]-9],T2],'#9fd3ff');poly([A,B,T,T2],'#b0a08c',false);}
  for(let k=0;k<2;k++){const [x,y]=off(cx,cy,-.22+k*.3,-.3);cyl(x,y,5,h,22,'#e85d5d');ell(x,y-h-20,5,2.5,'#fff',false);smoke(x,y,h+24,true);}
  const [gx,gy]=fp(g,0,.2,h*.6);X.save();X.translate(gx,gy);X.rotate(TIME*1.5);X.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4;X.lineTo(Math.cos(a)*6,Math.sin(a)*6);X.lineTo(Math.cos(a+.39)*4.5,Math.sin(a+.39)*4.5);}X.closePath();X.fillStyle=tc('#ffd23f');X.fill();X.strokeStyle=OUT;X.stroke();X.restore();
  return h+28;}
function dDeposito(b,cx,cy,hf){const h=14*hf;const g=box(cx,cy,.86,.62,h,'#a3b8d6');for(let i=0;i<2;i++){const q=quadF(g,0,.12+i*.42,.46+i*.42,0,11);poly(q,'#e6ebf2',false);for(let k=1;k<4;k++)line(...fp(g,0,.12+i*.42,k*2.7),...fp(g,0,.46+i*.42,k*2.7),'#b5bfd0',1);}
  X.beginPath();const a=.43,bb=.31;const A=P(cx,cy,-a,bb,h),B=P(cx,cy,a,bb,h),C2=P(cx,cy,a,-bb,h);X.moveTo(...A);X.lineTo(...B);X.quadraticCurveTo((B[0]+C2[0])/2+4,(B[1]+C2[1])/2-14,...C2);X.lineTo(C2[0]-(B[0]-A[0]),C2[1]-(B[1]-A[1]));X.quadraticCurveTo((A[0]+C2[0]-(B[0]-A[0]))/2+4,(A[1]+C2[1]-(B[1]-A[1]))/2-14,...A);X.closePath();X.fillStyle=tc('#6f8fbf');X.fill();X.strokeStyle=OUT;X.stroke();
  const [fx,fy]=off(cx,cy,(TIME*.3+b.id*.2)%1*.8-.4,.5);box(fx,fy,.14,.09,4,'#ffb703',1);line(fx+5,fy-2,fx+5,fy-9,'#6b5a8f',1.2);box(fx+6,fy-4,.08,.08,3,'#c99a5b',4);return h+16;}
function dSolar(b,cx,cy){box(cx,cy,.94,.94,2,'#b8d88f');for(let r=0;r<3;r++)for(let c=0;c<2;c++){const [x,y]=off(cx,cy,-.22+c*.44,-.28+r*.28);
  const p=[P(x,y,-.18,.09,3),P(x,y,.18,.09,3),P(x,y,.18,-.09,9),P(x,y,-.18,-.09,9)];line(...P(x,y,0,0,0),...P(x,y,0,0,5),'#6b6f85',1.4);poly(p,'#2f4d9e');
  for(let k=1;k<3;k++){line(lerp(p[0][0],p[3][0],k/3),lerp(p[0][1],p[3][1],k/3),lerp(p[1][0],p[2][0],k/3),lerp(p[1][1],p[2][1],k/3),'#7fa6ff',.7);}
  const gl=(Math.sin(TIME*1.2+r+c)+1)/2;if(gl>.9){ell(lerp(p[0][0],p[2][0],.5),lerp(p[0][1],p[2][1],.5),3,1.5,'rgba(255,255,255,.8)',false);}}return 16;}
function dUsina(b,cx,cy,hf){const h=18*hf;const g=box(cx,cy,.86,.86,h,'#c2cee0');wins(g,3,1,'#9fe3ff',b.id);
  const [x,y]=off(cx,cy,-.1,-.12);const th=42*hf;X.beginPath();X.moveTo(x-20,y-h);X.quadraticCurveTo(x-11,y-h-th*.6,x-14,y-h-th);X.lineTo(x+14,y-h-th);X.quadraticCurveTo(x+11,y-h-th*.6,x+20,y-h);X.ellipse(x,y-h,20,10,0,0,Math.PI);X.closePath();
  const gr=X.createLinearGradient(x-20,0,x+20,0);gr.addColorStop(0,tc('#ffffff'));gr.addColorStop(1,tc('#aeb8cc'));X.fillStyle=gr;X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();
  ell(x,y-h-th,14,7,'#5b6378');line(x-17,y-h-th*.35,x+17,y-h-th*.35,'#ff7a59',3);
  if(!PREVIEW&&Math.random()<.2)parts.push({k:'smoke',x:x+rnd(-8,8),y:y-h-th,vx:rnd(-2,2),vy:rnd(-16,-10),t:0,life:3,r:rnd(7,11),c:'#ffffff'});
  const [bx,by]=fp(g,0,.5,h*.55);X.beginPath();X.moveTo(bx+1,by-6);X.lineTo(bx-3,by+1);X.lineTo(bx,by+1);X.lineTo(bx-1,by+6);X.lineTo(bx+3,by-1);X.lineTo(bx,by-1);X.closePath();X.fillStyle='#ffd23f';X.fill();X.strokeStyle=OUT;X.stroke();return h+th+8;}
function dRefinaria(b,cx,cy,hf){box(cx,cy,.92,.92,2,'#c7c2b8');const tk=[[-.22,-.2,'#9b5de5',12],[.2,-.2,'#ff5d6c',10],[-.2,.2,'#ff9f1c',9]];
  for(const [a,bb,c,r] of tk){const [x,y]=off(cx,cy,a,bb);cyl(x,y,r,2,20*hf,'#d9dde8');X.save();X.beginPath();X.ellipse(x,y-2-20*hf,r,r/2,0,0,Math.PI*2);X.clip();X.fillStyle=tc(c);X.fillRect(x-r,y-2-20*hf-r,r*2,r*2);X.restore();
    const lvl=(Math.sin(TIME+a*10)+1)/2;line(x+r-2,y-4,x+r-2,y-4-lvl*16*hf,c,2);if(Math.random()<.03&&!PREVIEW)parts.push({k:'steam',x:x+rnd(-4,4),y:y-22*hf,vx:0,vy:-12,t:0,life:1.2,r:2,c:c});}
  const [px,py]=off(cx,cy,.22,.22);line(px,py,px,py-38*hf,'#8a96b5',3);const fl=Math.sin(TIME*12)*2;poly([[px-3,py-38*hf],[px,py-46*hf-fl],[px+3,py-38*hf]],'#ffb703',false);glow(px,py-42*hf,12,'rgba(255,170,40,.8)');
  line(...off(cx,cy,-.22,-.05),...off(cx,cy,.2,-.05),'#8a96b5',2);return 50*hf;}
function dDistrib(b,cx,cy,hf){const h=22*hf;const g=box(cx,cy,.92,.72,h,'#7fb2ff');
  for(let i=0;i<3;i++){const q=quadF(g,0,i/3+.06,(i+1)/3-.06,0,13);poly(q,'#dfe6f2',false);for(let k=1;k<4;k++)line(...fp(g,0,i/3+.06,k*3.2),...fp(g,0,(i+1)/3-.06,k*3.2),'#a9b3c7',1);}
  wins(g,2,1,'#e0f7ff',b.id,2);const [x,y]=off(cx,cy,.18,-.12);box(x,y,.22,.22,10,'#c99a5b',h);box(x,y,.16,.16,8,'#d9ae6e',h+10);
  const [x2,y2]=off(cx,cy,-.22,-.1);box(x2,y2,.2,.2,9,'#b98447',h);const tp=(TIME*.25+b.id*.3)%1;const [tx,ty]=off(cx,cy,-.5+tp,.52);box(tx,ty,.22,.1,7,'#ff7a59');return h+22;}
function dFazendaV(b,cx,cy,hf){const h=56*hf;const g=box(cx,cy,.6,.6,h,'#d9f6ff');const n=Math.round(6*hf);
  for(let j=0;j<n;j++){const z0=h*j/n+1,z1=h*(j+.6)/n;for(let f=0;f<2;f++){face(g,f,.05,.95,z0,z1,'#7fd66a');for(let i=0;i<5;i++)ell(...fp(g,f,.12+i*.19,z1-1),1.8,1.4,'#3cb44b',false);}
    if(!PREVIEW&&NIGHT>.2)LIGHTS.push({p:quadF(g,0,.05,.95,z1,z1+2),c:'rgba(255,120,220,.6)',always:1});}
  box(cx,cy,.64,.64,3,'#9fd3ff',h);const [x,y]=off(cx,cy,0,0);ball(x,y-h-10,6,'#ff6b6b');line(x,y-h-16,x+3,y-h-19,'#3cb44b',2);return h+20;}
function dMina(b,cx,cy,hf){X.beginPath();const [a1,a2]=off(cx,cy,-.46,.46),[b1,b2]=off(cx,cy,.46,.46),[c1,c2]=off(cx,cy,.46,-.46);X.moveTo(a1,a2);X.lineTo(b1,b2);X.lineTo(c1,c2);X.quadraticCurveTo(cx+12,cy-50*hf,cx-6,cy-42*hf);X.quadraticCurveTo(cx-24,cy-30,a1,a2);X.closePath();
  const gr=X.createLinearGradient(cx-30,cy-40,cx+30,cy);gr.addColorStop(0,tc('#b5a08a'));gr.addColorStop(1,tc('#7d6b5a'));X.fillStyle=gr;X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();
  for(let i=0;i<4;i++){const x=cx-14+i*9,y=cy-16-(i%2)*10;poly([[x-3,y],[x,y-9],[x+3,y]],'#7df9ff');glow(x,y-4,9,'rgba(125,249,255,.6)');}
  const [mx,my]=off(cx,cy,-.05,.3);X.beginPath();X.arc(mx,my-6,8,Math.PI,0);X.lineTo(mx+8,my);X.lineTo(mx-8,my);X.closePath();X.fillStyle='#2b1d10';X.fill();X.strokeStyle=tc('#8b5a2b');X.lineWidth=2.5;X.stroke();
  const t=(TIME*.3)%1;const [rx,ry]=off(cx,cy,-.05+t*.4,.45);box(rx,ry,.14,.1,5,'#6b6f85',1);poly([P(rx,ry,-.05,0,6),P(rx,ry,0,0,10),P(rx,ry,.05,0,6)],'#7df9ff',false);
  line(...off(cx,cy,-.05,.45),...off(cx,cy,.4,.45),'#8a96b5',1.2);return 50*hf;}
function dRobos(b,cx,cy,hf){const h=24*hf;const g=box(cx,cy,.86,.86,h,'#b8c4d6');wins(g,4,1,'#9ff3ff',b.id,3,'#9ff3ff');poly(quadF(g,0,.35,.65,0,13),'#5b6378',false);
  const [bx,by]=off(cx,cy,-.05,-.05);cyl(bx,by,7,h,6,'#ffb703');const a1=Math.sin(TIME*1.5)*.6-1.2,a2=Math.sin(TIME*1.5+1)*.8+.6;
  const j1=[bx+Math.cos(a1)*18,by-h-6+Math.sin(a1)*18];const j2=[j1[0]+Math.cos(a1+a2)*14,j1[1]+Math.sin(a1+a2)*14];
  line(bx,by-h-6,...j1,'#ff9f1c',5);line(...j1,...j2,'#ff9f1c',4);ball(...j1,3,'#5b6378');ball(bx,by-h-6,3.5,'#5b6378');line(j2[0]-3,j2[1],j2[0]-5,j2[1]+4,'#5b6378',2);line(j2[0]+3,j2[1],j2[0]+5,j2[1]+4,'#5b6378',2);
  const sp=Math.sin(TIME*10)>.5;if(sp){ell(j2[0],j2[1]+5,2,2,'#7df9ff',false);glow(j2[0],j2[1]+5,9,'rgba(125,249,255,.9)');}return h+30;}
// Tecnologia
function dPesq(b,cx,cy,hf){const h=26*hf;const g=box(cx,cy,.76,.76,h,'#f2f6ff');for(let f=0;f<2;f++)for(let i=0;i<4;i++)face(g,f,(i+.1)/4,(i+.9)/4,4,h-4,'#9fd8ff');
  const [dx,dy]=off(cx,cy,-.08,-.08);line(dx,dy-h,dx,dy-h-8,'#6b5a8f',2);X.save();X.translate(dx,dy-h-12);X.rotate(-.5+Math.sin(TIME*.5)*.3);X.beginPath();X.ellipse(0,0,11,5,0,0,Math.PI*2);X.fillStyle=tc('#ffffff');X.fill();X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();
  line(0,0,0,-10,'#6b5a8f',1.2);ell(0,-10,1.6,1.6,'#ff5d6c',false);X.restore();const [ax,ay]=off(cx,cy,.22,-.22);line(ax,ay-h,ax,ay-h-22,'#9aa7c7',1.5);if(Math.sin(TIME*5)>0)glow(ax,ay-h-22,8,'rgba(255,90,110,.9)');return h+26;}
function dAntena(b,cx,cy,hf){box(cx,cy,.5,.5,6,'#c9cfe0');const h=78*hf;const L=[cx-12,cy-6],R=[cx+12,cy-6],T=[cx,cy-h];line(...L,...T,'#ff5d6c',2.2);line(...R,...T,'#ff5d6c',2.2);
  for(let k=1;k<8;k++){const t=k/8;const xl=lerp(L[0],T[0],t),yl=lerp(L[1],T[1],t),xr=lerp(R[0],T[0],t),yr=lerp(R[1],T[1],t);line(xl,yl,xr,yr,'#ffffff',1.2);if(k%2)line(xl,yl,lerp(R[0],T[0],t+1/8),lerp(R[1],T[1],t+1/8),'#e9e9ef',.8);}
  ell(T[0],T[1],2.5,2.5,'#ff4d6d',false);glow(T[0],T[1],10,'rgba(255,77,109,.9)');for(let i=0;i<3;i++){const r=((TIME*16+i*10)%30)+4;X.beginPath();X.arc(T[0],T[1],r,-Math.PI*.8,-Math.PI*.2);X.strokeStyle=`rgba(125,249,255,${1-r/34})`;X.lineWidth=1.5;X.stroke();}return h+6;}
function dRobotica(b,cx,cy,hf){const h=22*hf;const g=box(cx,cy,.82,.82,h,'#fff1e0');face(g,0,0,1,h-5,h,'#ff7a1a');face(g,1,0,1,h-5,h,'#ff7a1a');wins(g,3,1,'#bfeeff',b.id);
  const hd=box(cx,cy,.42,.4,22,'#c9d2e4',h);const e1=fp(hd,0,.3,13),e2=fp(hd,0,.7,13);const bl=Math.sin(TIME*3)>-.9;for(const e of [e1,e2]){ell(e[0],e[1],2.6,bl?2.6:.5,'#7df9ff',false);glow(e[0],e[1],7,'rgba(125,249,255,.9)');}
  const m=fp(hd,0,.5,6);rr(m[0]-5,m[1]-1,10,3,1.5);X.fillStyle='#2b2350';X.fill();const [ax,ay]=P(cx,cy,0,0,h+22);line(ax,ay,ax+3,ay-12,'#6b5a8f',1.4);ball(ax+3,ay-13,2.4,'#ff5d6c');return h+38;}
function dLab(b,cx,cy,hf){const h=26*hf;const g=box(cx,cy,.82,.82,h,'#eef3ff');wins(g,3,2,'#a6f7c9',b.id,3,'#8affc1');
  const y=cy-h;X.save();X.beginPath();X.ellipse(cx,y,18,9,0,0,Math.PI);X.ellipse(cx,y,18,17,0,Math.PI,Math.PI*2);X.closePath();X.clip();
  X.fillStyle=tc('#3bdc8c');X.fillRect(cx-18,y-8+Math.sin(TIME*2)*2,36,30);for(let i=0;i<4;i++){const p=(TIME*.5+i*.25)%1;ell(cx-9+i*6,y+4-p*18,2,2,'rgba(255,255,255,.7)',false);}X.restore();
  dome(cx,cy,18,h,'rgba(200,240,255,.35)',17);glow(cx,y-6,24,'rgba(80,255,170,.35)');line(cx+10,y-12,cx+16,y-28,'#6b5a8f',1.5);if(Math.sin(TIME*9)>.3){ell(cx+16,y-29,3,3,'#7df9ff',false);glow(cx+16,y-29,12,'rgba(125,249,255,.8)');}return h+32;}
function dIA(b,cx,cy,hf){const h=20*hf;const g=box(cx,cy,.82,.82,h,'#1d1b3a');for(let f=0;f<2;f++)for(let i=0;i<6;i++){const p=quadF(g,f,(i+.3)/6,(i+.5)/6,3,h-3);poly(p,'#38b6ff',false);if(!PREVIEW)LIGHTS.push({p,c:'#38b6ff',always:1});}
  const y=cy-h-26+Math.sin(TIME*1.5)*3;const gr=X.createRadialGradient(cx,y,2,cx,y,20);gr.addColorStop(0,'rgba(255,170,230,.95)');gr.addColorStop(1,'rgba(255,100,200,.15)');X.beginPath();X.ellipse(cx,y,18,14,0,0,Math.PI*2);X.fillStyle=gr;X.fill();
  X.strokeStyle='rgba(255,255,255,.8)';X.lineWidth=1.3;for(let i=0;i<4;i++){X.beginPath();X.arc(cx-8+i*5,y-2+(i%2)*4,5,Math.PI*.2,Math.PI*1.3);X.stroke();}line(cx,y-13,cx,y+13,'rgba(255,255,255,.6)',1);
  for(let i=0;i<6;i++){const t=(TIME*.8+i/6)%1;ell(cx+Math.cos(i)*14*(1-t),y+16+t*(h-6),1.2,1.2,'#7df9ff',false);}glow(cx,y,34,'rgba(255,120,210,.55)');return h+44;}
function dComplexo(b,cx,cy,hf){box(cx,cy,.96,.96,3,'#dfe7f5');const ds=[[-.25,-.22,14,'#9ff3ff'],[.24,-.2,11,'#c9a8ff'],[-.2,.25,10,'#7ef0b7']];
  for(const [a,bb,r,c] of ds){const [x,y]=off(cx,cy,a,bb);cyl(x,y,r,3,6,'#eef3ff');dome(x,y,r,9,c,r*.9);}
  line(...P(cx,cy,-.25,-.22,9),...P(cx,cy,.24,-.2,9),'rgba(200,245,255,.9)',4);line(...P(cx,cy,-.25,-.22,9),...P(cx,cy,-.2,.25,9),'rgba(200,245,255,.9)',4);
  const [sx,sy]=off(cx,cy,.18,.18);cyl(sx,sy,6,3,70*hf,'#c9d6e8');conePts(sx,sy-73*hf,6,18,'#9ff3ff');const hue=(TIME*60)%360;glow(sx,sy-80*hf,26,`hsla(${hue},100%,70%,.7)`);return 96*hf;}
// Serviços
function dEscola(b,cx,cy,hf){const h=22*hf;const g=box(cx,cy,.86,.64,h,'#ffe07a');face(g,0,0,1,0,4,'#e05d5d');face(g,1,0,1,0,4,'#e05d5d');wins(g,4,2,'#c6f1ff',b.id);
  pyramid(cx,cy,.9,.68,h,8,'#e05d5d');const [tx,ty]=off(cx,cy,0,0);box(tx,ty,.18,.18,12,'#fff4cc',h+4);pyramid(tx,ty,.22,.22,h+16,8,'#e05d5d');const c=P(tx,ty,-.09,.09,h+10);
  X.beginPath();X.arc(c[0]+3,c[1],2.4,0,Math.PI*2);X.fillStyle='#fff';X.fill();X.stroke();const [px,py]=off(cx,cy,.3,.48);line(px,py,px-6,py-10,'#ff5d6c',2.5);line(px-6,py-10,px-6,py-14,'#6b5a8f',1.2);
  const [bx,by]=off(cx,cy,-.28,.5);box(bx,by,.3,.12,6,'#ffc21a',1);return h+30;}
function dUniv(b,cx,cy,hf){const h=24*hf;const g=box(cx,cy,.94,.6,h,'#e9dccb');for(let i=0;i<7;i++)face(g,0,(i+.35)/7,(i+.6)/7,0,h-4,'#fffaf0');wins(g,3,2,'#bfe3ff',b.id,2);
  gableA(cx,cy,.98,.64,h,9,'#a63d40');const [tx,ty]=off(cx,cy,0,0);const tg=box(tx,ty,.26,.26,18*hf,'#f2e6d6',h+4);wins(tg,1,2,'#bfe3ff',b.id+3);dome(tx,ty,9,h+4+18*hf,'#4b7bec',9);
  const [cx2,cy2]=P(tx,ty,0,0,h+4+18*hf+12);X.save();X.translate(cx2,cy2);X.rotate(Math.sin(TIME)*.1);poly([[-8,0],[0,-4],[8,0],[0,4]],'#2b2350');line(6,0,7,6,'#ffd23f',1.2);X.restore();return h+18*hf+30;}
function dHospital(b,cx,cy,hf){const h=38*hf;const g=box(cx,cy,.8,.8,h,'#ffffff');wins(g,4,Math.round(4*hf),'#bfe8ff',b.id);
  const c=fp(g,0,.5,h-10);rr(c[0]-7,c[1]-7,14,14,3);X.fillStyle=tc('#ffffff');X.fill();X.fillStyle='#ff4d6d';X.fillRect(c[0]-6,c[1]-2,12,4);X.fillRect(c[0]-2,c[1]-6,4,12);
  X.beginPath();X.ellipse(cx,cy-h,13,6.5,0,0,Math.PI*2);X.fillStyle='#2b2350';X.fill();X.font='8px "Lilita One",sans-serif';X.fillStyle='#ffd23f';X.textAlign='center';X.textBaseline='middle';X.fillText('H',cx,cy-h+.5);
  const [ax,ay]=off(cx,cy,-.2,.52);box(ax,ay,.26,.12,7,'#ffffff',1);ell(...P(ax,ay,0,0,9),1.6,1.2,Math.sin(TIME*8)>0?'#ff4d6d':'#5aa9ff',false);return h+6;}
function dPolicia(b,cx,cy,hf){const h=22*hf;const g=box(cx,cy,.78,.7,h,'#4b7bec');face(g,0,0,1,h-4,h,'#ffffff');face(g,1,0,1,h-4,h,'#ffffff');wins(g,3,1,'#dcefff',b.id);poly(quadF(g,0,.42,.6,0,10),'#1d3a7a',false);
  const s=fp(g,0,.5,h+4);star(s[0],s[1]-4,7,3,0,'#ffd23f');const on=Math.sin(TIME*10)>0;const [lx,ly]=P(cx,cy,.1,-.1,h);rr(lx-5,ly-4,10,4,2);X.fillStyle=on?'#ff4d6d':'#5aa9ff';X.fill();glow(lx,ly-2,12,on?'rgba(255,77,109,.8)':'rgba(90,169,255,.8)');
  const [ax,ay]=off(cx,cy,.22,.5);box(ax,ay,.24,.12,5,'#ffffff',1);box(ax,ay,.14,.1,3,'#2b2350',6);return h+14;}
function dBombeiros(b,cx,cy,hf){const h=24*hf;const g=box(cx,cy,.8,.7,h,'#e03131');for(let i=0;i<3;i++){const q=quadF(g,0,.08+i*.3,.32+i*.3,0,14);poly(q,'#ffe8e8',false);for(let k=1;k<4;k++)line(...fp(g,0,.08+i*.3,k*3.5),...fp(g,0,.32+i*.3,k*3.5),'#f2b8b8',1);}
  face(g,1,0,1,h-5,h,'#ffd23f');const [tx,ty]=off(cx,cy,.25,-.2);const tg=box(tx,ty,.16,.16,22,'#c92a2a',h);pyramid(tx,ty,.22,.22,h+22,6,'#2b2350');
  const [ax,ay]=off(cx,cy,-.15,.5);box(ax,ay,.32,.12,7,'#e03131',1);line(...P(ax,ay,-.14,0,9),...P(ax,ay,.18,0,12),'#d9d2e8',2);return h+32;}
function dOnibus(b,cx,cy,hf){box(cx,cy,.92,.92,2,'#c9cfe0');for(const a of [-.35,.35])for(const bb of [-.25,.25]){const p=P(cx,cy,a,bb,2);line(p[0],p[1],p[0],p[1]-18,'#6b6f85',2);}
  box(cx,cy,.84,.62,3,'#38b6ff',20);const bt=(Math.sin(TIME*.4)+1)/2;const [bx,by]=off(cx,cy,-.25+bt*.5,.05);const bus=box(bx,by,.5,.18,9,S.tech&&S.tech.tra2?'#2fd08a':'#ffc21a',3);wins(bus,4,1,'#dcf5ff',1,1);
  const [sx,sy]=off(cx,cy,.46,.46);line(sx,sy,sx,sy-24,'#6b5a8f',1.6);sign(sx,sy-26,'BUS','#38b6ff','#fff',7);return 30;}
function dMetro(b,cx,cy,hf){box(cx,cy,.9,.9,3,'#d9d2e8');const [ex,ey]=off(cx,cy,-.05,.05);poly([P(ex,ey,-.28,.3,3),P(ex,ey,.28,.3,3),P(ex,ey,.18,-.1,3),P(ex,ey,-.18,-.1,3)],'#2b2350');
  for(let i=0;i<4;i++)line(...P(ex,ey,-.22+i*.02,.25-i*.09,3),...P(ex,ey,.22-i*.02,.25-i*.09,3),'#6b6f85',1);
  X.beginPath();const A=P(ex,ey,-.32,.34,3),B=P(ex,ey,.32,.34,3);X.moveTo(...A);X.quadraticCurveTo(ex,ey-24,...B);X.strokeStyle=tc('#9fd8ff');X.lineWidth=4;X.stroke();
  const [px,py]=off(cx,cy,.36,-.3);line(px,py,px,py-30*hf,'#6b5a8f',2);rr(px-7,py-30*hf-14,14,14,3);X.fillStyle=tc('#ff4d6d');X.fill();X.stroke();X.font='11px "Lilita One",sans-serif';X.fillStyle='#fff';X.textAlign='center';X.textBaseline='middle';X.fillText('M',px,py-30*hf-6.5);
  if(NIGHT>.2)glow(px,py-30*hf-7,14,'rgba(255,90,110,.7)');return 30*hf+16;}
function dAeroporto(b,cx,cy,hf){box(cx,cy,.96,.96,2,'#c9cfe0');const g=box(cx,cy,.9,.4,14,'#dff3ff',2);for(let i=0;i<6;i++)face(g,0,(i+.1)/6,(i+.9)/6,3,12,'#9fd8ff');
  X.beginPath();const A=P(cx,cy,-.45,.2,16),B=P(cx,cy,.45,.2,16);X.moveTo(...A);X.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2-12,...B);X.strokeStyle=tc('#ffffff');X.lineWidth=5;X.stroke();
  const [tx,ty]=off(cx,cy,.3,-.32);cyl(tx,ty,4,2,40*hf,'#ffffff');cyl(tx,ty,8,42*hf,7,'#6fd0ff');if(Math.sin(TIME*3)>0)glow(tx,ty-50*hf,10,'rgba(255,90,110,.9)');
  const [px,py]=off(cx,cy,-.2,.42);X.save();X.translate(px,py-4);X.fillStyle=tc('#ffffff');X.strokeStyle=OUT;X.lineWidth=1.2;X.beginPath();X.ellipse(0,0,13,3.5,-.46,0,Math.PI*2);X.fill();X.stroke();
  X.beginPath();X.moveTo(-2,0);X.lineTo(-9,7);X.lineTo(3,1);X.closePath();X.fillStyle=tc('#ff5d6c');X.fill();X.stroke();X.restore();return 50*hf+8;}
// Natureza
function dJardim(b,cx,cy){poly(tilePolyAt(cx,cy,.88),'#7fd66a');for(let i=0;i<3;i++){const [x,y]=off(cx,cy,-.26+i*.26,-.1);X.beginPath();X.ellipse(x,y,9,4.5,0,0,Math.PI*2);X.fillStyle=tc('#6b4a2b');X.fill();
  for(let k=0;k<6;k++){const h=hash(b.id*13+i*7+k);ell(x-6+(h%12),y-2+((h>>4)%5),1.8,1.6,['#ff6fa0','#ffd23f','#ffffff','#c9a8ff','#ff8f1f'][k%5],false);}}
  for(let i=0;i<3;i++){const [x,y]=off(cx,cy,-.3+i*.3,.3);ball(x,y-3,4,'#3cb44b');}const t=TIME*1.5+b.id;const bx=cx+Math.sin(t)*14,by=cy-10+Math.cos(t*1.3)*5;const fl=Math.abs(Math.sin(TIME*12))*3;ell(bx-fl/2,by,fl,2,'#ffd23f',false);ell(bx+fl/2,by,fl,2,'#ff8f1f',false);return 14;}
function dPraca(b,cx,cy,hf){poly(tilePolyAt(cx,cy,.92),'#e7e1d6');poly(tilePolyAt(cx,cy,.6),'#d6cfc2',false);const h=10*hf;
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const x=cx+Math.cos(a)*11,y=cy-2+Math.sin(a)*5.5;line(x,y,x,y-h-2,'#ffffff',1.6);}cyl(cx,cy,13,0,2,'#fff8ec');
  X.beginPath();X.moveTo(cx-15,cy-h-2);X.lineTo(cx,cy-h-16);X.lineTo(cx+15,cy-h-2);X.ellipse(cx,cy-h-2,15,7.5,0,0,Math.PI);X.closePath();X.fillStyle=tc('#4b7bec');X.fill();X.strokeStyle=OUT;X.stroke();
  const [bx,by]=off(cx,cy,-.38,.1);box(bx,by,.08,.24,3,'#8b5a2b',1);const [tx,ty]=off(cx,cy,.38,-.32);tree(tx,ty,.7,treeCols()[0]);person(cx+8,cy+10,'#2fd08a','#e0ac69',b.id);return h+20;}
function dLago(b,cx,cy){poly(tilePolyAt(cx,cy,.94),'#7fd66a',false);water(cx,cy,24,12,'#4fc3f7');for(let i=0;i<3;i++){const [x,y]=[cx-12+i*11,cy+2-(i%2)*6];ell(x,y,3,1.5,'#3cb44b',false);}
  for(let i=0;i<2;i++){const a=TIME*.5+i*Math.PI;const x=cx+Math.cos(a)*13,y=cy+Math.sin(a)*5;ell(x,y-2,3.5,2.5,'#ffffff');ball(x+2*Math.sign(-Math.sin(a)||1),y-5,2,'#ffffff');poly([[x+3.5*Math.sign(-Math.sin(a)||1),y-5],[x+6*Math.sign(-Math.sin(a)||1),y-4.5],[x+3.5*Math.sign(-Math.sin(a)||1),y-4]],'#ff9f1c',false);}
  for(let i=0;i<4;i++){const [x,y]=off(cx,cy,.38,-.3+i*.12);line(x,y,x+Math.sin(TIME+i)*1,y-9,'#3c8f3c',1.4);ell(x,y-9,1,2.2,'#8b5a2b',false);}return 12;}
function dBosque(b,cx,cy,hf){const t=[[-.25,-.25,1,'pine'],[.22,-.25,.9,'round'],[0,0,1.2*hf,'round'],[-.25,.22,.8,'round'],[.25,.2,1,'pine']];for(const [a,bb,s,k] of t){const [x,y]=off(cx,cy,a,bb);if(k==='pine')pine(x,y,s,'#2e7d4f');else tree(x,y,s,'#3cb44b','#2e9e5b');}
  const [mx,my]=off(cx,cy,.05,.4);ell(mx,my-3,3.5,2.2,'#ff4d6d');for(let i=0;i<3;i++)ell(mx-2+i*2,my-3.6,.6,.6,'#fff',false);return 30*hf;}
function dFonte(b,cx,cy,hf){poly(tilePolyAt(cx,cy,.9),'#e7e1d6');cyl(cx,cy,22,0,5,'#c9d3e8');ell(cx,cy-5,19,9.5,'#6fd0ff',false);cyl(cx,cy,10,5,6,'#d6deee');ell(cx,cy-11,8,4,'#8fe0ff',false);cyl(cx,cy,3,11,10,'#d6deee');
  const n=12;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;const hgt=(12+Math.sin(TIME*3+i)*6)*hf;const hue=(TIME*60+i*30)%360;const c=NIGHT>.25?`hsl(${hue},90%,70%)`:'#e0f7ff';
    X.beginPath();X.moveTo(cx+Math.cos(a)*6,cy-11+Math.sin(a)*3);X.quadraticCurveTo(cx+Math.cos(a)*12,cy-11-hgt+Math.sin(a)*6,cx+Math.cos(a)*17,cy-5+Math.sin(a)*8.5);X.strokeStyle=c;X.lineWidth=1.5;X.stroke();if(NIGHT>.25)glow(cx+Math.cos(a)*12,cy-11-hgt*.6,8,`hsla(${hue},90%,70%,.6)`);}
  const jh=(18+Math.sin(TIME*4)*5)*hf;line(cx,cy-21,cx,cy-21-jh,'#e0f7ff',2.5);return 26+jh;}
function dBotanico(b,cx,cy,hf){poly(tilePolyAt(cx,cy,.94),'#7fd66a');const y=cy;X.save();X.beginPath();X.ellipse(cx,y,26,13,0,0,Math.PI);X.ellipse(cx,y,26,32*hf,0,Math.PI,Math.PI*2);X.closePath();X.clip();
  for(let i=0;i<6;i++){const x=cx-20+i*8;tree(x,y+4-(i%2)*4,.9+(i%3)*.2,['#3cb44b','#7ef0b7','#2e9e5b'][i%3]);}palm(cx+4,y+6,.9);X.restore();
  X.beginPath();X.ellipse(cx,y,26,13,0,0,Math.PI);X.ellipse(cx,y,26,32*hf,0,Math.PI,Math.PI*2);X.closePath();X.fillStyle='rgba(200,240,255,.28)';X.fill();X.strokeStyle=tc('#ffffff');X.lineWidth=1.5;X.stroke();
  for(let k=1;k<4;k++){X.beginPath();X.ellipse(cx,y,26*k/4,32*hf,0,Math.PI,Math.PI*2);X.strokeStyle='rgba(255,255,255,.6)';X.lineWidth=1;X.stroke();}return 34*hf;}
function dPraia(b,cx,cy){const tp=tilePolyAt(cx,cy,.96);poly(tp,'#f6dc8f',false);X.save();X.beginPath();X.moveTo(...tp[1]);X.lineTo(...tp[2]);X.lineTo(...tp[3]);X.closePath();X.clip();water(cx+10,cy+10,34,16,'#3bc6ff');X.restore();
  const wv=Math.sin(TIME*2)*2;X.beginPath();X.moveTo(tp[1][0]-6+wv,tp[1][1]+2);X.quadraticCurveTo(cx,cy+2+wv,tp[3][0]+6+wv,tp[3][1]-2);X.strokeStyle='rgba(255,255,255,.9)';X.lineWidth=2;X.stroke();
  for(let i=0;i<2;i++){const [x,y]=off(cx,cy,-.25+i*.22,-.25+i*.05);line(x,y,x,y-14,'#6b5a8f',1.2);X.beginPath();X.moveTo(x-10,y-12);X.quadraticCurveTo(x,y-22,x+10,y-12);X.closePath();X.fillStyle=tc(i?'#ff5d6c':'#ffd23f');X.fill();X.strokeStyle=OUT;X.stroke();}
  const [tx,ty]=off(cx,cy,-.05,-.4);rr(tx-6,ty-2,12,5,1.5);X.fillStyle=tc('#5aa9ff');X.fill();ball(cx+Math.sin(TIME*1.5)*6,cy-6-Math.abs(Math.sin(TIME*3))*8,3.5,'#ffffff');palm(cx-24,cy-4,.8);return 24;}
// Extravagantes
function dHotelG(b,cx,cy,hf){const h=70*hf;const g=box(cx,cy,.7,.56,h,'#f7e1c8');const n=Math.round(8*hf);for(let j=0;j<n;j++){const z=h*(j+.5)/n;face(g,0,0,1,z-1.5,z,'#e0b98a');}wins(g,4,n,'#bfe3ff',b.id,3);
  const [sx,sy]=fp(g,1,.85,h*.5);rr(sx-4,sy-28,8,56,3);X.fillStyle=tc('#c92a2a');X.fill();X.stroke();X.font='7px "Lilita One",sans-serif';X.fillStyle='#fff3a8';X.textAlign='center';X.textBaseline='middle';'HOTEL'.split('').forEach((c,i)=>X.fillText(c,sx,sy-21+i*10));
  if(NIGHT>.2)glow(sx,sy,24,'rgba(255,90,90,.55)');box(cx,cy,.74,.6,3,'#c9a37a',h);const [px,py]=off(cx,cy,.05,.05);ell(px,py-h-3.5,12,4.5,'#4fd0ff',false);return h+10;}
function dDoces(b,cx,cy,hf){cyl(cx,cy,16,0,12,'#b5651d');X.beginPath();X.ellipse(cx,cy-12,17,8.5,0,0,Math.PI*2);X.fillStyle=tc('#ff9ccf');X.fill();X.strokeStyle=OUT;X.stroke();for(let i=0;i<8;i++)ell(cx-12+i*3.4,cy-13+Math.sin(i)*3,1.2,.6,COL4[i%4],false);
  const h=56*hf;line(cx,cy-14,cx,cy-h,'#ffffff',4);line(cx,cy-14,cx,cy-h,'#ff6fa0',1.4);const y=cy-h-12;X.save();X.translate(cx,y);X.rotate(TIME*1.2);X.beginPath();X.arc(0,0,15,0,Math.PI*2);X.fillStyle=tc('#fff');X.fill();X.strokeStyle=OUT;X.lineWidth=1.4;X.stroke();
  for(let k=0;k<3;k++){X.beginPath();for(let i=0;i<=40;i++){const t=i/40;const a=t*Math.PI*4+k*2.1;const r=t*14;i?X.lineTo(Math.cos(a)*r,Math.sin(a)*r):X.moveTo(0,0);}X.strokeStyle=tc(['#ff5d6c','#2fd08a','#5aa9ff'][k]);X.lineWidth=3;X.stroke();}X.restore();
  for(const s of [-1,1]){const [x,y2]=off(cx,cy,s*.4,.3);line(x,y2,x,y2-18,'#ffffff',3);line(x,y2,x,y2-18,'#ff4d6d',1);X.beginPath();X.arc(x+3*s,y2-18,3,Math.PI,s>0?0:Math.PI*2);X.strokeStyle=tc('#ff4d6d');X.lineWidth=3;X.stroke();}return h+28;}
function dBule(b,cx,cy,hf){const r=24*hf;const y=cy-r-2;X.beginPath();X.moveTo(cx+r*.8,y);X.quadraticCurveTo(cx+r*1.5,y-2,cx+r*1.7,y-r*.7);X.lineTo(cx+r*1.55,y-r*.75);X.quadraticCurveTo(cx+r*1.3,y-r*.1,cx+r*.7,y+r*.3);X.closePath();X.fillStyle=tc('#4fb0d9');X.fill();X.strokeStyle=OUT;X.stroke();
  X.beginPath();X.arc(cx-r*.95,y,r*.45,Math.PI*.5,Math.PI*1.5);X.strokeStyle=tc('#4fb0d9');X.lineWidth=5;X.stroke();ball(cx,y,r,'#5fc3eb');
  for(let j=0;j<3;j++)for(let i=0;i<4;i++){const x=cx-r*.6+i*r*.38,yy=y-r*.45+j*r*.38;if(Math.hypot(x-cx,yy-y)>r*.82)continue;rr(x-2.5,yy-3,5,6,1.5);X.fillStyle=tc('#dff6ff');X.fill();if(!PREVIEW&&NIGHT>.25&&hash(b.id+i*3+j)%2)LIGHTS.push({x,y:yy,r:5,c:'rgba(255,235,150,.9)'});}
  X.beginPath();X.ellipse(cx,y-r*.92,r*.5,r*.2,0,0,Math.PI*2);X.fillStyle=tc('#3b8fbf');X.fill();X.stroke();ball(cx,y-r*1.1,4,'#ffd23f');X.beginPath();X.moveTo(cx-r*.95,y+r*.75);X.lineTo(cx+r*.95,y+r*.75);X.strokeStyle=OUT;X.stroke();
  if(!PREVIEW&&Math.random()<.08)parts.push({k:'steam',x:cx+r*1.7,y:y-r*.75,vx:3,vy:-12,t:0,life:1.6,r:3});return r*2+12;}
function dCastelo(b,cx,cy,hf){const h=18*hf;const g=box(cx,cy,.82,.82,h,'#ffc6e0');for(let f=0;f<2;f++)for(let i=0;i<6;i++)if(i%2===0)poly(quadF(g,f,i/6,(i+1)/6,h,h+5),'#ffc6e0');
  poly(quadF(g,0,.38,.62,0,12),'#9b5de5',false);const keep=box(cx,cy,.36,.36,26*hf,'#ffb3d1',h);wins(keep,1,2,'#fff3a8',b.id,3,'#fff3a8');const kt=h+26*hf;conePts(cx,cy-kt,12,22,'#9b5de5');
  for(const [a,bb] of [[.38,-.38],[-.38,.38],[.38,.38]]){const [x,y]=off(cx,cy,a,bb);cyl(x,y,6.5,0,32*hf,'#ff8fc8');for(let k=0;k<3;k++)line(x-6,y-8-k*9*hf,x+6,y-11-k*9*hf,'#ffffff',2);conePts(x,y-32*hf,8,15,['#9b5de5','#ffd23f','#3ad7c9'][(a>0)+(bb>0)-1]);}return kt+24;}
function conePts(x,y,r,h,c){X.beginPath();X.moveTo(x-r,y);X.lineTo(x,y-h);X.lineTo(x+r,y);X.ellipse(x,y,r,r/2,0,0,Math.PI);X.closePath();X.fillStyle=tc(c);X.fill();X.strokeStyle=OUT;X.lineWidth=1.2;X.stroke();line(x-r*.4,y-h*.45,x+r*.45,y-h*.3,'rgba(255,255,255,.7)',1.5);}
function dResort(b,cx,cy,hf){box(cx,cy,.94,.94,2,'#f6dc8f');const [px,py]=off(cx,cy,.12,.12);ell(px,py-2,18,9,'#e9e2d0');water(px,py-2.5,15,7.5,'#3bc6ff');
  for(const [a,bb] of [[-.3,-.25],[.25,-.32],[-.32,.18]]){const [x,y]=off(cx,cy,a,bb);box(x,y,.2,.2,9*hf,'#f4e2c4',2);pyramid(x,y,.3,.3,2+9*hf,10,'#c9a066');}palm(cx+22,cy-6,.8);palm(cx-6,cy+10,.7);return 26;}
function dDourada(b,cx,cy,hf){let z=0;const sz=[.62,.5,.38,.28],hs=[30,26,22,18];const pg=TINT;TINT=gold;
  for(let i=0;i<4;i++){const g=box(cx,cy,sz[i],sz[i],hs[i]*hf,'#f2b21c',z);wins(g,2,2,'#fff3b0',b.id+i,3,'#fff1a8');z+=hs[i]*hf;}
  TINT=pg;const y=cy-z-14;line(cx,cy-z,cx,y,'#b88300',2);star(cx,y,9,4,Math.sin(TIME*2)*.2,'#fff1a8');glow(cx,y,26,'rgba(255,220,100,.6)');
  if(!PREVIEW&&Math.random()<.05)parts.push({k:'spark',x:cx+rnd(-20,20),y:cy-rnd(10,z),vx:0,vy:-6,t:0,life:.8,c:'#fff3b0'});return z+26;}
function dPiramide(b,cx,cy,hf){const pg=TINT;TINT=gold;let z=0;const n=5;for(let i=0;i<n;i++){const s=.92-i*.17;box(cx,cy,s,s,9*hf,'#e8b83a',z);z+=9*hf;}TINT=pg;
  pyramid(cx,cy,.16,.16,z,12,'#fff6c4');const pulse=.5+.5*Math.sin(TIME*2.5);glow(cx,cy-z-8,30,`rgba(255,240,150,${.4+pulse*.4})`);
  const [dx,dy]=fp({cx,cy,a:.46,b:.46,z0:0,h:9},0,.5,0);rr(dx-4,dy-9,8,9,2);X.fillStyle='#5a3a00';X.fill();return z+16;}
function dNeon(b,cx,cy,hf){const h=110*hf;const g=box(cx,cy,.62,.62,h,'#231f45');wins(g,3,10,'#3a3470',b.id,3,'#9ef0ff');
  for(let k=0;k<5;k++){const hue=(TIME*60+k*50+b.id*30)%360;const c=`hsl(${hue},100%,62%)`;for(let f=0;f<2;f++){const q=quadF(g,f,0,1,h*(k+.5)/5-1,h*(k+.5)/5+1.5);X.beginPath();X.moveTo(...q[0]);X.lineTo(...q[1]);X.lineTo(...q[2]);X.lineTo(...q[3]);X.closePath();X.fillStyle=c;X.fill();if(!PREVIEW)LIGHTS.push({p:q,c,always:1});}}
  const tz=cy-h;line(cx,tz,cx,tz-30,'#9ef0ff',2.5);glow(cx,tz-30,16,`hsla(${(TIME*80)%360},100%,70%,.9)`);ell(cx,tz-30,2.5,2.5,'#fff',false);return h+34;}
function dIlha(b,cx,cy,hf){const bob=Math.sin(TIME*1.2+b.id)*4;ell(cx,cy,22,11,'rgba(43,35,80,.18)',false);const z=34+bob;const y=cy-z;
  X.beginPath();X.moveTo(cx-24,y);X.quadraticCurveTo(cx-14,y+20,cx,y+34);X.quadraticCurveTo(cx+14,y+20,cx+24,y);X.closePath();X.fillStyle=tc('#9b6b43');X.fill();X.strokeStyle=OUT;X.stroke();
  line(cx-8,y+8,cx-4,y+20,'rgba(0,0,0,.18)',2);ell(cx,y,24,12,'#62d26f');const wf=(TIME*30)%20;line(cx+16,y+4,cx+16,y+16+wf*.4,'rgba(140,220,255,.9)',2.5);
  box(cx-4,y-2,.26,.26,10,'#ffe08a');pyramid(cx-4,y-2,.32,.32,10,9,'#ff5d6c');palm(cx+12,y-2,.7);return z+30;}
// Monumentos
function dEstatua(b,cx,cy,hf){box(cx,cy,.5,.5,10,'#d9d2c4');box(cx,cy,.36,.36,6,'#e8e2d4',10);const pg=TINT;TINT=TINT||ramp(['#2f6b5a','#5fa88f','#bfe6d6']);const y=cy-16;const h=hf;
  X.beginPath();X.moveTo(cx-7,y);X.lineTo(cx-5,y-22*h);X.lineTo(cx+5,y-22*h);X.lineTo(cx+7,y);X.closePath();X.fillStyle=tc('#5fa88f');X.fill();X.strokeStyle=OUT;X.stroke();
  ball(cx,y-27*h,5.5,'#6fb89f');X.beginPath();X.ellipse(cx,y-31*h,6,2,0,0,Math.PI*2);X.fillStyle=tc('#4c8f78');X.fill();const wv=Math.sin(TIME*2)*.15;X.save();X.translate(cx+4,y-19*h);X.rotate(-1.1+wv);X.fillStyle=tc('#5fa88f');X.fillRect(0,-2,13,4);ball(13,0,2.6,'#6fb89f');X.restore();TINT=pg;return 50*h;}
function dRelogio(b,cx,cy,hf){const h=64*hf;const g=box(cx,cy,.4,.4,h,'#c96a4a');for(let j=1;j<8;j++)face(g,0,0,1,h*j/8-.4,h*j/8+.4,'#a8553a');
  const d=new Date();const hr=(d.getHours()%12+d.getMinutes()/60)/12*Math.PI*2,mn=d.getMinutes()/60*Math.PI*2;
  for(let f=0;f<2;f++){const c=fp(g,f,.5,h-10);X.beginPath();X.ellipse(c[0],c[1],6.5,7.5,f?-.45:.45,0,Math.PI*2);X.fillStyle=tc('#fffaf0');X.fill();X.strokeStyle=OUT;X.stroke();
    if(f===0){line(c[0],c[1],c[0]+Math.sin(hr)*3.5,c[1]-Math.cos(hr)*3.5,'#2b2350',1.4);line(c[0],c[1],c[0]+Math.sin(mn)*5.5,c[1]-Math.cos(mn)*5.5,'#2b2350',1);}if(NIGHT>.25)glow(c[0],c[1],10,'rgba(255,240,190,.7)');}
  box(cx,cy,.46,.46,3,'#8a3f2a',h);pyramid(cx,cy,.46,.46,h+3,22,'#3d5a80');ell(cx,cy-h-27,2,2,'#ffd23f');return h+30;}
function dMuseu(b,cx,cy,hf){box(cx,cy,.9,.9,4,'#e8e2d4');const h=22*hf;const g=box(cx,cy,.78,.6,h,'#f7f2e8',4);for(let i=0;i<5;i++){const [x,y]=fp(g,0,(i+.5)/5,0);cyl(x,y,2,4,h-2,'#ffffff');}
  gableA(cx,cy,.84,.66,h+4,10,'#d8cfbf');dome(cx,cy-4,10,h+12,'#7fa6c9',10);
  const [dx,dy]=off(cx,cy,-.15,.5);X.strokeStyle=tc('#fff8ec');X.lineWidth=1.8;X.beginPath();X.moveTo(dx-12,dy-6);X.quadraticCurveTo(dx-2,dy-14,dx+6,dy-10);X.quadraticCurveTo(dx+10,dy-18,dx+14,dy-20);X.stroke();
  for(let i=0;i<5;i++){line(dx-8+i*3,dy-9-i*.8,dx-8+i*3,dy-4,'#fff8ec',1);}line(dx-6,dy-7,dx-7,dy,'#fff8ec',1.4);line(dx+4,dy-9,dx+5,dy,'#fff8ec',1.4);ell(dx+15,dy-21,2.5,1.6,'#fff8ec',false);return h+24;}
function dMonu(b,cx,cy,hf){box(cx,cy,.62,.62,8,'#d6dcff');box(cx,cy,.44,.44,6,'#bfc7ff',8);const h=50*hf;box(cx,cy,.18,.18,h,'#9b6bff',14);pyramid(cx,cy,.18,.18,14+h,10,'#c9a8ff');
  const pulse=.5+.5*Math.sin(TIME*3);glow(cx,cy-14-h*.6,30,`rgba(180,140,255,${.3+pulse*.4})`);
  for(let i=0;i<3;i++){const a=TIME*1.5+i*2.1;const x=cx+Math.cos(a)*18,y=cy-14-h*.5+Math.sin(a)*8;ell(x,y,2.6,2.6,'#9ff3ff',false);glow(x,y,8,'rgba(159,243,255,.9)');}return h+30;}
function dArco(b,cx,cy,hf){const h=40*hf;for(const a of [-.3,.3]){const [x,y]=off(cx,cy,a,0);box(x,y,.18,.4,h,'#e8e2d4');}box(cx,cy,.8,.42,12,'#f2ece0',h);
  const [mx,my]=P(cx,cy,-.21,.21,h-2);X.beginPath();X.arc(...P(cx,cy,0,.21,h-14),12,Math.PI,0);X.strokeStyle=OUT;X.lineWidth=1.3;X.stroke();
  const fz=fp({cx,cy,a:.4,b:.21,z0:h,h:12},0,.5,6);sign(fz[0],fz[1],'BEM-VINDOS','#c9a37a','#fff',6);
  for(const a of [-.36,.36]){const p=P(cx,cy,a,0,h+12);line(p[0],p[1],p[0],p[1]-14,'#6b5a8f',1.2);poly([[p[0],p[1]-14],[p[0]+8,p[1]-11+Math.sin(TIME*5+a)*1.5],[p[0],p[1]-8]],DIST[0].acc);}return h+28;}
function dRoda(b,cx,cy,hf){box(cx,cy,.8,.8,3,'#e7e1d6');const R=40*hf,hz=cy-R-12;line(cx-18,cy-3,cx,hz,'#6b5a8f',3.5);line(cx+18,cy-3,cx,hz,'#6b5a8f',3.5);
  const hue=(TIME*40)%360;X.beginPath();X.arc(cx,hz,R+2,0,Math.PI*2);X.strokeStyle=`hsl(${hue},90%,65%)`;X.lineWidth=2;X.stroke();if(!PREVIEW&&NIGHT>.2)LIGHTS.push({x:cx,y:hz,r:R+12,c:`hsla(${hue},90%,70%,.25)`});
  wheel(cx,hz,R,TIME*.35,['#ffffff','#ff5d6c','#ffd23f','#2fd08a','#5aa9ff','#9b5de5']);return R*2+18;}
// Lendárias
function dCristal(b,cx,cy,hf){box(cx,cy,.9,.9,4,'#e2e8ff');const sh=[[-.25,-.2,40,'#b5f1ff'],[.22,-.22,52,'#d6c2ff'],[0,0,80,'#e9fbff'],[-.22,.22,36,'#c9a8ff'],[.24,.2,46,'#9ff3ff']];
  for(const [a,bb,h,c] of sh){const [x,y]=off(cx,cy,a,bb);const hh=h*hf;poly([[x-7,y-4],[x-4,y-hh],[x,y-hh-10],[x+4,y-hh],[x+7,y-4]],c);line(x,y-hh-10,x,y-6,'rgba(255,255,255,.7)',1.4);glow(x,y-hh*.6,16,'rgba(190,240,255,.55)');}
  if(!PREVIEW&&Math.random()<.15)parts.push({k:'spark',x:cx+rnd(-24,24),y:cy-rnd(10,80*hf),vx:0,vy:-10,t:0,life:.9,c:'#e9fbff'});return 92*hf;}
function dMega(b,cx,cy,hf){let z=0;const L=[[26,30,'#6c63ff'],[20,40,'#8f7dff'],[14,50,'#b2a4ff'],[8,40,'#dcd4ff']];
  for(const [r,h,c] of L){cyl(cx,cy,r,z,h*hf,c);for(let i=0;i<3;i++){const yy=cy-z-h*hf*(i+.5)/3;X.beginPath();X.ellipse(cx,yy,r+.5,(r+.5)/2,0,0,Math.PI);X.strokeStyle='rgba(255,255,255,.5)';X.lineWidth=1.5;X.stroke();}z+=h*hf;}
  const hue=(TIME*90)%360;const oy=cy-z-12;ball(cx,oy,9,'#ffffff');X.beginPath();X.arc(cx,oy,9,0,Math.PI*2);X.fillStyle=`hsla(${hue},100%,65%,.55)`;X.fill();glow(cx,oy,40,`hsla(${hue},100%,70%,.7)`);
  for(let k=0;k<2;k++){X.beginPath();X.ellipse(cx,cy-z*(.4+k*.3),34+k*4,8+k,Math.sin(TIME+k)*.15,0,Math.PI*2);X.strokeStyle=`hsla(${(hue+k*120)%360},100%,70%,.8)`;X.lineWidth=2;X.stroke();}
  if(!PREVIEW){const gr=X.createLinearGradient(0,oy,0,oy-260);gr.addColorStop(0,`hsla(${hue},100%,75%,.45)`);gr.addColorStop(1,'rgba(255,255,255,0)');X.fillStyle=gr;X.fillRect(cx-4,oy-260,8,260);}return z+24;}
function dSuspensa(b,cx,cy,hf){const pl=[[-.22,-.2,40,'#ffd6a5'],[.24,-.16,62,'#cde7ff'],[-.1,.24,80,'#e5d4ff']];ell(cx,cy,30,15,'rgba(43,35,80,.12)',false);let top=0;const pts=[];
  for(const [a,bb,z0,c] of pl){const [x,y]=off(cx,cy,a,bb);const z=z0*hf+Math.sin(TIME+a*9)*3;const yy=y-z;X.beginPath();X.moveTo(x-14,yy);X.quadraticCurveTo(x,yy+18,x+14,yy);X.closePath();X.fillStyle=tc('#9b6b43');X.fill();X.strokeStyle=OUT;X.stroke();
    ell(x,yy,14,7,'#7fd66a');const g=box(x,yy-2,.22,.22,14,c);wins(g,1,2,'#bfe3ff',b.id+a*10|0);pyramid(x,yy-2,.26,.26,14,6,'#ff5d6c');pts.push([x,yy-2]);top=Math.max(top,z+24);}
  line(...pts[0],...pts[1],'#c9a37a',1.6);line(...pts[1],...pts[2],'#c9a37a',1.6);for(let i=0;i<4;i++){const t=(TIME*.3+i/4)%1;ell(lerp(pts[0][0],pts[1][0],t),lerp(pts[0][1],pts[1][1],t)-2,1.4,1.4,'#ffd23f',false);}return top;}
function dPortal(b,cx,cy,hf){box(cx,cy,.8,.5,6,'#3a2f6b');for(const a of [-.32,.32]){const [x,y]=off(cx,cy,a,0);box(x,y,.12,.2,10,'#5a4b9e',6);}const R=34*hf,y=cy-6-R;
  const hue=(TIME*70)%360;for(let k=0;k<5;k++){X.beginPath();X.ellipse(cx,y,R*(1-k*.16),R*1.1*(1-k*.16),0,TIME*(1+k*.3),TIME*(1+k*.3)+Math.PI*1.6);X.strokeStyle=`hsla(${(hue+k*40)%360},100%,${60+k*6}%,.9)`;X.lineWidth=3;X.stroke();}
  X.beginPath();X.ellipse(cx,y,R+3,R*1.1+3,0,0,Math.PI*2);X.strokeStyle=tc('#d6c2ff');X.lineWidth=5;X.stroke();X.strokeStyle=OUT;X.lineWidth=1.2;X.stroke();glow(cx,y,R*1.6,`hsla(${hue},100%,70%,.55)`);
  if(!PREVIEW&&Math.random()<.3)parts.push({k:'spark',x:cx+rnd(-R,R),y:y+rnd(-R,R),vx:0,vy:-12,t:0,life:.8,c:`hsl(${hue},100%,80%)`});return R*2+18;}
// Decoração
function tilePolyAt(cx,cy,s){const a=s/2;return [P(cx,cy,-a,-a,0),P(cx,cy,a,-a,0),P(cx,cy,a,a,0),P(cx,cy,-a,a,0)];}
function dArvore(b,cx,cy){const [c1,c2]=treeCols();tree(cx,cy,1.4,c1,c2);const [x,y]=off(cx,cy,.25,.2);tree(x,y,.7,c2,c1);return 36;}
function dPinheiro(b,cx,cy){pine(cx,cy,1.5,'#2e7d4f');const [x,y]=off(cx,cy,-.25,.2);pine(x,y,.8,'#38b46a');return 46;}
function dCanteiro(b,cx,cy){poly(tilePolyAt(cx,cy,.6),'#8b5a2b');poly(tilePolyAt(cx,cy-1,.52),'#6b4a2b',false);for(let i=0;i<10;i++){const h=hash(b.id*7+i);const [x,y]=off(cx,cy,(h%50)/100-.25,((h>>6)%50)/100-.25);line(x,y-1,x,y-6,'#3c8f3c',1);ell(x,y-7,2,2,['#ff6fa0','#ffd23f','#ffffff','#c9a8ff','#ff4d4d'][i%5],false);}return 12;}
function dBanco(b,cx,cy){box(cx,cy,.42,.14,4,'#a0703c');box(cx-2,cy-1,.42,.04,8,'#8b5a2b',4);const [lx,ly]=off(cx,cy,.32,-.2);line(lx,ly,lx,ly-24,'#4a4a6a',1.6);ell(lx,ly-25,3,3,'#fff6c2');if(NIGHT>.2)glow(lx,ly-25,18,'rgba(255,230,150,.8)');
  if(hash(b.id)%2)person(cx+3,cy-4,pick?['#ff8fab','#5aa9ff','#2fd08a'][b.id%3]:'#ff8fab','#e0ac69',b.id);const [tx,ty]=off(cx,cy,-.3,-.3);tree(tx,ty,.6,treeCols()[0]);return 26;}
function dPoste(b,cx,cy){for(const [a,bb] of [[-.2,.1],[.2,-.1]]){const [x,y]=off(cx,cy,a,bb);ell(x,y,4,2,'rgba(43,35,80,.2)',false);line(x,y,x,y-30,'#2b2350',2.2);X.beginPath();X.arc(x+4,y-30,4,Math.PI,0);X.strokeStyle='#2b2350';X.lineWidth=2;X.stroke();
  ell(x+8,y-28,3,3.6,'#fff6c2');if(NIGHT>.15)glow(x+8,y-26,26,'rgba(255,230,150,.85)');}return 34;}
function dCalcada(b,cx,cy){const tp=tilePolyAt(cx,cy,.94);poly(tp,'#f4f1ea',false);X.save();X.beginPath();X.moveTo(...tp[0]);for(let k=1;k<4;k++)X.lineTo(...tp[k]);X.closePath();X.clip();
  for(let r=-3;r<4;r++){X.beginPath();for(let i=0;i<=24;i++){const t=i/24;const u=-.5+t,v=r*.14+Math.sin(t*Math.PI*4)*.05;const p=P(cx,cy,u,v,0);i?X.lineTo(...p):X.moveTo(...p);}X.strokeStyle=tc('#2b2350');X.lineWidth=3.5;X.stroke();}X.restore();
  X.beginPath();X.moveTo(...tp[0]);for(let k=1;k<4;k++)X.lineTo(...tp[k]);X.closePath();X.strokeStyle='rgba(43,35,80,.35)';X.lineWidth=1;X.stroke();return 6;}
function dEstatuaP(b,cx,cy){box(cx,cy,.32,.32,8,'#d9d2c4');const y=cy-8;ball(cx,y-7,8,'#ffd23f');ball(cx+5,y-15,5,'#ffd23f');poly([[cx+9,y-15],[cx+15,y-13],[cx+9,y-12]],'#ff8f1f',false);ell(cx+6,y-16.5,1.1,1.1,'#2b2350',false);
  X.beginPath();X.ellipse(cx+5,y-20,4,1.2,0,0,Math.PI*2);X.fillStyle=tc('#2b2350');X.fill();X.fillRect(cx+2.5,y-26,5,6);return 34;}
function dSazonal(b,cx,cy){const m=new Date().getMonth();
  if(m===11||m===0){pine(cx,cy,1.6,'#2e7d4f');for(let i=0;i<8;i++){const on=(Math.floor(TIME*3)+i)%2;const [x,y]=[cx-8+(i%4)*5,cy-10-Math.floor(i/4)*10-(i%2)*3];ell(x,y,1.6,1.6,on?COL4[i%4]:'#ffffff',false);if(on&&NIGHT>.2)glow(x,y,6,'rgba(255,240,150,.9)');}star(cx,cy-44,4,1.8,0,'#ffd23f');return 50;}
  if(m===5||m===6){for(let k=0;k<2;k++){const A=P(cx,cy,-.45,-.3+k*.5,20),B=P(cx,cy,.45,-.3+k*.5,20);line(A[0],A[1]+20,A[0],A[1],'#8b5a2b',1.4);line(B[0],B[1]+20,B[0],B[1],'#8b5a2b',1.4);
    for(let i=0;i<8;i++){const t=(i+.5)/8;const x=lerp(A[0],B[0],t),y=lerp(A[1],B[1],t)+Math.sin(t*Math.PI)*5;poly([[x-3,y],[x+3,y],[x,y+5]],COL4[(i+k)%4],false);}}ell(cx,cy,8,4,'#ff7b39');for(let i=0;i<4;i++)line(cx-4+i*3,cy,cx-4+i*3+Math.sin(TIME*6+i),cy-8,'#ffb347',2);glow(cx,cy-4,16,'rgba(255,150,50,.6)');return 30;}
  if(m===9||m===10){ell(cx,cy-6,11,8,'#ff8f1f');for(let i=-1;i<=1;i++){X.beginPath();X.ellipse(cx+i*5,cy-6,3,8,0,0,Math.PI*2);X.strokeStyle=tc('#d96b00');X.lineWidth=1;X.stroke();}line(cx,cy-14,cx+2,cy-18,'#3c8f3c',2);
    poly([[cx-5,cy-8],[cx-2,cy-8],[cx-3.5,cy-10]],'#2b2350',false);poly([[cx+2,cy-8],[cx+5,cy-8],[cx+3.5,cy-10]],'#2b2350',false);if(NIGHT>.2)glow(cx,cy-6,14,'rgba(255,170,40,.8)');return 22;}
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;ell(cx+Math.cos(a)*10,cy+Math.sin(a)*5,3,3,['#ff6fa0','#ffd23f','#ffffff','#c9a8ff'][i%4],false);}ball(cx,cy-4,5,'#ff8fab');return 14;}
function dPlaca(b,cx,cy){X.beginPath();const [l1,l2]=off(cx,cy,-.45,.45),[r1,r2]=off(cx,cy,.45,-.45);X.moveTo(l1,l2);X.quadraticCurveTo(cx,cy-26,r1,r2);X.lineTo(...off(cx,cy,.45,.45));X.closePath();X.fillStyle=tc('#7fd66a');X.fill();X.strokeStyle=OUT;X.stroke();
  const L='CIDADE';for(let i=0;i<L.length;i++){const t=i/(L.length-1);const x=lerp(cx-20,cx+20,t),y=lerp(cy-6,cy-14,t)-Math.sin(t*Math.PI)*6;line(x,y,x,y+5,'#6b5a8f',1);X.font='10px "Lilita One",sans-serif';X.fillStyle=tc('#ffffff');X.strokeStyle=OUT;X.lineWidth=2.5;X.textAlign='center';X.textBaseline='bottom';X.strokeText(L[i],x,y);X.fillText(L[i],x,y);if(NIGHT>.2)glow(x,y-5,8,'rgba(255,255,230,.8)');}return 30;}
function dPonte(b,cx,cy){const tp=tilePolyAt(cx,cy,.94);poly(tp,'#7fd66a',false);const A=P(cx,cy,-.47,-.12,0),B=P(cx,cy,.47,-.12,0),C2=P(cx,cy,.47,.12,0),D=P(cx,cy,-.47,.12,0);poly([A,B,C2,D],'#4fc3f7',false);
  const wv=Math.sin(TIME*2)*3;line(lerp(A[0],B[0],.3)+wv,lerp(A[1],B[1],.3)+3,lerp(A[0],B[0],.45)+wv,lerp(A[1],B[1],.45)+3,'rgba(255,255,255,.8)',1);
  const s=P(cx,cy,0,-.35,0),e=P(cx,cy,0,.35,0);X.beginPath();X.moveTo(...s);X.quadraticCurveTo(cx,cy-16,...e);X.strokeStyle=tc('#c9765a');X.lineWidth=7;X.stroke();X.strokeStyle=OUT;X.lineWidth=1;X.stroke();
  X.beginPath();X.moveTo(s[0],s[1]-5);X.quadraticCurveTo(cx,cy-21,e[0],e[1]-5);X.strokeStyle=tc('#ffffff');X.lineWidth=1.4;X.stroke();const t=TIME*.4;const dx=lerp(A[0],B[0],(t%1)),dy=lerp(A[1],B[1],(t%1))+4;ell(dx,dy,3,1.6,'#ffffff');ball(dx+2,dy-2.5,1.5,'#ffffff');return 20;}
// Projetos municipais (visual muda a cada etapa concluída)
function dProject(b,cx,cy){const st=(S.prj[b.pid]||{}).s||0;const id=b.pid;
  if(id==='metro'){box(cx,cy,.94,.94,3,'#d9d2e8');poly([P(cx,cy,-.3,.36,3),P(cx,cy,.3,.36,3),P(cx,cy,.2,-.1,3),P(cx,cy,-.2,-.1,3)],'#2b2350');if(st>=2)for(let i=0;i<2;i++)line(...P(cx,cy,-.42,-.3+i*.12,3),...P(cx,cy,.42,-.3+i*.12,3),'#c0c8d8',1.5);
    if(st>=3){dome(cx,cy-6,24,4,'rgba(170,230,255,.6)',20);const p=P(cx,cy,.4,-.4,0);line(p[0],p[1],p[0],p[1]-46,'#6b5a8f',2.5);rr(p[0]-9,p[1]-62,18,18,4);X.fillStyle='#ff4d6d';X.fill();X.stroke();X.font='14px "Lilita One",sans-serif';X.fillStyle='#fff';X.textAlign='center';X.textBaseline='middle';X.fillText('M',p[0],p[1]-52.5);glow(p[0],p[1]-53,20,'rgba(255,90,110,.6)');}return st>=3?64:16;}
  if(id==='aero'){const A=P(cx,cy,-.48,.25,1),B=P(cx,cy,.48,.25,1),C2=P(cx,cy,.48,-.25,1),D=P(cx,cy,-.48,-.25,1);poly([A,B,C2,D],'#5b6378');for(let i=0;i<5;i++){const t=(i+.5)/5;line(lerp(A[0],B[0],t)-6+(D[0]-A[0])/2,lerp(A[1],B[1],t)+(D[1]-A[1])/2,lerp(A[0],B[0],t)+(D[0]-A[0])/2,lerp(A[1],B[1],t)+(D[1]-A[1])/2,'#ffffff',1.5);}
    if(st>=2){const [tx,ty]=off(cx,cy,0,-.42);const g=box(tx,ty,.9,.16,12,'#dff3ff');for(let i=0;i<6;i++)face(g,0,(i+.1)/6,(i+.9)/6,2,10,'#9fd8ff');}
    if(st>=3){const [tx,ty]=off(cx,cy,.42,-.42);cyl(tx,ty,4,0,46,'#ffffff');cyl(tx,ty,9,46,8,'#6fd0ff');if(Math.sin(TIME*3)>0)glow(tx,ty-56,10,'rgba(255,90,110,.9)');
      const p=(TIME*.15)%1;const x=lerp(A[0],B[0],p)+(D[0]-A[0])/2,y=lerp(A[1],B[1],p)+(D[1]-A[1])/2-Math.max(0,p-.5)*80;X.save();X.translate(x,y-4);X.rotate(-.46-Math.max(0,p-.5)*.6);X.fillStyle=tc('#ffffff');X.strokeStyle=OUT;X.beginPath();X.ellipse(0,0,14,3.5,0,0,Math.PI*2);X.fill();X.stroke();X.beginPath();X.moveTo(-2,0);X.lineTo(-8,8);X.lineTo(3,1);X.closePath();X.fillStyle=tc('#ff5d6c');X.fill();X.stroke();X.restore();}return st>=3?60:14;}
  if(id==='campus'){box(cx,cy,.94,.94,2,'#c9e8a6');const [lx,ly]=off(cx,cy,-.2,.1);const g=box(lx,ly,.5,.6,22,'#e9dccb');wins(g,3,2,'#bfe3ff',3);gableA(lx,ly,.54,.64,22,8,'#a63d40');
    if(st>=2){const [x,y]=off(cx,cy,.26,.24);const g2=box(x,y,.34,.34,16,'#f2f6ff');wins(g2,2,1,'#a6f7c9',4,3,'#8affc1');}
    if(st>=3){const [x,y]=off(cx,cy,.24,-.26);cyl(x,y,11,0,20,'#ffffff');dome(x,y,11,20,'#5b6378',10);X.save();X.translate(x,y-26);X.rotate(-.6+Math.sin(TIME*.4)*.3);X.fillStyle='#2b2350';X.fillRect(0,-2,12,4);X.restore();if(NIGHT>.2)glow(x+10,y-30,10,'rgba(200,220,255,.8)');}return st>=3?52:34;}
  if(id==='jardins'){let z=0;const n=Math.max(1,st);for(let i=0;i<3;i++){if(i>=n&&st<3&&i>0)break;const s=.92-i*.24;box(cx,cy,s,s,14,'#d8c9a8',z);if(st>=1){for(let k=0;k<4;k++){const p=P(cx,cy,-s/2+.08+k*(s-.16)/3,s/2,z+14);ball(p[0],p[1]-3,4,'#3cb44b');}}z+=14;}
    if(st>=2){for(let i=0;i<2;i++){const p=P(cx,cy,.2-i*.3,.46-i*.12,z-4);const w=(TIME*40)%14;line(p[0],p[1],p[0],p[1]+z-8,'rgba(140,220,255,.85)',3);ell(p[0],p[1]+z-8+w*.05,4,2,'rgba(255,255,255,.7)',false);}}
    if(st>=3){tree(cx,cy-z,1.3,'#ff8fc0','#3cb44b');for(let i=0;i<6;i++)if(Math.random()<.02&&!PREVIEW)parts.push({k:'conf',x:cx+rnd(-20,20),y:cy-z-10,vx:rnd(-10,10),vy:rnd(-20,0),t:0,life:2,c:'#ff8fc0',r:0,g:1});}return z+20;}
  if(id==='fusao'){box(cx,cy,.94,.94,4,'#c2cee0');const g=box(cx,cy,.8,.8,16,'#9aa7c7',4);X.beginPath();X.ellipse(cx,cy-30,26,10,0,0,Math.PI*2);X.strokeStyle=tc('#5b6378');X.lineWidth=7;X.stroke();X.strokeStyle=OUT;X.lineWidth=1;X.stroke();
    if(st>=2)for(let i=0;i<6;i++){const a=i/6*Math.PI*2;ell(cx+Math.cos(a)*26,cy-30+Math.sin(a)*10,4,6,'#ff9f1c');}
    if(st>=3){const p=.7+.3*Math.sin(TIME*6);const gr=X.createRadialGradient(cx,cy-30,2,cx,cy-30,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.5,`rgba(140,220,255,${p})`);gr.addColorStop(1,'rgba(140,120,255,0)');X.fillStyle=gr;X.fillRect(cx-20,cy-50,40,40);glow(cx,cy-30,50,'rgba(150,210,255,.7)');}return 50;}
  if(id==='elev'){box(cx,cy,.94,.94,8,'#c9d2e4');box(cx,cy,.5,.5,10,'#9aa7c7',8);if(st>=2){line(cx,cy-18,cx,cy-600,'rgba(220,230,255,.9)',2);const c=(TIME*.08)%1;box(cx,cy-18-c*560,.12,.12,8,'#ffd23f');}
    if(st>=3){const gr=X.createLinearGradient(0,cy-18,0,cy-600);gr.addColorStop(0,'rgba(160,230,255,.5)');gr.addColorStop(1,'rgba(255,255,255,0)');X.fillStyle=gr;X.fillRect(cx-6,cy-600,12,582);glow(cx,cy-20,30,'rgba(160,230,255,.6)');}return 40;}
  box(cx,cy,.8,.8,6,'#c9b79c');return 10;}
