const $ = (s) => document.querySelector(s);

let current = 0;

function go(n) {
  document.querySelectorAll('.pg').forEach((p, i) => {
    p.classList.toggle('on', i === n);
  });

  current = n;

  if (n === 3) setTimeout(showLetter, 50);
  if (n === 8 && window.initScratch) setTimeout(() => window.initScratch(), 100);
}

/* =========================
LETTER
========================= */

function showLetter() {
  const letter = $("#letter");
  if (!letter) return;

  letter.innerHTML = `
    Dear 오빠,
    <p>Happy Birthday! 🎉 You are the best brother a person could ask for.</p>
    <p>I’m so grateful to have you in my life. I want you by my side for the rest of my life, my brother. ❤️</p>
    <p>I wish you all the happiness in the world, and I hope this year brings you everything you’ve been hoping for.</p>
    <p>I want you to become the best cricketer in the world. ❤️ You are my best friend and my brother, and I love you so much.</p>
    <p>I hope you have an amazing birthday filled with love, laughter, and all your favorite things.</p>
    <p>I’ve never opened up to anyone the way I do with you—not even with Alishba or Mubashra.</p>
    <p>I don’t know how I became so attached to you, but somehow, I have. And now, you mean so much to me.</p>
    <p>I just hope you’ll always keep my trust safe and never break it. ❤️</p>
    <p>Happy Birthday once again, 오빠! 🎂❤️</p>
  `;
}

/* =========================
LOCK / PIN
========================= */

const pin = "2828";
let entered = "";

function updateDots() {
  const dots = document.querySelectorAll("#dots span");
  dots.forEach((dot, i) => dot.classList.toggle("filled", i < entered.length));
}

function pressKey(num) {
  if (entered.length >= 4) return;

  entered += num;
  updateDots();

  if (entered.length === 4) {
    setTimeout(() => {
      if (entered === pin) {
        go(1);
      } else {
        entered = "";
        updateDots();
        if ($("#lockMsg")) $("#lockMsg").textContent = "Wrong PIN 💜";
      }
    }, 250);
  }
}

document.querySelectorAll("#kb button").forEach(btn => {
  btn.onclick = () => pressKey(btn.dataset.n);
});

/* =========================
LOADER
========================= */

let progress = 0;

const loader = setInterval(() => {
  progress += 2;

  if ($("#lp")) $("#lp").textContent = progress + "%";
  if ($("#lb")) $("#lb").style.width = progress + "%";

  if (progress >= 100) {
    clearInterval(loader);
    setTimeout(() => { go(2); }, 500);
  }
}, 35);

/* =========================
LETTER OPEN
========================= */

if ($("#openLetter")) {
  $("#openLetter").onclick = () => go(3);
}

/* =========================
WISH / CANDLES
========================= */

function blow() {
  const c = $("#ck");
  if (!c || c.classList.contains("out")) return;

  c.classList.add("out");

  if ($("#ws")) $("#ws").textContent = "Your wish is on its way 💫";
  if (typeof boom === "function") boom(70);

  if ($("#micBlow")) $("#micBlow").style.display = "none";
  if ($("#micStatus")) $("#micStatus").textContent = "Candles blown! 🎂💜";

  setTimeout(() => {
    if ($("#n4")) $("#n4").style.display = "inline-block";
  }, 900);
}

/* =========================
MICROPHONE
========================= */

let audioContext;
let analyser;
let microphone;
let micRunning = false;

async function startMic() {
  if (micRunning) return;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if ($("#micStatus")) $("#micStatus").textContent =
      "Microphone is not supported in this browser.";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    micRunning = true;

    if ($("#micStatus")) $("#micStatus").textContent =
      "Mic on — now blow toward your microphone 💨";

    detectBlow();
  } catch (err) {
    if ($("#micStatus")) $("#micStatus").textContent =
      "Please allow microphone access to use this feature.";
  }
}

function detectBlow() {
  if (!micRunning) return;

  const data = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const value = (data[i] - 128) / 128;
    sum += value * value;
  }

  const volume = Math.sqrt(sum / data.length);

  if (volume > 0.12) {
    blow();
    micRunning = false;
    if (microphone) microphone.disconnect();
    if (audioContext) audioContext.close();
    return;
  }

  requestAnimationFrame(detectBlow);
}

if ($("#micBlow")) $("#micBlow").onclick = startMic;

/* =========================
CAKE CUT
========================= */

let cutting = false;

if ($("#cutbox")) $("#cutbox").addEventListener("pointerdown", startCut);

function startCut(e) {
  if (cutting) return;
  cutting = true;

  const box = $("#cutbox");
  const rect = box.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  const line = $("#ln");

  if (line) {
    line.setAttribute("x1", sx);
    line.setAttribute("y1", sy);
    line.setAttribute("x2", sx);
    line.setAttribute("y2", sy);
  }

  function move(ev) {
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    if (line) {
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
    }
  }

  function endCut() {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", endCut);

    if (line) {
      line.setAttribute("x2", sx);
      line.setAttribute("y2", sy);
    }

    cutting = false;
    if ($("#cutMsg")) $("#cutMsg").textContent = "Cake cut! 🎂💜";
    if ($("#n5")) $("#n5").style.display = "inline-block";
    if (typeof boom === "function") boom(45);
  }

  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", endCut);
}

/* =========================
BALLOONS
========================= */

function createPopBalloon() {
  const pops = $("#pops");
  if (!pops) return;

  const balloon = document.createElement("div");
  balloon.className = "pop-balloon";

  balloon.style.left = Math.random() * 80 + 10 + "%";
  balloon.style.top = Math.random() * 65 + 10 + "%";

  balloon.onclick = () => {
    balloon.classList.add("popped");

    if (typeof boom === "function") boom(20);

    setTimeout(() => {
      balloon.remove();

      if (!document.querySelector(".pop-balloon")) {
        if ($("#said")) $("#said").textContent = "You popped them all! 🎈💜";
        if ($("#n8")) $("#n8").style.display = "inline-block";
      }
    }, 250);
  };

  pops.appendChild(balloon);
}

function setupPops() {
  const pops = $("#pops");
  if (!pops) return;

  pops.innerHTML = "";
  for (let i = 0; i < 12; i++) createPopBalloon();
}

/* =========================
SCRATCH PHOTO
========================= */

window.initScratch = function () {
  const canvas = $("#scratchCanvas");
  const wrap = $("#scratchWrap");
  if (!canvas || !wrap) return;

  const rect = wrap.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#b993c8";
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.font = "bold 18px Nunito";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Scratch me ✨", rect.width / 2, rect.height / 2);

  ctx.globalCompositeOperation = "destination-out";

  let scratching = false;
  let scratched = 0;

  function scratch(e) {
    if (!scratching) return;

    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    scratched++;

    if (scratched > 80) {
      canvas.style.pointerEvents = "none";
      if ($("#scratchText")) $("#scratchText").textContent = "Surprise revealed! 💜";
      if ($("#nPhoto")) $("#nPhoto").style.display = "inline-block";
    }
  }

  canvas.onpointerdown = e => {
    scratching = true;
    scratch(e);
  };
  canvas.onpointermove = scratch;
  canvas.onpointerup = () => scratching = false;
  canvas.onpointercancel = () => scratching = false;
};

/* =========================
NAVIGATION
========================= */

if ($("#n2")) $("#n2").onclick = () => go(3);
if ($("#n3")) $("#n3").onclick = () => go(4);
if ($("#n4")) $("#n4").onclick = () => go(5);
if ($("#n5")) $("#n5").onclick = () => go(6);

if ($("#n7")) {
  $("#n7").onclick = () => {
    setupPops();
    go(7);
  };
}

if ($("#n8")) $("#n8").onclick = () => go(8);
if ($("#nPhoto")) $("#nPhoto").onclick = () => go(9);

/* =========================
REPLAY
========================= */

if ($("#replay")) $("#replay").onclick = () => location.reload();

/* =========================
CONFETTI
========================= */

function boom(count = 50) {
  const fx = $("#fx");
  if (!fx) return;

  const ctx = fx.getContext("2d");
  fx.width = window.innerWidth;
  fx.height = window.innerHeight;

  const pieces = [];

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 3,
      size: Math.random() * 5 + 2,
      life: 100
    });
  }

  function animate() {
    ctx.clearRect(0, 0, fx.width, fx.height);
    let alive = false;

    pieces.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.life--;

      ctx.globalAlpha = p.life / 100;
      ctx.fillStyle = `hsl(${Math.random() * 360},80%,70%)`;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    ctx.globalAlpha = 1;

    if (alive) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, fx.width, fx.height);
  }

  animate();
}

/* =========================
FLOATING BALLOONS
========================= */

function floatingBalloons() {
  const container = $("#balloons");
  if (!container) return;

  container.innerHTML = "";

  const colors = [
    "#f06bb6",
    "#a855c8",
    "#7c5cdb",
    "#ff8fc7",
    "#c084fc"
  ];

  for (let i = 0; i < 16; i++) {
    const b = document.createElement("div");
    b.className = "bl";
    b.style.left = Math.random() * 100 + "%";
    b.style.animationDelay = Math.random() * 5 + "s";
    b.style.borderColor = colors[i % colors.length];
    container.appendChild(b);
  }
}

floatingBalloons();

/* =========================
START
========================= */

go(0);
