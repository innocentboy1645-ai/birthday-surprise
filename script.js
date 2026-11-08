(function () {
  var PASSWORD = '9677';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Confetti ---------- */
  var cv = document.getElementById('confetti');
  var ctx = cv.getContext('2d');
  var parts = [];
  var raf = 0;
  function sizeCanvas() {
    var r = window.devicePixelRatio || 1;
    cv.width = Math.round(window.innerWidth * r);
    cv.height = Math.round(window.innerHeight * r);
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  window.addEventListener('resize', sizeCanvas);
  sizeCanvas();
  function palette() {
    var s = getComputedStyle(document.documentElement);
    return ['--gold-fill', '--teal', '--rose', '--gold'].map(function (k) { return s.getPropertyValue(k).trim() || '#e3b04b'; });
  }
  function burst(x, y, n, spread) {
    n = reduce ? Math.min(n, 16) : n;
    spread = spread || 1;
    var cols = palette();
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = (Math.random() * 7 + 3) * spread;
      parts.push({
        x: x, y: y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 5,
        w: Math.random() * 8 + 5, h: Math.random() * 5 + 3,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
        c: cols[i % cols.length], life: 0, max: 90 + Math.random() * 60
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    parts = parts.filter(function (p) { return p.life < p.max; });
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.vy += 0.25; p.vx *= 0.99;
      p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
      ctx.globalAlpha = Math.max(0, Math.min(1, (p.max - p.life) / 30));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (parts.length) { raf = requestAnimationFrame(tick); }
    else { raf = 0; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }

  /* ---------- Pages ---------- */
  var ROUTES = ['home', 'cake', 'about', 'letter'];
  var current = null;
  var unlocked = false;
  var main = document.getElementById('main');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));

  function routeFromHash() {
    var h = (window.location.hash || '').replace('#', '');
    return ROUTES.indexOf(h) > -1 ? h : 'home';
  }
  function show(name, force) {
    if (!force && name === current) return;
    ROUTES.forEach(function (r) { document.getElementById('page-' + r).hidden = (r !== name); });
    tabs.forEach(function (t) {
      if (t.getAttribute('data-go') === name) t.setAttribute('aria-current', 'page');
      else t.removeAttribute('aria-current');
    });
    if (name !== 'cake') stopMic();
    current = name;
    window.scrollTo(0, 0);
    var h = document.getElementById('h-' + name);
    if (h && h.focus) { try { h.focus({ preventScroll: true }); } catch (e) {} }
  }
  function go(name) {
    try { if (window.location.hash !== '#' + name) window.location.hash = name; } catch (e) {}
    show(name);
  }
  window.addEventListener('hashchange', function () { if (unlocked) show(routeFromHash()); });
  main.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-go]') : null;
    if (b) go(b.getAttribute('data-go'));
  });

  /* ---------- Lock keypad ---------- */
  var lock = document.getElementById('lock');
  var dotsBox = document.getElementById('dots');
  var dots = Array.prototype.slice.call(document.querySelectorAll('.dot'));
  var err = document.getElementById('err');
  var code = '';
  var busy = false;

  function render() {
    dots.forEach(function (d, i) { d.classList.toggle('on', i < code.length); });
    dotsBox.setAttribute('aria-label', code.length ? code.length + ' of 4 digits entered' : 'No digits entered yet');
  }
  function add(d) {
    if (busy || code.length >= 4) return;
    code += d;
    err.textContent = '';
    render();
    if (code.length === 4) setTimeout(check, 180);
  }
  function back() {
    if (busy) return;
    code = code.slice(0, -1);
    err.textContent = '';
    render();
  }
  function unlock() {
    busy = true;
    dotsBox.classList.add('ok');
    lock.classList.add('leaving');
    setTimeout(function () {
      lock.hidden = true;
      main.hidden = false;
      unlocked = true;
      show(routeFromHash(), true);
      var w = window.innerWidth, h = window.innerHeight;
      burst(w * 0.25, h * 0.35, 80, 1);
      burst(w * 0.75, h * 0.35, 80, 1);
      setTimeout(function () { burst(w * 0.5, h * 0.25, 90, 1.1); }, 250);
    }, reduce ? 0 : 450);
  }
  function check() {
    if (code === PASSWORD) { unlock(); return; }
    err.textContent = 'Wrong password. Please try again.';
    dotsBox.classList.remove('shake');
    void dotsBox.offsetWidth;
    dotsBox.classList.add('shake');
    busy = true;
    setTimeout(function () { code = ''; busy = false; render(); }, 380);
  }
  document.getElementById('keypad').addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button[data-k]') : null;
    if (!b) return;
    var k = b.getAttribute('data-k');
    if (k === 'back') back(); else add(k);
  });
  document.addEventListener('keydown', function (e) {
    if (lock.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) { add(e.key); }
    else if (e.key === 'Backspace') { back(); }
  });
  render();

  /* ---------- Cake: blow out the candles ---------- */
  var cake = document.getElementById('cakeArt');
  var flames = Array.prototype.slice.call(cake.querySelectorAll('.flame'));
  var smokes = Array.prototype.slice.call(cake.querySelectorAll('.smoke'));
  var micBtn = document.getElementById('micBtn');
  var holdBtn = document.getElementById('holdBtn');
  var blowCtl = document.getElementById('blowCtl');
  var meterFill = document.getElementById('meterFill');
  var statusEl = document.getElementById('status');
  var leadEl = document.getElementById('lead');
  var progress = 0;
  var finished = false;
  var outCount = 0;

  function setStatus(t) { statusEl.textContent = t; }

  function setProgress(p) {
    if (finished) return;
    progress = Math.max(progress, Math.min(1, p));
    meterFill.style.width = Math.round(progress * 100) + '%';
    var shouldBeOut = Math.floor(progress * flames.length + 0.0001);
    while (outCount < shouldBeOut && outCount < flames.length) {
      flames[outCount].classList.add('out');
      smokes[outCount].classList.add('out');
      outCount++;
    }
    if (progress >= 1) finish();
  }
  function finish() {
    if (finished) return;
    finished = true;
    for (var i = outCount; i < flames.length; i++) { flames[i].classList.add('out'); smokes[i].classList.add('out'); }
    outCount = flames.length;
    meterFill.style.width = '100%';
    stopMic();
    stopHold();
    blowCtl.hidden = true;
    leadEl.textContent = 'Beautifully done, Papa.';
    setStatus('All the candles are out. May every wish come true. Ameen.');
    var r = cake.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height * 0.3, 110, 1.1);
  }

  /* Hold to blow (works everywhere) */
  var holding = false;
  var holdRaf = 0;
  var lastT = 0;
  function holdTick(t) {
    if (!holding || finished) { holdRaf = 0; return; }
    var dt = Math.min(0.05, (t - lastT) / 1000);
    lastT = t;
    setProgress(progress + dt / 1.3);
    holdRaf = requestAnimationFrame(holdTick);
  }
  function startHold() {
    if (finished || holding) return;
    holding = true;
    holdBtn.classList.add('holding');
    setStatus('Keep blowing...');
    lastT = performance.now();
    holdRaf = requestAnimationFrame(holdTick);
  }
  function stopHold() {
    if (!holding) return;
    holding = false;
    holdBtn.classList.remove('holding');
    if (!finished) setStatus(progress > 0 ? 'Almost there. Keep going.' : 'The candles are lit.');
  }
  holdBtn.addEventListener('pointerdown', function (e) {
    try { holdBtn.setPointerCapture(e.pointerId); } catch (x) {}
    startHold();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { holdBtn.addEventListener(ev, stopHold); });
  holdBtn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  holdBtn.addEventListener('keydown', function (e) {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); }
  });
  holdBtn.addEventListener('keyup', function (e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); stopHold(); }
  });

  /* Microphone blow detection (needs microphone permission) */
  var mic = { stream: null, ac: null, raf: 0 };
  function stopMic() {
    if (mic.raf) { cancelAnimationFrame(mic.raf); mic.raf = 0; }
    if (mic.stream) { mic.stream.getTracks().forEach(function (t) { t.stop(); }); mic.stream = null; }
    if (mic.ac) { try { mic.ac.close(); } catch (e) {} mic.ac = null; }
    micBtn.disabled = false;
  }
  function micUnavailable() {
    stopMic();
    setStatus('The microphone is not available on this page. Press and hold the button below to blow instead.');
    try { holdBtn.focus(); } catch (e) {}
  }
  micBtn.addEventListener('click', function () {
    if (finished || mic.stream) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { micUnavailable(); return; }
    micBtn.disabled = true;
    setStatus('Allow the microphone, then blow gently towards your phone.');
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
      .then(function (stream) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { stream.getTracks().forEach(function (t) { t.stop(); }); micUnavailable(); return; }
        mic.stream = stream;
        mic.ac = new AC();
        var src = mic.ac.createMediaStreamSource(stream);
        var an = mic.ac.createAnalyser();
        an.fftSize = 1024;
        src.connect(an);
        var buf = new Uint8Array(an.fftSize);
        var started = performance.now();
        var last = started;
        setStatus('Listening... blow towards your phone.');
        function loop(now) {
          if (!mic.stream || finished) return;
          an.getByteTimeDomainData(buf);
          var sum = 0;
          for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
          var rms = Math.sqrt(sum / buf.length);
          var dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          if (rms > 0.12) setProgress(progress + dt / 1.1);
          if (now - started > 20000) {
            stopMic();
            setStatus('I could not hear a blow. Try again, or press and hold the button below.');
            return;
          }
          mic.raf = requestAnimationFrame(loop);
        }
        mic.raf = requestAnimationFrame(loop);
      })
      .catch(function () { micUnavailable(); });
  });
})();
