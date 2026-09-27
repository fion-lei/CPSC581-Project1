const ACTION_BAR_BG = "sprites/ui/Sprites/Paper UI Pack/Plain/3 Item Holder/1.png";
const ACTION_BAR_BG_SIZE = { width: 592, height: 144 };
const ACTION_BAR_DIVIDER = "sprites/ui/Sprites/Content/5 Holders/20.png";
const ACTION_BAR_UNDERLINE = "sprites/ui/Sprites/Content/5 Holders/19.png";

const SPECIAL_TOOLTIP_CAPS = {
  left: "sprites/ui/Sprites/Content/5 Holders/9.png",
  middle: "sprites/ui/Sprites/Content/5 Holders/10.png",
  right: "sprites/ui/Sprites/Content/5 Holders/11.png",
};

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

    this.tooltip = this._buildTooltip();
    this.el.appendChild(this.tooltip);
    this.hover = null; // { row, index } of the slot under the mouse, kept across re-renders
  }

  // One shared tooltip, sitting just above the bar and centred over whichever
  // slot is hovered.
  _buildTooltip() {
    const el = document.createElement("div");
    el.className = "special-tooltip";

    const cap = (src) => {
      const c = document.createElement("div");
      c.className = "special-tooltip__cap";
      c.style.backgroundImage = `url("${encodeURI(src)}")`;
      return c;
    };

    const middle = document.createElement("div");
    middle.className = "special-tooltip__middle";
    middle.style.backgroundImage = `url("${encodeURI(SPECIAL_TOOLTIP_CAPS.middle)}")`;
    this.tooltipIcon = document.createElement("img");
    this.tooltipIcon.className = "special-tooltip__icon";
    this.tooltipIcon.alt = "";
    const body = document.createElement("div");
    body.className = "special-tooltip__body";
    this.tooltipName = document.createElement("span");
    this.tooltipName.className = "special-tooltip__name";
    this.tooltipText = document.createElement("span");
    this.tooltipText.className = "special-tooltip__text";
    body.append(this.tooltipName, this.tooltipText);
    middle.append(this.tooltipIcon, body);

    el.append(cap(SPECIAL_TOOLTIP_CAPS.left), middle, cap(SPECIAL_TOOLTIP_CAPS.right));
    return el;
  }

  _showTooltip(hover, slot, entry) {
    this.hover = hover;
    this.tooltipIcon.src = encodeURI(entry.icon);
    this.tooltipName.textContent = entry.tooltipName ?? "";
    this.tooltipText.textContent = entry.tooltip;
    // As a percentage of the bar's width, so it stays over the slot on resize.
    const bar = this.el.getBoundingClientRect();
    const rect = slot.el.getBoundingClientRect();
    const center = rect.left + rect.width / 2 - bar.left;
    this.tooltip.style.left = `${(center / bar.width) * 100}%`;
    this.tooltip.classList.add("is-open");
  }

  _hideTooltip({ row, index }) {
    if (this.hover?.row !== row || this.hover.index !== index) return;
    this.hover = null;
    this.tooltip.classList.remove("is-open");
  }

  _section(label) {
    const col = document.createElement("div");
    col.className = "action-bar__section";
    const title = document.createElement("span");
    title.className = "action-bar__title";
    title.textContent = label;
    const underline = document.createElement("img");
    underline.className = "action-bar__underline";
    underline.src = encodeURI(ACTION_BAR_UNDERLINE);
    underline.alt = "";
    const row = document.createElement("div");
    row.className = "action-bar__row";
    col.append(title, underline, row);
    return [col, row];
  }

  mount(container) {
    container.appendChild(this.el);
    return this;
  }

  // entries: [{ icon, badge, onClick, disabled, tooltip, tooltipName }, ...]
  setAbilities(entries) {
    this.abilitySlots = this._fillRow(this.abilitiesEl, "abilities", entries);
  }

  setItems(entries) {
    this.itemSlots = this._fillRow(this.itemsEl, "items", entries);
  }

  _fillRow(rowEl, row, entries) {
    rowEl.innerHTML = "";
    const slots = entries.map((entry, i) => {
      const slot = new IconSlot({ ...entry, size: 56 });
      if (entry.tooltip) {
        const show = () => this._showTooltip({ row, index: i }, slot, entry);
        const hide = () => this._hideTooltip({ row, index: i });
        slot.el.addEventListener("mouseenter", show);
        slot.el.addEventListener("mouseleave", hide);
        slot.el.addEventListener("focus", show);
        slot.el.addEventListener("blur", hide);
      }
      rowEl.appendChild(slot.el);
      return slot;
    });
    // A re-render (e.g. after a click) replaced the hovered slot: keep its tooltip up.
    const hovered = this.hover?.row === row ? this.hover.index : null;
    if (hovered !== null && entries[hovered]?.tooltip) {
      this._showTooltip(this.hover, slots[hovered], entries[hovered]);
    }
    return slots;
  }
}

window.ActionBar = ActionBar;
