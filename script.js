/* ====== EDIT HERE ====== */
const PASS="2828";
// Letter text (edit here)
const LETTER=["Dear 오빠,","Happy Birthday! 🎉 Today is the day the world got one of its best people, and I got the best brother. Thank you for every laugh, every bit of support, and for always being there when I needed you.","You make everything better just by being you. I'm so proud of you, and I'm so lucky to have you in my life.","I wish you endless happiness, success, and everything your heart dreams of. Here's to many more years together! 🎂"];
// Videos in the order they play (files must be in the same folder)
const VIDEOS=["video1.mp4","video2.mp4","video3.mp4","video4.mp4"];
// 1 = Happyyyie birthdayyy, 2 = Wda pai bilo mera best bro, 3 = Aaj mere bhai ki salgira hai, 4 = Har koi mera bhai nahi
const SIGN="Always yours 💜";
/* ======================= */
const $=s=>document.querySelector(s),pgs=[...document.querySelectorAll('.pg')];
let cur=0;
/* balloons: outline only */
const cols=['#f06bb6','#a855c8','#7c5cdb','#ff8fc7','#c084fc'];
for(let i=0;i<16;i++){const s=14+Math.random()*16,c=cols[i%5],d=document.createElement('div');d.className='bl';
 d.style.cssText=`left:${Math.random()*100}%;--dx:${(Math.random()*60-30)}px;animation-duration:${14+Math.random()*14}s;animation-delay:${-Math.random()*26}s`;
 d.innerHTML=`<svg width="${s*1.6}" height="${s*2.6}" viewBox="0 0 32 52" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"><path d="M16 2C8 2 3 9 3 17c0 9 8 17 13 19 5-2 13-10 13-19C29 9 24 2 16 2z"/><path d="M16 36l-3 4h6z"/><path d="M16 40c-4 4 4 7 0 11"/></svg>`;
 $('#balloons').appendChild(d)}
/* dots */
const dots=$('#dots');for(let i=3;i<pgs.length;i++)dots.innerHTML+='<i></i>';
function go(n){pgs[cur].classList.remove('on');cur=n;pgs[n].classList.add('on');
 dots.style.display=n>=2?'flex':'none';[...dots.children].forEach((d,i)=>d.className=i+3===n?'a':'');
 if(n===1)load();if(n===2)hello();if(n===3)boom(30);if(n===8)setTimeout(initScratch,150)}
/* lock */
let pin="";const pad=$('#pad');
['1','2','3','4','5','6','7','8','9','⌫','0','✓'].forEach(k=>{const b=document.createElement('button');b.textContent=k;if(k==='✓'){b.textContent='💜';b.style.fontSize='22px';b.disabled=true;}b.onclick=()=>key(k);pad.appendChild(b)});
function key(k){if(k==='⌫')pin=pin.slice(0,-1);else if(pin.length<4)pin+=k;
 [...$('#pin').children].forEach((d,i)=>d.className=i<pin.length?'f':'');
 if(pin.length===4){if(pin===PASS){$('#msgL').textContent='';setTimeout(()=>go(1),300)}
  else{$('#msgL').textContent='Wrong code, try again 🙈';$('#pin').classList.add('shake');setTimeout(()=>{pin='';$('#pin').classList.remove('shake');[...$('#pin').children].forEach(d=>d.className='')},450)}}}
document.addEventListener('keydown',e=>{if(cur!==0)return;if(/^[0-9]$/.test(e.key))key(e.key);else if(e.key==='Backspace')key('⌫')});
$('#kb').oninput=e=>{const v=e.target.value.replace(/\D/g,'').slice(0,4);e.target.value='';[...v].forEach(c=>key(c))};
/* loader */
function load(){let p=0;const t=setInterval(()=>{p+=Math.random()*9+3;if(p>=100){p=100;clearInterval(t);setTimeout(()=>go(2),500)}$('#lb').style.width=p+'%';$('#lp').textContent=Math.floor(p)+'%'},120)}
/* hello */
function hello(){const h=$('#hb');h.innerHTML='';"Happy Birthday".split('').forEach((c,i)=>{h.innerHTML+=`<span style="animation-delay:${i*.06}s">${c===' '?'&nbsp;':c}</span>`});h.innerHTML+='<br>';
 "오빠!".split('').forEach((c,i)=>{h.innerHTML+=`<span style="animation-delay:${1+i*.2}s;color:#a855c8">${c}</span>`});boom(40)}
/* letter */
$('#env').onclick=function(){if(this.classList.contains('open'))return;this.classList.add('open');$('#lt').textContent='';
 setTimeout(()=>{this.style.display='none';const L=$('#letter');L.style.display='block';let n=0,h='';
  LETTER.forEach(p=>{h+='<p style="margin-bottom:10px">'+p.split(' ').map(w=>`<span class="w" style="animation-delay:${(n++)*.09}s">${w}</span>`).join('')+'</p>'});
  h+=`<span class="sg w" style="animation-delay:${n*.09}s">${SIGN}</span>`;L.innerHTML=h;
  setTimeout(()=>{$('#n3').style.display='inline-block'},n*90+600)},800)};
/* wish + microphone blow */
function blow(){const c=$('#ck');if(c.classList.contains('out'))return;c.classList.add('out');$('#ws').textContent='Your wish is on its way 💫';boom(70);
 $('#micBlow').style.display='none';$('#micStatus').textContent='Candles blown! 🎂💜';stopMic();setTimeout(()=>$('#n4').style.display='inline-block',900)}
$('#ck').onclick=blow;
let actx,mstream,micOn=false;
function stopMic(){micOn=false;try{mstream&&mstream.getTracks().forEach(t=>t.stop());actx&&actx.close()}catch(e){}}
async function startMic(){
 if(micOn)return;
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){$('#micStatus').textContent='Mic not supported here. Tap the cake instead 🎂';return}
 try{
  mstream=await navigator.mediaDevices.getUserMedia({audio:true});
  actx=new (window.AudioContext||window.webkitAudioContext)();
  const an=actx.createAnalyser();an.fftSize=512;actx.createMediaStreamSource(mstream).connect(an);
  micOn=true;$('#micStatus').textContent='Mic on, now blow toward your phone 💨';
  const d=new Uint8Array(an.fftSize);
  (function loop(){if(!micOn)return;an.getByteTimeDomainData(d);let sum=0;for(let i=0;i<d.length;i++){const v=(d[i]-128)/128;sum+=v*v}
   if(Math.sqrt(sum/d.length)>0.12){blow();return}requestAnimationFrame(loop)})();
 }catch(e){$('#micStatus').textContent='Please allow mic access, or tap the cake 🎂'}}
$('#micBlow').onclick=startMic;
/* cut */
(()=>{const b=$('#cutbox'),ln=$('#ln');let sx,sy,on=false,done=false;
 const pt=e=>{const r=b.getBoundingClientRect();return[(e.clientX-r.left)/r.width*250,(e.clientY-r.top)/r.height*160]};
 b.onpointerdown=e=>{if(done)return;on=true;[sx,sy]=pt(e);b.setPointerCapture(e.pointerId);ln.setAttribute('x1',sx);ln.setAttribute('y1',sy)};
 b.onpointermove=e=>{if(!on)return;const[x,y]=pt(e);ln.setAttribute('x2',x);ln.setAttribute('y2',y);
  if(Math.hypot(x-sx,y-sy)>70&&Math.abs(y-sy)>50){on=false;done=true;b.classList.add('cut');ln.setAttribute('x2',sx);ln.setAttribute('y2',sy);boom(90);$('#cs').textContent='Yay! Enjoy the sweetness 🍓';setTimeout(()=>$('#n5').style.display='inline-block',900)}};
 b.onpointerup=()=>{on=false;if(!done)ln.setAttribute('x2',sx)}})();
/* videos */
let vi=0;const vb=$('#vids');
VIDEOS.forEach((v,i)=>{vb.innerHTML+=`<div class="vid" style="${i?'display:none':''}"><video src="${v}" controls playsinline preload="metadata"></video></div>`});
vb.innerHTML+='<div style="display:flex;justify-content:center;gap:12px"><button class="btn" style="margin:6px;padding:8px 18px" onclick="sv(-1)">‹</button><button class="btn" style="margin:6px;padding:8px 18px" onclick="sv(1)">›</button></div>';
function sv(d){const a=[...vb.querySelectorAll('.vid')];const o=a[vi].querySelector('video');o&&o.pause();a[vi].style.display='none';vi=(vi+d+a.length)%a.length;a[vi].style.display='grid'}
/* double tap = full screen */
function fs(v){const f=v.requestFullscreen||v.webkitRequestFullscreen;if(f)f.call(v);else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen()}
let lastTap=0;
vb.addEventListener('touchend',e=>{const v=e.target.closest('video');if(!v)return;const t=Date.now();if(t-lastTap<350){e.preventDefault();fs(v);lastTap=0}else lastTap=t});
vb.addEventListener('dblclick',e=>{const v=e.target.closest('video');if(v)fs(v)});
/* pop balloons */
const WORDS=["You","are","very","handsome bro!"],PC=['#f7a8d8','#c084fc','#ff8fc7','#a78bfa'];let pn=0;
WORDS.forEach((w,i)=>{const d=document.createElement('div');d.className='pb';
 d.innerHTML=`<svg viewBox="0 0 80 110"><path d="M40 4C20 4 6 20 6 40c0 22 20 40 34 46 14-6 34-24 34-46C74 20 60 4 40 4z" fill="${PC[i]}" stroke="#8e44ad" stroke-width="3"/><ellipse cx="26" cy="28" rx="7" ry="11" fill="#fff" opacity=".55" transform="rotate(25 26 28)"/><path d="M40 86l-5 7h10z" fill="#8e44ad"/><path d="M40 93c-7 7 7 10 0 16" fill="none" stroke="#8e44ad" stroke-width="2.5"/></svg>`;
 d.onclick=()=>{if(d.classList.contains('gone'))return;d.classList.add('gone');
  for(let k=0;k<12;k++){const p=document.createElement('i');p.className='sp';const a=k/12*6.28,r=40+Math.random()*30;
   p.style.cssText=`left:48px;top:48px;background:${PC[i]};--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r}px`;d.appendChild(p)}
  const b=document.createElement('b');b.textContent=WORDS[pn++];$('#said').innerHTML=pn===1?'':$('#said').innerHTML;$('#said').appendChild(b);$('#ph').style.display='none';
  boom(pn===4?100:10);if(pn===4)setTimeout(()=>$('#n8').style.display='inline-block',700)};
 $('#pops').appendChild(d)});
$('#seal').onclick=()=>{boom(160);$('#seal').textContent='Sealed with love 💜'};
/* confetti */
function boom(n){for(let i=0;i<n;i++){const c=document.createElement('i');c.className='cf';
 c.style.cssText=`left:${Math.random()*100}vw;background:${['#f06bb6','#a855c8','#ffc94d','#ff8fc7','#7c5cdb'][i%5]};animation-delay:${Math.random()*.8}s;animation-duration:${2+Math.random()*2}s;border-radius:${i%2?'50%':'2px'}`;
 document.body.appendChild(c);setTimeout(()=>c.remove(),4800)}}

/* scratch photo */
function initScratch(){
 const c=$('#scratchCanvas'),w=$('#scratchWrap'),img=w.querySelector('img');
 if(!img.complete||!img.naturalWidth){img.onload=initScratch;return}
 const r={width:w.offsetWidth,height:w.offsetHeight};if(!r.width)return;
 const dpr=window.devicePixelRatio||1;c.width=r.width*dpr;c.height=r.height*dpr;c.style.width=r.width+'px';c.style.height=r.height+'px';
 const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.globalCompositeOperation='source-over';
 const g=x.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,'#d9b3ec');g.addColorStop(1,'#a855c8');x.fillStyle=g;x.fillRect(0,0,r.width,r.height);
 x.fillStyle='rgba(255,255,255,.75)';x.font='bold 20px Nunito, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('Scratch me ✨',r.width/2,r.height/2);
 x.globalCompositeOperation='destination-out';
 let down=false,n=0,done=false;
 const cleared=()=>{let hit=0,tot=0;for(let i=1;i<10;i++)for(let j=1;j<14;j++){tot++;if(x.getImageData(i/10*r.width*dpr,j/14*r.height*dpr,1,1).data[3]<40)hit++}return hit/tot};
 function sc(e){if(!down||done)return;const b=c.getBoundingClientRect();x.beginPath();x.arc((e.clientX-b.left)*r.width/b.width,(e.clientY-b.top)*r.height/b.height,26,0,6.3);x.fill();
  if(++n%10===0&&cleared()>0.5){done=true;c.style.transition='opacity .6s';c.style.opacity=0;c.style.pointerEvents='none';$('#scratchText').textContent='Surprise revealed! 💜';boom(80);$('#nPhoto').style.display='inline-block'}}
 c.onpointerdown=e=>{down=true;c.setPointerCapture(e.pointerId);sc(e)};c.onpointermove=sc;c.onpointerup=c.onpointercancel=()=>{down=false}}
/* replay */
function replay(){location.reload()}
