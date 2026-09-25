const HP_BAR_SHEET = "sprites/ui/Pixel UI pack 3/06.png";
const HP_BAR_SHEET_SIZE = { width: 256, height: 240 };

const HP_BAR_LAYOUT = {
  frameWidth: 42,
  frameHeight: 7,
  frameGapX: 48,  // distance between frame starts
  offsetX: 3,     // x of the first (full) frame
  frameCount: 5,
  rows: {         // y of each row on the sheet
    party: 37,    // 3rd row: green
    monster: 69,  // 5th row: red
  },
};

class HpBar {
  constructor(el, { variant = "party", scale = 4 } = {}) {
    this.el = el;
    this.scale = Math.max(1, Math.round(scale));

    const { frameWidth, frameHeight, frameCount } = HP_BAR_LAYOUT;
    this.width = frameWidth * this.scale;
    el.classList.add("hp-bar-sprite");
    Object.assign(el.style, this._frameStyle(variant, frameCount - 1), {
      position: "relative",
      width: `${this.width}px`,
      height: `${frameHeight * this.scale}px`,
    });

    this.fillEl = document.createElement("div");
    Object.assign(this.fillEl.style, this._frameStyle(variant, 0), {
      position: "absolute",
      inset: "0 auto 0 0",
    });
    el.appendChild(this.fillEl);
    this.setPct(1);
  }

  setPct(pct) {
    const clamped = Math.max(0, Math.min(1, pct));
    this.fillEl.style.width = `${Math.round(clamped * this.width)}px`;
  }

  // Background styles that show one frame (column) of this variant's row.
  _frameStyle(variant, column) {
    const { offsetX, frameGapX, rows } = HP_BAR_LAYOUT;
    const x = -(offsetX + column * frameGapX) * this.scale;
    const y = -rows[variant] * this.scale;
    return {
      backgroundImage: `url("${encodeURI(HP_BAR_SHEET)}")`,
      backgroundRepeat: "no-repeat",
      imageRendering: "pixelated",
      backgroundSize: `${HP_BAR_SHEET_SIZE.width * this.scale}px ${HP_BAR_SHEET_SIZE.height * this.scale}px`,
      backgroundPosition: `${x}px ${y}px`,
    };
  }
}

window.HpBar = HpBar;
