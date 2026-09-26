const BANNER_IMAGE = "sprites/ui/Sprites/Paper UI Pack/Plain/2 Headers/4.png";
const BANNER_SIZE = { width: 448, height: 128 };
const BANNER_FRAME_DIR = "sprites/ui/Sprites/Content Appear Animation/Plain/1 Headers/4";
const BANNER_FRAMES = Array.from({ length: 28 }, (_, i) => `${BANNER_FRAME_DIR}/${i + 1}.png`);
const BANNER_FRAME_SIZE = { width: 352, height: 80 };
const BANNER_FRAME_OFFSET = { x: 48, y: 16 }; // where the animation's band sits on the ribbon
const BANNER_FRAME_MS = 16;

const BANNER_BAND = { cx: 224, cy: 52, width: 322 };
const BANNER_FONT_PX = 40;

BANNER_FRAMES.forEach((src) => { new Image().src = encodeURI(src); });

class TurnBanner {
  constructor(el) {
    this.el = el;
    this.text = null;
    this.frame = BANNER_FRAMES.length - 1; // 0 = text whole, last = text gone
    this._queue = Promise.resolve();

    const { width, height } = BANNER_SIZE;
    const frame = { ...BANNER_FRAME_OFFSET, ...BANNER_FRAME_SIZE };
    const { cx, cy } = BANNER_BAND;

    el.classList.add("turn-banner");
    el.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
        <defs>
          <mask id="turn-banner-mask" maskUnits="userSpaceOnUse" style="mask-type: alpha">
            <image x="${frame.x}" y="${frame.y}" width="${frame.width}" height="${frame.height}" />
          </mask>
        </defs>
        <image href="${encodeURI(BANNER_IMAGE)}" width="${width}" height="${height}" />
        <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
              mask="url(#turn-banner-mask)"></text>
      </svg>
    `;
    this.maskImage = el.querySelector("mask image");
    this.textEl = el.querySelector("text");
    this._draw();
  }

  // Changing text plays text burn-away -> new text -> burn-in. Calls queue up so
  // quick turn changes each play in order; repeating the same text is a no-op.
  setText(text) {
    this._queue = this._queue.then(() => this._change(text));
    return this._queue;
  }

  async _change(text) {
    if (text === this.text) return;
    this.el.setAttribute("aria-label", text);
    await this._animateTo(BANNER_FRAMES.length - 1);
    this.text = text;
    this.textEl.textContent = text;
    await document.fonts.ready; // measure in Monogram, not the fallback font
    this._fitText();
    await this._animateTo(0);
  }

  // Text past either end of the band isn't drawn, so shrink long text to fit.
  _fitText() {
    this.textEl.style.fontSize = `${BANNER_FONT_PX}px`;
    const room = BANNER_BAND.width * 0.95;
    const width = this.textEl.getComputedTextLength();
    if (width > room) this.textEl.style.fontSize = `${(BANNER_FONT_PX * room) / width}px`;
  }

  _animateTo(target) {
    return new Promise((resolve) => {
      const step = () => {
        if (this.frame === target) return resolve();
        this.frame += target > this.frame ? 1 : -1;
        this._draw();
        setTimeout(step, BANNER_FRAME_MS);
      };
      step();
    });
  }

  _draw() {
    this.maskImage.setAttribute("href", encodeURI(BANNER_FRAMES[this.frame]));
  }
}

window.TurnBanner = TurnBanner;
