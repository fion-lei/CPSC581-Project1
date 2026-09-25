

const BANNER_IMAGE = "sprites/ui/Sprites/Content/10 Banners & Headers/Cutout/1.png";
const BANNER_SIZE = { width: 576, height: 160 };
const BANNER_FRAME_DIR = "sprites/ui/Sprites/Content Appear Animation/Plain/1 Headers/1";
const BANNER_FRAMES = Array.from({ length: 35 }, (_, i) => `${BANNER_FRAME_DIR}/${i + 1}.png`);
const BANNER_FRAME_SIZE = { width: 480, height: 112 };
const BANNER_FRAME_OFFSET = { x: 48, y: 16 }; // where the animation's band sits on the ribbon
const BANNER_FRAME_MS = 16;


const BANNER_ARC = { cx: 288, cy: 608, r: 564, x0: 78, x1: 498 };
const BANNER_FONT_PX = 52;

BANNER_FRAMES.forEach((src) => { new Image().src = encodeURI(src); });

class TurnBanner {
  constructor(el) {
    this.el = el;
    this.text = null;
    this.frame = BANNER_FRAMES.length - 1; // 0 = text whole, last = text gone
    this._queue = Promise.resolve();

    const { width, height } = BANNER_SIZE;
    const frame = { ...BANNER_FRAME_OFFSET, ...BANNER_FRAME_SIZE };
    const { cx, cy, r, x0, x1 } = BANNER_ARC;
    const arcY = (x) => cy - Math.sqrt(r * r - (x - cx) ** 2);

    el.classList.add("turn-banner");
    el.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
        <defs>
          <path id="turn-banner-arc" fill="none"
                d="M ${x0} ${arcY(x0)} A ${r} ${r} 0 0 1 ${x1} ${arcY(x1)}" />
          <mask id="turn-banner-mask" maskUnits="userSpaceOnUse" style="mask-type: alpha">
            <image x="${frame.x}" y="${frame.y}" width="${frame.width}" height="${frame.height}" />
          </mask>
        </defs>
        <image href="${encodeURI(BANNER_IMAGE)}" width="${width}" height="${height}" />
        <text mask="url(#turn-banner-mask)"><textPath href="#turn-banner-arc" startOffset="50%"></textPath></text>
      </svg>
    `;
    this.arc = el.querySelector("path");
    this.maskImage = el.querySelector("mask image");
    this.textEl = el.querySelector("text");
    this.textPath = el.querySelector("textPath");
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
    this.textPath.textContent = text;
    await document.fonts.ready; // measure in Monogram, not the fallback font
    this._fitText();
    await this._animateTo(0);
  }

  // Text past either end of the arc isn't drawn, so shrink long text to fit.
  _fitText() {
    this.textEl.style.fontSize = `${BANNER_FONT_PX}px`;
    const room = this.arc.getTotalLength() * 0.95;
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
