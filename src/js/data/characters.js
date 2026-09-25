// Each character's sheet lives at sprites/characters/{id}.png and follows
// SHEET_LAYOUT (see engine/sprite.js), so adding a character is just a new PNG.
const CHAR_SHEET_DIR = "sprites/characters";

const charSheet = (id) => `${CHAR_SHEET_DIR}/${id}.png`;

const PARTY = [
  {
    id: "fion",
    name: "Fion",
    className: "",
    traits: { role: "", description: "" },
    stats: { maxHp: 30, atk: 1, def: 1, healAmount: 1 },
    sheet: charSheet("fion")
  },
  {
    id: "wish",
    name: "Wish",
    className: "",
    traits: { role: "", description: "" },
    stats: { maxHp: 30, atk: 1, def: 1, healAmount: 1 },
    sheet: charSheet("wish")
  },
  {
    id: "kevin",
    name: "Kevin",
    className: "",
    traits: { role: "", description: "" },
    stats: { maxHp: 30, atk: 1, def: 1, healAmount: 1 },
    sheet: charSheet("kevin")
  }
];
