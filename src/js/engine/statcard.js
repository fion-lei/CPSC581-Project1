
const STAT_CARD_IMAGE = "sprites/ui/Sprites/Paper UI Pack/Plain/6 Player HUD/1.png";
const STAT_CARD_SIZE = { width: 256, height: 160 };
const STAT_CARD_TEXT_AREA = { x: 40, y: 41, width: 176, height: 78 };
const STAT_CARD_SCALE = 1.5;
const STAT_CARD_PROFILE_RING = "sprites/ui/Sprites/Content/5 Holders/2.png";
const STAT_LABELS = { maxHp: "HP", atk: "ATK", def: "DEF" };
const STAT_CARD_PORTRAIT_SIZE = 62; 

const SPECIAL_HOLDER = "sprites/ui/Sprites/Content/5 Holders/6.png";
const SPECIAL_PIN = "sprites/icons/Separated Files/64x64/fc12.png";

function portraitHtml(profile) {
  if (typeof profile === "string") {
    return `<img class="stat-card__portrait" src="${encodeURI(profile)}" alt="">`;
  }
  const k = STAT_CARD_PORTRAIT_SIZE / profile.size;
  const style = [
    `background-image: url('${encodeURI(profile.sheet)}')`,
    `background-size: ${profile.sheetWidth * k}px ${profile.sheetHeight * k}px`,
    `background-position: ${-profile.x * k}px ${-profile.y * k}px`,
  ].join("; ");
  return `<div class="stat-card__portrait" style="${style}"></div>`;
}

class StatCard {
  constructor(container, { bonuses = () => ({}) } = {}) {
    this.container = container;
    this.bonuses = bonuses;
    this.owner = null;
    this.entity = null;

    const px = (n) => `${n * STAT_CARD_SCALE}px`;

    const { x, y, width, height } = STAT_CARD_TEXT_AREA;
    const inset = [y, STAT_CARD_SIZE.width - x - width, STAT_CARD_SIZE.height - y - height, x];

    this.el = document.createElement("div");
    this.el.className = "stat-card";
    Object.assign(this.el.style, {
      width: px(STAT_CARD_SIZE.width),
      minHeight: px(STAT_CARD_SIZE.height),
    });
    const image = new URL(encodeURI(STAT_CARD_IMAGE), document.baseURI).href;
    this.el.style.setProperty("--stat-card-image", `url("${image}")`);
    this.el.style.setProperty("--stat-card-slice", inset.join(" "));
    this.el.style.setProperty("--stat-card-inset", inset.map(px).join(" "));

    this.content = document.createElement("div");
    this.content.className = "stat-card__content";

    this.el.appendChild(this.content);
    container.appendChild(this.el);

    // Holder for the special's icon, stamped with a pin; the description
    // lives in the action bar's tooltip.
    this.special = document.createElement("div");
    this.special.className = "stat-card__special";
    this.special.style.backgroundImage = `url("${encodeURI(SPECIAL_HOLDER)}")`;
    this.specialIcon = document.createElement("img");
    this.specialIcon.className = "stat-card__special-icon";
    this.specialIcon.alt = "";
    const pin = document.createElement("img");
    pin.className = "stat-card__special-pin";
    pin.src = encodeURI(SPECIAL_PIN);
    pin.alt = "";
    this.special.append(this.specialIcon, pin);
    this.el.appendChild(this.special);
  }

  // Show `entity`'s card (and, if it has one, its special-ability icon)
  // while the mouse is over `target`. One hover unit, no separate target needed.
  attach(target, entity) {
    target.addEventListener("mouseenter", () => this.show(target, entity));
    target.addEventListener("mouseleave", () => this.hide(target));
  }

  show(target, entity) {
    this.owner = target;
    this.entity = entity;
    this._fill(entity);
    this._position(target);
    this.el.classList.add("is-open");
    this._showSpecial(entity);
  }

  refresh() {
    if (this.owner) this._fill(this.entity);
  }

  hide(target) {
    if (this.owner !== target) return;
    this.owner = null;
    this.el.classList.remove("is-open");
    this._hideSpecial();
  }

  _showSpecial(entity) {
    const special = entity.special;
    if (!special?.icon) return;
    this.specialIcon.src = encodeURI(special.icon);
    this.special.classList.add("is-open");
  }

  _hideSpecial() {
    this.special.classList.remove("is-open");
  }

  _fill(entity) {
    const { name, className, traits = {}, stats = {} } = entity;
    const subtitle = [className, traits.role].filter(Boolean).join(" · ");
    const { strengths = [], weaknesses = [] } = traits;
    const traitGroup = (list, cls, sign) => {
      const items = list.filter(Boolean).map((t) => `<li class="${cls}">${sign} ${t}</li>`).join("");
      return items ? `<ul>${items}</ul>` : "";
    };
    const traitGroups =
      traitGroup(strengths, "stat-card__plus", "+") + traitGroup(weaknesses, "stat-card__minus", "-");
    const profile = entity.profile
      ? `<div class="stat-card__profile" style="background-image: url('${encodeURI(STAT_CARD_PROFILE_RING)}')">
           ${portraitHtml(entity.profile)}
         </div>`
      : "";
    const bonuses = this.bonuses(entity);
    const statItems = Object.entries(stats)
      .map(([key, value]) => {
        const bonus = bonuses[key] ?? 0;
        let shown = key === "maxHp" && entity.hp !== undefined ? `${entity.hp}/${value}` : value;
        if (bonus > 0) shown = `${value + bonus} <span class="stat-card__bonus">(+${bonus})</span>`;
        return `<li><b>${STAT_LABELS[key] ?? key}</b> ${shown}</li>`;
      })
      .join("");

    this.content.innerHTML = `
      <div class="stat-card__top">
        ${profile}
        <div class="stat-card__info">
          <span class="stat-card__name">${name}</span>
          <span class="stat-card__class">${subtitle}</span>
          <div class="stat-card__traits">${traitGroups}</div>
        </div>
      </div>
      <ul class="stat-card__stats">${statItems}</ul>
    `;
    // Portrait not drawn yet: leave the ring empty rather than a broken image.
    const img = this.content.querySelector("img.stat-card__portrait");
    if (img) img.onerror = () => img.remove();
  }

  // Centered above the target, shrunk to fit the battlefield width and the room above.
  _position(target) {
    const box = this.container.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const k = Math.max(0.6, Math.min(1, box.width / this.el.offsetWidth, rect.top / this.el.offsetHeight));
    this.el.style.scale = k;
    const w = this.el.offsetWidth * k;
    const h = this.el.offsetHeight * k;
    const left = rect.left - box.left + rect.width / 2 - w / 2;
    const top = Math.max(-box.top, rect.top - box.top - h);
    this.el.style.left = `${Math.max(0, Math.min(left, box.width - w))}px`;
    this.el.style.top = `${top}px`;
  }

}

window.StatCard = StatCard;
