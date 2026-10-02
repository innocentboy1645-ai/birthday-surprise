/* ====== EDIT HERE ====== */
const PASS="2828";

// Letter text
const letter = `Dear 오빠,

Happy Birthday! 🎉 You are the best brother a person could ask for.

I'm so grateful to have you in my life. I want you by my side for the rest of my life, my brother. ❤️

I wish you all the happiness in the world, and I hope this year brings you everything you've been hoping for.

I want you to become the best cricketer in the world. ❤️ You are my best friend and my brother, and I love you so much.

I hope you have an amazing birthday filled with love, laughter, and all your favorite things.

I've never opened up to anyone the way I do with you.

I don't know how I became so attached to you, but somehow, I have. And now, you mean so much to me.

I just hope you'll always keep my trust safe and never break it. ❤️

Happy Birthday once again, 오빠! 🎂❤️`;

const SIGN="Your forever little sister 💜";
/* ======================= */


const $=s=>document.querySelector(s);
const pgs=[...document.querySelectorAll('.pg')];
let cur=0;


/* balloons */
const cols=['#f06bb6','#a855c8','#7c5cdb','#ff8fc7','#c084fc'];

for(let i=0;i<16;i++){

  const s=14+Math.random()*16;
  const c=cols[i%5];
  const d=document.createElement('div');

  d.className='bl';

  d.style.cssText=
    `left:${Math.random()*100}%;`+
    `--dx:${(Math.random()*60-30)}px;`+
    `animation-duration:${14+Math.random()*14}s;`+
    `animation-delay:${-Math.random()*26}s`;

  d.innerHTML=
    `<svg width="${s*1.6}" height="${s*2.6}" viewBox="0 0 32 52" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round">
      <path d="M16 2C8 2 3 9 3 17c0 9 8 17 13 19 5-2 13-10 13-19C29 9 24 2 16 2z"/>
      <path d="M16 36l-3 4h6z"/>
      <path d="M16 40c-4 4 4 7 0 11"/>
    </svg>`;

  $('#balloons').appendChild(d);
}


/* dots */
const dots=$('#dots');

for(let i=3;i<pgs.length;i++){
  dots.innerHTML+='<i></i>';
}


/* navigation */
function go(n){

  pgs[cur].classList.remove('on');

  cur=n;

  pgs[n].classList.add('on');

  dots.style.display=n>=2?'flex':'none';

  [...dots.children].forEach((d,i)=>{
    d.className=i+3===n?'a':'';
  });

  if(n===1) load();

  if(n===2) hello();

  if(n===3) boom(30);

  /* IMPORTANT:
     Photo page is DOM index 8.
     Scratch is initialized AFTER page becomes visible.
  */
  if(n===8){

    setTimeout(()=>{

      if(window.initScratch){
        window.initScratch();
      }

    },200);
  }
}


/* lock */
let pin="";
const pad=$('#pad');

['1','2','3','4','5','6','7','8','9','⌫','0','✓'].forEach(k=>{

  const b=document.createElement('button');

  b.textContent=k;

  if(k==='✓'){
    b.textContent='💜';
    b.style.fontSize='22px';
    b.disabled=true;
  }

  b.onclick=()=>key(k);

  pad.appendChild(b);
});


function key(k){

  if(k==='⌫'){
    pin=pin.slice(0,-1);
  }
  else if(pin.length<4){
    pin+=k;
  }

  [...$('#pin').children].forEach((d,i)=>{
    d.className=i<pin.length?'f':'';
  });

  if(pin.length===4){

    if(pin===PASS){

      $('#msgL').textContent='';

      setTimeout(()=>go(1),300);

    }
    else{

      $('#msgL').textContent='Wrong code, try again 🙈';

      $('#pin').classList.add('shake');

      setTimeout(()=>{

        pin='';

        $('#pin').classList.remove('shake');

        [...$('#pin').children].forEach(d=>{
          d.className='';
        });

      },450);
    }
  }
}


document.addEventListener('keydown',e=>{

  if(cur!==0)return;

  if(/^[0-9]$/.test(e.key)){
    key(e.key);
  }
  else if(e.key==='Backspace'){
    key('⌫');
  }

});


$('#kb').oninput=e=>{

  const v=e.target.value.replace(/\D/g,'').slice(0,4);

  e.target.value='';

  [...v].forEach(c=>key(c));
};


/* loader */
function load(){

  let p=0;

  const t=setInterval(()=>{

    p+=Math.random()*9+3;

    if(p>=100){

      p=100;

      clearInterval(t);

      setTimeout(()=>go(2),500);
    }

    $('#lb').style.width=p+'%';

    $('#lp').textContent=Math.floor(p)+'%';

  },120);
}


/* hello */
function hello(){

  const h=$('#hb');

  h.innerHTML='';

  "Happy Birthday".split('').forEach((c,i)=>{

    h.innerHTML+=
      `<span style="animation-delay:${i*.06}s">
        ${c===' '?'&nbsp;':c}
      </span>`;

  });

  h.innerHTML+='<br>';

  "오빠!".split('').forEach((c,i)=>{

    h.innerHTML+=
      `<span style="animation-delay:${1+i*.2}s;color:#a855c8">
        ${c}
      </span>`;

  });

  boom(40);
}


/* letter */
$('#env').onclick=function(){

  if(this.classList.contains('open'))return;

  this.classList.add('open');

  $('#lt').textContent='';

  setTimeout(()=>{

    this.style.display='none';

    const L=$('#letter');

    L.style.display='block';

    let n=0;
    let h='';

    const paragraphs=letter.trim().split(/\n\s*\n/);

    paragraphs.forEach(p=>{

      h+=
        '<p style="margin-bottom:10px">'+
        p.split(/\s+/).map(w=>
          `<span class="w" style="animation-delay:${(n++)*.09}s">${w}</span>`
        ).join(' ')+
        '</p>';

    });

    h+=
      `<span class="sg w" style="animation-delay:${n*.09}s">
        ${SIGN}
      </span>`;

    L.innerHTML=h;

    setTimeout(()=>{

      $('#n3').style.display='inline-block';

    },n*90+600);

  },800);
};


/* wish */
function blow(){

  const c=$('#ck');

  if(c.classList.contains('out'))return;

  c.classList.add('out');

  $('#ws').textContent='Your wish is on its way 💫';

  boom(70);

  $('#blow').style.display='none';

  $('#micBlow').style.display='none';

  $('#micStatus').textContent='Candles blown! 🎂💜';

  setTimeout(()=>{
    $('#n4').style.display='inline-block';
  },900);
}


$('#blow').onclick=blow;

$('#ck').onclick=blow;


/* microphone */
let audioContext;
let analyser;
let microphone;
let micRunning=false;


async function startMic(){

  if(micRunning)return;

  if(!navigator.mediaDevices ||
     !navigator.mediaDevices.getUserMedia){

    $('#micStatus').textContent=
      'Microphone is not supported in this browser.';

    return;
  }

  try{

    const stream=
      await navigator.mediaDevices.getUserMedia({
        audio:true
      });

    audioContext=
      new (window.AudioContext ||
           window.webkitAudioContext)();

    analyser=audioContext.createAnalyser();

    analyser.fftSize=512;

    microphone=
      audioContext.createMediaStreamSource(stream);

    microphone.connect(analyser);

    micRunning=true;

    $('#micStatus').textContent=
      'Mic on — now blow toward your microphone 💨';

    detectBlow();

  }
  catch(err){

    $('#micStatus').textContent=
      'Please allow microphone access to use this feature.';

  }
}


function detectBlow(){

  if(!micRunning)return;

  const data=
    new Uint8Array(analyser.fftSize);

  analyser.getByteTimeDomainData(data);

  let sum=0;

  for(let i=0;i<data.length;i++){

    const value=(data[i]-128)/128;

    sum+=value*value;
  }

  const volume=Math.sqrt(sum/data.length);

  if(volume>0.12){

    blow();

    micRunning=false;

    if(microphone){
      microphone.disconnect();
    }

    if(audioContext){
      audioContext.close();
    }

    return;
  }

  requestAnimationFrame(detectBlow);
}


$('#micBlow').onclick=startMic;


/* cut cake */
(()=>{

  const b=$('#cutbox');
  const ln=$('#ln');

  let sx,sy,on=false,done=false;

  const pt=e=>{

    const r=b.getBoundingClientRect();

    return[
      (e.clientX-r.left)/r.width*250,
      (e.clientY-r.top)/r.height*160
    ];
  };


  b.onpointerdown=e=>{

    if(done)return;

    on=true;

    [sx,sy]=pt(e);

    b.setPointerCapture(e.pointerId);

    ln.setAttribute('x1',sx);
    ln.setAttribute('y1',sy);
  };


  b.onpointermove=e=>{

    if(!on)return;

    const[x,y]=pt(e);

    ln.setAttribute('x2',x);
    ln.setAttribute('y2',y);

    if(
      Math.hypot(x-sx,y-sy)>70 &&
      Math.abs(y-sy)>50
    ){

      on=false;
      done=true;

      b.classList.add('cut');

      ln.setAttribute('x2',sx);
      ln.setAttribute('y2',sy);

      boom(90);

      $('#cs').textContent=
        'Yay! Enjoy the sweetness 🍓';

      setTimeout(()=>{
        $('#n5').style.display='inline-block';
      },900);
    }
  };


  b.onpointerup=()=>{

    on=false;

    if(!done){
      ln.setAttribute('x2',sx);
      ln.setAttribute('y2',sy);
    }
  };

})();


/* videos */
let vi=0;

const vb=$('#vids');

for(let i=0;i<4;i++){

  vb.innerHTML+=
    `<div class="vid"
      style="${i?'display:none':''}"
      data-i="${i}">
      🎬 Loading video ${i+1}…
    </div>`;
}


vb.innerHTML+=
  `<div style="display:flex;justify-content:center;gap:12px">
    <button class="btn" style="margin:6px;padding:8px 18px" onclick="sv(-1)">‹</button>
    <button class="btn" style="margin:6px;padding:8px 18px" onclick="sv(1)">›</button>
  </div>`;


function sv(d){

  const a=[...vb.querySelectorAll('.vid')];

  a[vi].style.display='none';

  a[vi].querySelector('video')?.pause();

  vi=(vi+d+a.length)%a.length;

  a[vi].style.display='grid';
}


/* pop balloons */
const WORDS=[
  "You",
  "are",
  "very",
  "handsome bro!"
];

const PC=[
  '#f7a8d8',
  '#c084fc',
  '#ff8fc7',
  '#a78bfa'
];

let pn=0;


WORDS.forEach((w,i)=>{

  const d=document.createElement('div');

  d.className='pb';

  d.innerHTML=
    `<svg viewBox="0 0 80 110">
      <path d="M40 4C20 4 6 20 6 40c0 22 20 40 34 46 14-6 34-24 34-46C74 20 60 4 40 4z"
        fill="${PC[i]}"
        stroke="#8e44ad"
        stroke-width="3"/>

      <ellipse cx="26" cy="28" rx="7" ry="11"
        fill="#fff"
        opacity=".55"
        transform="rotate(25 26 28)"/>

      <path d="M40 86l-5 7h10z" fill="#8e44ad"/>

      <path d="M40 93c-7 7 7 10 0 16"
        fill="none"
        stroke="#8e44ad"
        stroke-width="2.5"/>
    </svg>`;


  d.onclick=()=>{

    if(d.classList.contains('gone'))return;

    d.classList.add('gone');

    for(let k=0;k<12;k++){

      const p=document.createElement('i');

      p.className='sp';

      const a=k/12*6.28;
      const r=40+Math.random()*30;

      p.style.cssText=
        `left:48px;
         top:48px;
         background:${PC[i]};
         --x:${Math.cos(a)*r}px;
         --y:${Math.sin(a)*r}px`;

      d.appendChild(p);
    }


    const b=document.createElement('b');

    b.textContent=WORDS[pn++];

    $('#said').innerHTML=
      pn===1?'':$('#said').innerHTML;

    $('#said').appendChild(b);

    $('#ph').style.display='none';

    boom(pn===4?100:10);

    if(pn===4){

      setTimeout(()=>{
        $('#n8').style.display='inline-block';
      },700);
    }
  };


  $('#pops').appendChild(d);

});


/* seal */
$('#seal').onclick=()=>{

  boom(160);

  $('#seal').textContent='Sealed with love 💜';

};


/* confetti */
function boom(n){

  for(let i=0;i<n;i++){

    const c=document.createElement('i');

    c.className='cf';

    c.style.cssText=
      `left:${Math.random()*100}vw;
       background:${[
         '#f06bb6',
         '#a855c8',
         '#ffc94d',
         '#ff8fc7',
         '#7c5cdb'
       ][i%5]};
       animation-delay:${Math.random()*.8}s;
       animation-duration:${2+Math.random()*2}s;
       border-radius:${i%2?'50%':'2px'}`;

    document.body.appendChild(c);

    setTimeout(()=>{
      c.remove();
    },4800);
  }
}


/* video files */
const VIDEOS=[
  "video1.mp4",
  "video2.mp4",
  "video3.mp4",
  "video4.mp4"
];

document.querySelectorAll('.vid').forEach((d,i)=>{

  if(VIDEOS[i]){

    d.innerHTML=
      '<video src="'+VIDEOS[i]+'" controls playsinline preload="metadata"></video>';
  }
});


/* =====================================================
   SCRATCH PHOTO
   ===================================================== */

(()=>{

  const wrap=$('#scratchWrap');
  const canvas=$('#scratchCanvas');
  const ctx=canvas.getContext('2d');

  const text=$('#scratchText');
  const next=$('#nPhoto');

  let scratching=false;
  let lastX=0;
  let lastY=0;
  let finished=false;
  let strokes=0;


  /* This runs ONLY when the photo page is visible */
  window.initScratch=function(){

    if(!wrap || !canvas)return;

    const r=wrap.getBoundingClientRect();

    /* If page is still hidden, try again */
    if(r.width===0 || r.height===0){

      setTimeout(window.initScratch,300);

      return;
    }


    const w=r.width;
    const h=r.height;


    /* High resolution canvas */
    canvas.width=Math.round(w*2);
    canvas.height=Math.round(h*2);

    canvas.style.width=w+'px';
    canvas.style.height=h+'px';


    /* Reset canvas */
    ctx.setTransform(1,0,0,1,0,0);

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    /* Purple cover */
    ctx.globalCompositeOperation='source-over';

    ctx.fillStyle='#c9a8d8';

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    /* Cover text */
    ctx.fillStyle='#ffffff';

    ctx.font='700 21px Nunito, sans-serif';

    ctx.textAlign='center';
    ctx.textBaseline='middle';

    ctx.fillText(
      'SCRATCH HERE ✨',
      canvas.width/2,
      canvas.height/2
    );


    /* Switch to erase mode */
    ctx.globalCompositeOperation='destination-out';

    strokes=0;
    finished=false;

    text.textContent=
      'Scratch to reveal the surprise ✨';

    next.style.display='none';
  };


  function point(e){

    const r=canvas.getBoundingClientRect();

    return{
      x:(e.clientX-r.left)*2,
      y:(e.clientY-r.top)*2
    };
  }


  canvas.addEventListener('pointerdown',e=>{

    if(finished)return;

    e.preventDefault();

    scratching=true;

    canvas.setPointerCapture(e.pointerId);

    const p=point(e);

    lastX=p.x;
    lastY=p.y;

  });


  canvas.addEventListener('pointermove',e=>{

    if(!scratching || finished)return;

    e.preventDefault();

    const p=point(e);

    ctx.beginPath();

    ctx.moveTo(lastX,lastY);

    ctx.lineTo(p.x,p.y);

    ctx.lineWidth=84;

    ctx.lineCap='round';

    ctx.lineJoin='round';

    ctx.stroke();

    lastX=p.x;
    lastY=p.y;

    strokes++;


    /* After enough scratching, reveal everything */
    if(strokes>=45){

      finished=true;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      text.textContent=
        'Surprise revealed! 💜';

      setTimeout(()=>{

        next.style.display='inline-block';

      },500);
    }

  });


  canvas.addEventListener('pointerup',e=>{

    scratching=false;

    try{
      canvas.releasePointerCapture(e.pointerId);
    }catch(err){}

  });


  canvas.addEventListener('pointercancel',()=>{

    scratching=false;

  });


})();


/* replay */
function replay(){

  location.reload();

}