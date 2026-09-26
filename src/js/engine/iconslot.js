const ICON_SLOT_CORNERS = [
  "sprites/ui/Sprites/Content/6 Highlighter/1.png", // top-left
  "sprites/ui/Sprites/Content/6 Highlighter/2.png", // top-right
  "sprites/ui/Sprites/Content/6 Highlighter/3.png", // bottom-right
  "sprites/ui/Sprites/Content/6 Highlighter/4.png", // bottom-left
];
const ICON_SLOT_CORNER_SIZE = 16;

class IconSlot {
  constructor({ icon, badge = "", onClick, disabled = false, size = 64 } = {}) {
    this.el = document.createElement("button");
    this.el.type = "button";
    this.el.className = "icon-slot";
    this.el.style.width = `${size}px`;
    this.el.style.height = `${size}px`;

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
      corner.style.width = `${ICON_SLOT_CORNER_SIZE}px`;
      corner.style.height = `${ICON_SLOT_CORNER_SIZE}px`;
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
