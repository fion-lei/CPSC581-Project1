const SETTINGS_ICON = "sprites/icons/Separated Files/64x64/fc2.png";
const SETTINGS_PANEL = "sprites/ui/Sprites/Paper UI Pack/Plain/8 Shop/1.png";
const SETTINGS_SQUARE_BUTTON = "sprites/ui/Sprites/Content/5 Holders/7.png";
const SETTINGS_BUTTON = "sprites/ui/Sprites/Content/4 Buttons/3.png";
const SETTINGS_BUTTON_HOVER = "sprites/ui/Sprites/Content/4 Buttons/2.png";
const SETTINGS_POPUP = "sprites/ui/Sprites/Paper UI Pack/Plain/5 Mini Map/1.png";
const SETTINGS_UNDERLINE = "sprites/ui/Sprites/Content/5 Holders/19.png";
const SETTINGS_HELP_ICON = "sprites/icons/Separated Files/64x64/fc13.png";


const SETTINGS_OPTIONS = [
  { id: "help", kind: "round", label: "Help", icon: SETTINGS_HELP_ICON, title: "Help", body: "" },
  { id: "restart", kind: "round", label: "Restart", title: "Restart", body: "" },
  { id: "instructions", kind: "full", label: "Instructions", title: "Instructions", body: "" },
  { id: "settings", kind: "full", label: "Settings", title: "Settings", body: "" },
];

class SettingsMenu {
  constructor() {
    this.toggle = document.createElement("button");
    this.toggle.type = "button";
    this.toggle.className = "settings-toggle";
    this.toggle.setAttribute("aria-label", "Settings");
    this.toggle.setAttribute("aria-expanded", "false");
    this.toggle.innerHTML = `<img src="${encodeURI(SETTINGS_ICON)}" alt="">`;
    this.toggle.addEventListener("click", () => this.open());

    this.menu = this._layer(this._buildPanel());
    this.popup = this._layer(this._buildPopup());

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (this.popup.classList.contains("is-open")) this._close(this.popup);
      else if (this.menu.classList.contains("is-open")) this.close();
    });
  }

  mount(container) {
    container.append(this.toggle, this.menu, this.popup);
    return this;
  }

  open() {
    this.menu.classList.add("is-open");
    this.toggle.setAttribute("aria-expanded", "true");
  }

  close() {
    this._close(this.popup);
    this._close(this.menu);
    this.toggle.setAttribute("aria-expanded", "false");
  }

  showOption(option) {
    this.popupTitle.textContent = option.title;
    this.popupBody.textContent = option.body;
    this.popup.classList.add("is-open");
  }

  _close(layer) {
    layer.classList.remove("is-open");
  }

  _layer(dialog) {
    const layer = document.createElement("div");
    layer.className = "settings-layer";
    layer.appendChild(dialog);
    layer.addEventListener("click", (e) => {
      if (e.target !== layer) return;
      if (layer === this.menu) this.close();
      else this._close(layer);
    });
    return layer;
  }

  _buildPanel() {
    const panel = document.createElement("div");
    panel.className = "settings-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Settings menu");
    panel.style.backgroundImage = `url("${encodeURI(SETTINGS_PANEL)}")`;

    const roundRow = document.createElement("div");
    roundRow.className = "settings-panel__round-row";
    panel.appendChild(roundRow);

    SETTINGS_OPTIONS.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", option.label);
      button.addEventListener("click", () => this.showOption(option));

      if (option.kind === "round") {
        button.className = "settings-round-button";
        button.style.backgroundImage = `url("${encodeURI(SETTINGS_SQUARE_BUTTON)}")`;
        if (option.icon) button.innerHTML = `<img src="${encodeURI(option.icon)}" alt="">`;
        roundRow.appendChild(button);
      } else {
        button.className = "settings-button";
        const setHover = (hover) => {
          const src = hover ? SETTINGS_BUTTON_HOVER : SETTINGS_BUTTON;
          button.style.backgroundImage = `url("${encodeURI(src)}")`;
          button.classList.toggle("is-hover", hover);
        };
        setHover(false);
        button.addEventListener("mouseenter", () => setHover(true));
        button.addEventListener("mouseleave", () => setHover(false));
        button.addEventListener("focus", () => setHover(true));
        button.addEventListener("blur", () => setHover(false));
        const label = document.createElement("span");
        label.className = "settings-button__label";
        label.textContent = option.label;
        button.appendChild(label);
        panel.appendChild(button);
      }
    });
    return panel;
  }

  _buildPopup() {
    const popup = document.createElement("div");
    popup.className = "settings-popup";
    popup.setAttribute("role", "dialog");
    popup.style.backgroundImage = `url("${encodeURI(SETTINGS_POPUP)}")`;

    this.popupTitle = document.createElement("h2");
    this.popupTitle.className = "settings-popup__title";
    const underline = document.createElement("img");
    underline.className = "settings-popup__underline";
    underline.src = encodeURI(SETTINGS_UNDERLINE);
    underline.alt = "";
    this.popupBody = document.createElement("p");
    this.popupBody.className = "settings-popup__body";

    popup.append(this.popupTitle, underline, this.popupBody);
    return popup;
  }
}

window.SettingsMenu = SettingsMenu;
