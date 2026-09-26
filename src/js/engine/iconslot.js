const ICON_SLOT_BG = "sprites/ui/Sprites/Content/5 Holders/5.png";
const ICON_SLOT_CORNERS = [
  "sprites/ui/Sprites/Content/6 Highlighter/1.png", // top-left
  "sprites/ui/Sprites/Content/6 Highlighter/2.png", // top-right
  "sprites/ui/Sprites/Content/6 Highlighter/3.png", // bottom-right
  "sprites/ui/Sprites/Content/6 Highlighter/4.png", // bottom-left
];

class IconSlot {
  constructor({ icon, badge = "", onClick, disabled = false } = {}) {
    this.el = document.createElement("button");
    this.el.type = "button";
    this.el.className = "icon-slot";
    this.el.style.backgroundImage = `url("${encodeURI(ICON_SLOT_BG)}")`;

    this.iconEl = document.createElement("img");
    this.iconEl.className = "icon-slot__icon";
    this.iconEl.alt = "";
    this.el.appendChild(this.iconEl);

    this.badgeEl = document.createElement("span");
    this.badgeEl.className = "icon-slot__badge";
    this.el.appendChild(this.badgeEl);

    ICON_SLOT_CORNERS.forEach((src, i) => {
      const corner = document.createElement("div");
      corner.className = `icon-slot__corner icon-slot__corner--${i}`;
      corner.style.backgroundImage = `url("${encodeURI(src)}")`;
      this.el.appendChild(corner);
    });

    this._onClick = null;
    this.set({ icon, badge, onClick, disabled });
  }

  set({ icon, badge, onClick, disabled } = {}) {
    if (icon !== undefined) this.iconEl.src = encodeURI(icon);
    if (badge !== undefined) this.badgeEl.textContent = badge;
    if (onClick !== undefined) {
      if (this._onClick) this.el.removeEventListener("click", this._onClick);
      this._onClick = onClick;
      if (onClick) this.el.addEventListener("click", onClick);
    }
    if (disabled !== undefined) this.el.disabled = disabled;
  }
}

window.IconSlot = IconSlot;
