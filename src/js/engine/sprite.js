const SHEET_LAYOUT = {
  frameWidth: 64,
  frameHeight: 64,
  columns: 6, // sheet is 6 frames x 8 rows = 384x512
  animations: {
    //         row  frames  fps  after finishing
    idle:    { row: 0, frames: 4, fps: 6,  end: 'loop' },
    attack:  { row: 1, frames: 6, fps: 12, end: 'idle' },
    defense: { row: 2, frames: 4, fps: 8,  end: 'idle' },
    hurt:    { row: 3, frames: 4, fps: 10, end: 'idle' },
    death:   { row: 4, frames: 6, fps: 8,  end: 'hold' },
    heal:    { row: 5, frames: 6, fps: 8,  end: 'idle' },
    attackUp:  { row: 6, frames: 6, fps: 8, end: 'idle' },
    defenseUp: { row: 7, frames: 6, fps: 8, end: 'idle' },
  },
};

function animationsFromSheet(sheet, layout = SHEET_LAYOUT) {
  const { frameWidth, frameHeight, columns, animations } = layout;
  const sheetRows = Object.keys(animations).length;
  const out = {};
  for (const [name, a] of Object.entries(animations)) {
    out[name] = {
      sheet,
      frameW: frameWidth,
      frameH: frameHeight,
      columns,
      sheetRows,
      row: a.row,
      frames: a.frames,
      fps: a.fps,
      end: a.end,
    };
  }
  return out;
}

function animationsFromFiles(defs) {
  const out = {};
  for (const [name, d] of Object.entries(defs)) {
    out[name] = {
      sheet: d.sheet,
      frameW: d.frameW,
      frameH: d.frameH,
      columns: d.frameCount,
      sheetRows: 1,
      row: 0,
      frames: d.frameCount,
      fps: d.fps ?? 8,
      end: d.end ?? 'idle',
    };
  }
  return out;
}

class SpriteCharacter {
  constructor(el, { animations, scale = 4, facing = 'right' }) {
    this.el = el;
    this.animations = animations;
    this.scale = Math.max(1, Math.round(scale));
    this.current = null;
    this.frame = 0;
    this.dead = false;
    this._raf = null;
    this._resolve = null;
    this._loadedSheet = null;

    el.classList.add('sprite');
    this.face(facing);
    this.play('idle');
  }

  face(dir) {
    // Sheets are drawn facing right, mirror for characters on the right side.
    this.el.style.transform = dir === 'left' ? 'scaleX(-1)' : '';
  }

  play(name) {
    const anim = this.animations[name];
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
    if (this._loadedSheet !== anim.sheet) {
      this._loadedSheet = anim.sheet;
      Object.assign(this.el.style, {
        width: `${anim.frameW * this.scale}px`,
        height: `${anim.frameH * this.scale}px`,
        backgroundImage: `url("${encodeURI(anim.sheet)}")`,
        backgroundSize: `${anim.columns * anim.frameW * this.scale}px ${anim.sheetRows * anim.frameH * this.scale}px`,
      });
    }
    const x = -this.frame * anim.frameW * this.scale;
    const y = -anim.row * anim.frameH * this.scale;
    this.el.style.backgroundPosition = `${x}px ${y}px`;
  }
}

window.SHEET_LAYOUT = SHEET_LAYOUT;
window.animationsFromSheet = animationsFromSheet;
window.animationsFromFiles = animationsFromFiles;
window.SpriteCharacter = SpriteCharacter;