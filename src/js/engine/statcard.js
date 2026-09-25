
const STAT_CARD_IMAGE = "sprites/ui/Sprites/Paper UI Pack/Plain/6 Player HUD/1.png";
const STAT_CARD_SIZE = { width: 256, height: 160 };
const STAT_CARD_TEXT_AREA = { x: 40, y: 41, width: 176, height: 78 };
const STAT_CARD_SCALE = 1.5;
const STAT_CARD_PROFILE_RING = "sprites/ui/Sprites/Content/5 Holders/2.png";
const STAT_LABELS = { maxHp: "HP", atk: "ATK", def: "DEF" };
const STAT_CARD_PORTRAIT_SIZE = 62; 

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

    this.el = document.createElement("div");
    this.el.className = "stat-card";
    Object.assign(this.el.style, {
      width: px(STAT_CARD_SIZE.width),
      height: px(STAT_CARD_SIZE.height),
      backgroundImage: `url("${encodeURI(STAT_CARD_IMAGE)}")`,
    });

    this.content = document.createElement("div");
    this.content.className = "stat-card__content";
    Object.assign(this.content.style, {
      left: px(STAT_CARD_TEXT_AREA.x),
      top: px(STAT_CARD_TEXT_AREA.y),
      width: px(STAT_CARD_TEXT_AREA.width),
      height: px(STAT_CARD_TEXT_AREA.height),
    });

    this.el.appendChild(this.content);
    container.appendChild(this.el);
  }

  // Show `entity`'s card while the mouse is over `target`.
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
  }

  refresh() {
    if (this.owner) this._fill(this.entity);
  }

  hide(target) {
    if (this.owner !== target) return;
    this.owner = null;
    this.el.classList.remove("is-open");
  }

  _fill(entity) {
    const { name, className, traits = {}, stats = {} } = entity;
    const subtitle = [className, traits.role].filter(Boolean).join(" · ");
    const { strengths = [], weaknesses = [] } = traits;
    const traitItems = [
      ...strengths.filter(Boolean).map((t) => `<li class="stat-card__plus">+ ${t}</li>`),
      ...weaknesses.filter(Boolean).map((t) => `<li class="stat-card__minus">- ${t}</li>`),
    ].join("");
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
          <ul class="stat-card__traits">${traitItems}</ul>
        </div>
      </div>
      <ul class="stat-card__stats">${statItems}</ul>
    `;
    // Portrait not drawn yet: leave the ring empty rather than a broken image.
    const img = this.content.querySelector("img.stat-card__portrait");
    if (img) img.onerror = () => img.remove();
  }

  // Centered above the target (it may extend above the container, up to the top
  _position(target) {
    const box = this.container.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const w = this.el.offsetWidth;
    const h = this.el.offsetHeight;
    let left = rect.left - box.left + rect.width / 2 - w / 2;
    const minTop = -box.top; // top of the window, in container coordinates
    let top = rect.top - box.top - h;
    if (top < minTop) {
      left = rect.right - box.left;
      top = rect.top - box.top + rect.height / 2 - h / 2;
    }
    this.el.style.left = `${Math.max(0, Math.min(left, box.width - w))}px`;
    this.el.style.top = `${Math.max(minTop, top)}px`;
  }

}

window.StatCard = StatCard;
