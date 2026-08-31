/* scramble.js — text scramble for project cards */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#01ABCDEF';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    const p   = new Promise(r => this.resolve = r);
    this.queue = [];
    for (let i = 0; i < len; i++) {
      this.queue.push({
        from:  old[i]     || '',
        to:    newText[i] || '',
        start: Math.floor(Math.random() * 10),
        end:   Math.floor(Math.random() * 10) + Math.floor(Math.random() * 8),
      });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return p;
  }
  update() {
    let out = '', done = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        done++; out += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.3) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        out += `<span style="color:#4ecb71;opacity:0.65">${char}</span>`;
      } else { out += from; }
    }
    this.el.innerHTML = out;
    if (done === this.queue.length) { this.resolve(); }
    else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pcard').forEach(card => {
    const descEl     = card.querySelector('.pcard-desc');
    const scrambleEl = card.querySelector('.pcard-scramble');
    const stack      = (card.dataset.stack || '').split(',').map(s => s.trim());
    const fx         = new TextScramble(scrambleEl);
    let hovering     = false;

    card.addEventListener('mouseenter', () => {
      hovering = true;
      let i = 0;
      const cycle = () => {
        if (!hovering) return;
        fx.setText(stack[i % stack.length]).then(() => {
          if (!hovering) return;
          setTimeout(() => {
            i++;
            if (i < stack.length * 2) cycle();
            else fx.setText(stack.join(' // '));
          }, 160);
        });
      };
      cycle();

      // click sound
      if (window.audioCtx && window.audioCtx.state === 'running') {
        const o = window.audioCtx.createOscillator();
        const g = window.audioCtx.createGain();
        o.connect(g); g.connect(window.audioCtx.destination);
        o.frequency.value = 500 + Math.random() * 600;
        o.type = 'square';
        g.gain.setValueAtTime(0.035, window.audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, window.audioCtx.currentTime + 0.055);
        o.start(); o.stop(window.audioCtx.currentTime + 0.06);
      }
    });

    card.addEventListener('mouseleave', () => {
      hovering = false;
      scrambleEl.innerHTML = stack.join(' // ');
    });
  });
});