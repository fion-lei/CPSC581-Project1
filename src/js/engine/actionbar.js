const ACTION_BAR_BG = "sprites/ui/Sprites/Paper UI Pack/Plain/3 Item Holder/1.png";
const ACTION_BAR_BG_SIZE = { width: 592, height: 144 };
const ACTION_BAR_DIVIDER = "sprites/ui/Sprites/Content/5 Holders/20.png";

class ActionBar {
  constructor() {
    this.el = document.createElement("div");
    this.el.className = "action-bar";
    this.el.style.backgroundImage = `url("${encodeURI(ACTION_BAR_BG)}")`;
    this.el.style.aspectRatio = `${ACTION_BAR_BG_SIZE.width} / ${ACTION_BAR_BG_SIZE.height}`;

    const [abilitiesCol, abilitiesRow] = this._section("Actions");
    this.abilitiesEl = abilitiesRow;

    const divider = document.createElement("div");
    divider.className = "action-bar__divider";
    const dividerImg = document.createElement("img");
    dividerImg.src = encodeURI(ACTION_BAR_DIVIDER);
    dividerImg.alt = "";
    divider.appendChild(dividerImg);

    const [itemsCol, itemsRow] = this._section("Items");
    this.itemsEl = itemsRow;

    this.el.append(abilitiesCol, divider, itemsCol);
    this.abilitySlots = [];
    this.itemSlots = [];
  }

  _section(label) {
    const col = document.createElement("div");
    col.className = "action-bar__section";
    const title = document.createElement("span");
    title.className = "action-bar__title";
    title.textContent = label;
    const row = document.createElement("div");
    row.className = "action-bar__row";
    col.append(title, row);
    return [col, row];
  }

  mount(container) {
    container.appendChild(this.el);
    return this;
  }

  // entries: [{ icon, badge, onClick, disabled }, ...]
  setAbilities(entries) {
    this.abilitiesEl.innerHTML = "";
    this.abilitySlots = entries.map((entry) => {
      const slot = new IconSlot({ ...entry, size: 56 });
      this.abilitiesEl.appendChild(slot.el);
      return slot;
    });
  }

  setItems(entries) {
    this.itemsEl.innerHTML = "";
    this.itemSlots = entries.map((entry) => {
      const slot = new IconSlot({ ...entry, size: 56 });
      this.itemsEl.appendChild(slot.el);
      return slot;
    });
  }
}

window.ActionBar = ActionBar;
