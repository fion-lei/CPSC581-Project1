const CHAR_SHEET_DIR = "sprites/characters/Eris Esra's Character Template 4.1/16x32";
const CHAR_DEATH_SHEET = "sprites/characters/ErisEsra Character Template - Animation Addon by channeechan/ErisEsra Character Template - Animation Addon by channeechan/Death.png";
const ICON_DIR = "sprites/icons/Separated Files/16x16";

// Shared anchor points (px, relative to the top-left of the 32x32 idle frame)
// for the 4 equipment badge slots. Same for every character since they share one base sprite.
// Subject to change
const EQUIPMENT_ANCHORS = {
  head: { x: 8, y: -6 },
  body: { x: 8, y: 8 },
  weapon: { x: 20, y: 10 },
  shoes: { x: 8, y: 24 }
};

const PARTY = [
  {
    id: "member1",
    name: "Fion",
    className: "",
    traits: { role: "", description: "" },
    stats: { maxHp: 30, atk: 1, def: 1, healAmount: 1 },
    equipment: {
      head: `${ICON_DIR}/fa1835.png`,
      body: `${ICON_DIR}/fa2112.png`,
      shoes: `${ICON_DIR}/fa1937.png`,
      weapon: `${ICON_DIR}/fa1806.png`
    },
    sprite: {
      idle: { sheet: `${CHAR_SHEET_DIR}/16x32 Idle-Sheet.png`, frameW: 32, frameH: 32, frameCount: 4, row: 0 },
      attack: { sheet: `${CHAR_SHEET_DIR}/16x32 Attack-Sheet.png`, frameW: 32, frameH: 32, frameCount: 7, row: 0 },
      heal: { sheet: `${CHAR_SHEET_DIR}/16x32 Interact-Sheet.png`, frameW: 32, frameH: 32, frameCount: 4, row: 0, tint: "heal-green" },
      death: { image: CHAR_DEATH_SHEET, crop: { x: 32, y: 96, w: 32, h: 32 } }
    }
  },
  {
    id: "member2",
    name: "Wish",
    className: "",
    traits: { role: "", description: "" },
    stats: { maxHp: 30, atk: 1, def: 1, healAmount: 1 },
    equipment: {
      head: `${ICON_DIR}/fa2.png`, // Placeholders
      body: `${ICON_DIR}/fa3.png`,
      shoes: `${ICON_DIR}/fa4.png`,
      weapon: `${ICON_DIR}/fa5.png`
    },
    sprite: {
      idle: { sheet: `${CHAR_SHEET_DIR}/16x32 Idle-Sheet.png`, frameW: 32, frameH: 32, frameCount: 4, row: 0 },
      attack: { sheet: `${CHAR_SHEET_DIR}/16x32 Attack-Sheet.png`, frameW: 32, frameH: 32, frameCount: 7, row: 0 },
      heal: { sheet: `${CHAR_SHEET_DIR}/16x32 Interact-Sheet.png`, frameW: 32, frameH: 32, frameCount: 4, row: 0, tint: "heal-green" },
      death: { image: CHAR_DEATH_SHEET, crop: { x: 32, y: 96, w: 32, h: 32 } }
    }
  },
  {
    id: "member3",
    name: "Kevin",
    className: "",
    traits: { role: "", description: "" },
    stats: { maxHp: 30, atk: 1, def: 1, healAmount: 1 },
    equipment: {
      head: `${ICON_DIR}/fa2.png`,  // Placeholders
      body: `${ICON_DIR}/fa3.png`,
      shoes: `${ICON_DIR}/fa4.png`,
      weapon: `${ICON_DIR}/fa5.png`
    },
    sprite: {
      idle: { sheet: `${CHAR_SHEET_DIR}/16x32 Idle-Sheet.png`, frameW: 32, frameH: 32, frameCount: 4, row: 0 },
      attack: { sheet: `${CHAR_SHEET_DIR}/16x32 Attack-Sheet.png`, frameW: 32, frameH: 32, frameCount: 7, row: 0 },
      heal: { sheet: `${CHAR_SHEET_DIR}/16x32 Interact-Sheet.png`, frameW: 32, frameH: 32, frameCount: 4, row: 0, tint: "heal-green" },
      death: { image: CHAR_DEATH_SHEET, crop: { x: 32, y: 96, w: 32, h: 32 } }
    }
  }
];
