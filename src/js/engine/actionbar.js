const ACTION_BAR_BG = "sprites/ui/Sprites/Paper UI Pack/Plain/3 Item Holder/1.png";
const ACTION_BAR_BG_SIZE = { width: 592, height: 144 };
const ACTION_BAR_DIVIDER = "sprites/ui/Sprites/Content/5 Holders/20.png";
const ACTION_BAR_DIVIDER_SIZE = { width: 80, height: 16 };

class ActionBar {
  constructor() {
    this.el = document.createElement("div");
    this.el.className = "action-bar";
    this.el.style.backgroundImage = `url("${encodeURI(ACTION_BAR_BG)}")`;
    this.el.style.aspectRatio = `${ACTION_BAR_BG_SIZE.width} / ${ACTION_BAR_BG_SIZE.height}`;

    this.abilityTitleEl = document.createElement("span");
    this.abilityTitleEl.className = "action-bar__title";

    this.abilitySlot = new IconSlot({ size: 64 });
    this.abilitySlot.el.classList.add("action-bar__ability-slot");

    const abilityCol = document.createElement("div");
    abilityCol.className = "action-bar__ability";
    abilityCol.append(this.abilityTitleEl, this.abilitySlot.el);

    const divider = document.createElement("div");
    divider.className = "action-bar__divider";
    const dividerImg = document.createElement("img");
    dividerImg.src = encodeURI(ACTION_BAR_DIVIDER);
    dividerImg.alt = "";
    divider.appendChild(dividerImg);

    this.itemsEl = document.createElement("div");
    this.itemsEl.className = "action-bar__items";

    this.el.append(abilityCol, divider, this.itemsEl);
    this.itemSlots = [];
  }

  mount(container) {
    container.appendChild(this.el);
    return this;
  }

  setAbility({ title, icon, badge = "", onClick, disabled } = {}) {
    if (title !== undefined) this.abilityTitleEl.textContent = title;
    this.abilitySlot.set({ icon, badge, onClick, disabled });
  }

  setItems(items) {
    this.itemsEl.innerHTML = "";
    this.itemSlots = items.map((item) => {
      const slot = new IconSlot({ ...item, size: 56 });
      this.itemsEl.appendChild(slot.el);
      return slot;
    });
  }
}

window.ActionBar = ActionBar;
