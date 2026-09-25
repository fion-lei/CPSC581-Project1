

const SHEET_LAYOUT = {
  frameWidth: 64,
  frameHeight: 64,
  columns: 6, 
  animations: {
    //         row  frames  fps  after finishing
    idle:    { row: 0, frames: 4, fps: 6,  end: 'loop' },
    attack:  { row: 1, frames: 6, fps: 12, end: 'idle' },
    defense: { row: 2, frames: 4, fps: 8,  end: 'idle' },
    hurt:    { row: 3, frames: 4, fps: 10, end: 'idle' },
    death:   { row: 4, frames: 6, fps: 8,  end: 'hold' },
    heal:    { row: 5, frames: 6, fps: 8,  end: 'idle' },
  },
};

class SpriteCharacter {
  constructor(el, { sheet, scale = 4, facing = 'right', layout = SHEET_LAYOUT }) {
    this.el = el;
    this.layout = layout;
    this.scale = Math.max(1, Math.round(scale));
    this.current = null;
    this.frame = 0;
    this.dead = false;
    this._raf = null;
    this._resolve = null;

    const { frameWidth: fw, frameHeight: fh, columns } = layout;
    const rows = Object.keys(layout.animations).length;
    el.classList.add('sprite');
    Object.assign(el.style, {
      width: `${fw * this.scale}px`,
      height: `${fh * this.scale}px`,
      backgroundImage: `url("${encodeURI(sheet)}")`,
      backgroundSize: `${columns * fw * this.scale}px ${rows * fh * this.scale}px`,
    });
    this.face(facing);
    this.play('idle');
  }

  face(dir) {
    // Sheets are drawn facing right, mirror for characters on the right side.
    this.el.style.transform = dir === 'left' ? 'scaleX(-1)' : '';
  }

  play(name) {
    const anim = this.layout.animations[name];
    if (!anim) throw new Error(`Unknown animation "${name}"`);
    if (this.dead && name !== 'idle') return Promise.resolve(); // revive() to reset

    cancelAnimationFrame(this._raf);
    if (this._resolve) this._resolve(); // settle the interrupted animation
    this.current = name;
    this.frame = 0;
    this.dead = name === 'death';
    this.el.dataset.anim = name;

    return new Promise((resolve) => {
      this._resolve = resolve;
      const frameMs = 1000 / anim.fps;
      let last = performance.now();
      this._draw(anim);

      const tick = (now) => {
        if (now - last >= frameMs) {
          last = now;
          this.frame++;
          if (this.frame >= anim.frames) {
            if (anim.end === 'loop') {
              this.frame = 0;
            } else {
              this._resolve = null;
              resolve();
              if (anim.end === 'hold') {
                this.frame = anim.frames - 1;
                this._draw(anim);
                return;
              }
              this.play(anim.end);
              return;
            }
          }
          this._draw(anim);
        }
        this._raf = requestAnimationFrame(tick);
      };
      this._raf = requestAnimationFrame(tick);
    });
  }

  revive() {
    this.dead = false;
    return this.play('idle');
  }

  _draw(anim) {
    const { frameWidth: fw, frameHeight: fh } = this.layout;
    const x = -this.frame * fw * this.scale;
    const y = -anim.row * fh * this.scale;
    this.el.style.backgroundPosition = `${x}px ${y}px`;
  }
}

window.SpriteCharacter = SpriteCharacter;
window.SHEET_LAYOUT = SHEET_LAYOUT;
