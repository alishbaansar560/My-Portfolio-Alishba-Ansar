/* audio.js — Web Audio API (sage green UI) */
(function () {
  let ctx = null, master = null, started = false, muted = false;

  function pinkNoise(ac, sec) {
    const sr = ac.sampleRate;
    const buf = ac.createBuffer(1, sr * sec, sr);
    const d = buf.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random()*2-1;
      b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
      b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
      b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
      d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)/9; b6=w*0.115926;
    }
    return buf;
  }

  function synthPad(ac, dest) {
    [55, 82.41, 110, 164.81].forEach((freq, i) => {
      const osc=ac.createOscillator(), g=ac.createGain();
      const lfo=ac.createOscillator(), lg=ac.createGain();
      osc.type='sine'; osc.frequency.value=freq;
      lfo.type='sine'; lfo.frequency.value=0.07+i*0.025;
      lg.gain.value=freq*0.012;
      lfo.connect(lg); lg.connect(osc.frequency);
      osc.connect(g); g.connect(dest);
      g.gain.value=0.04/(i+1);
      osc.start(); lfo.start();
    });
  }

  function breeze(ac, dest) {
    const buf=pinkNoise(ac,4), src=ac.createBufferSource();
    const f=ac.createBiquadFilter(), g=ac.createGain();
    src.buffer=buf; src.loop=true;
    f.type='bandpass'; f.frequency.value=700; f.Q.value=0.5;
    g.gain.value=0.07;
    src.connect(f); f.connect(g); g.connect(dest); src.start();
  }

  function birds(ac, dest) {
    function chirp() {
      const o=ac.createOscillator(), g=ac.createGain();
      o.connect(g); g.connect(dest);
      const bf=1800+Math.random()*1400;
      o.type='sine';
      o.frequency.setValueAtTime(bf, ac.currentTime);
      o.frequency.exponentialRampToValueAtTime(bf*1.5, ac.currentTime+0.1);
      o.frequency.exponentialRampToValueAtTime(bf, ac.currentTime+0.22);
      g.gain.setValueAtTime(0, ac.currentTime);
      g.gain.linearRampToValueAtTime(0.022, ac.currentTime+0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime+0.28);
      o.start(); o.stop(ac.currentTime+0.3);
      setTimeout(chirp, 2200+Math.random()*5500);
    }
    setTimeout(chirp, 1000+Math.random()*3000);
  }

  function water(ac, dest) {
    const buf=pinkNoise(ac,3), src=ac.createBufferSource();
    const f=ac.createBiquadFilter(), g=ac.createGain();
    src.buffer=buf; src.loop=true;
    f.type='highpass'; f.frequency.value=1400; f.Q.value=2;
    g.gain.value=0.035;
    src.connect(f); f.connect(g); g.connect(dest); src.start();
  }

  function startAudio() {
    if (started) return; started=true;
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    window.audioCtx = ctx;
    master = ctx.createGain(); master.gain.value=0.65;
    master.connect(ctx.destination);
    synthPad(ctx, master); breeze(ctx, master);
    birds(ctx, master); water(ctx, master);
  }

  const btn    = document.getElementById('audio-toggle');
  const iOn    = document.getElementById('icon-on');
  const iOff   = document.getElementById('icon-off');

  btn.addEventListener('click', () => {
    if (!started) startAudio();
    muted = !muted;
    if (muted) {
      master.gain.setTargetAtTime(0,   ctx.currentTime, 0.3);
      iOn.style.display='none'; iOff.style.display='block';
    } else {
      master.gain.setTargetAtTime(0.65, ctx.currentTime, 0.3);
      iOn.style.display='block'; iOff.style.display='none';
    }
  });

  const go = () => { startAudio(); document.removeEventListener('click',go); document.removeEventListener('scroll',go); };
  document.addEventListener('click',  go);
  document.addEventListener('scroll', go);
})();