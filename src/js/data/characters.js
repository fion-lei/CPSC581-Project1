// Each character's sheet lives at sprites/characters/{id}.png and follows
// SHEET_LAYOUT (see engine/sprite.js), so adding a character is just a new PNG.
const CHAR_SHEET_DIR = "sprites/characters";

const charSheet = (id) => `${CHAR_SHEET_DIR}/${id}.png`;
const charProfile = (id) => `${CHAR_SHEET_DIR}/${id}_profile.png`;

const PARTY = [
  {
    id: "fion",
    name: "Fion",
    className: "Marksman",
    traits: { role: "", strengths: ["Leadership", "Communication"], weaknesses: ["Vulnerability"] },
    stats: { maxHp: 5, atk: 1, def: 1, healAmount: 1 },
    sheet: charSheet("fion"),
    profile: charProfile("fion")
  },
  {
    id: "wish",
    name: "Wish",
    className: "Cleric Wizard",
    traits: { role: "Healer", strengths: ["Altruism", "Wisdom", "Morale"], weaknesses: ["Strength"] },
    stats: { maxHp: 5, atk: 1, def: 1, healAmount: 1 },
    sheet: charSheet("wish"),
    profile: charProfile("wish")
  },
  {
    id: "kevin",
    name: "Kevin",
    className: "Swordsman",
    traits: { role: "", strengths: ["X", "Y", "Z"], weaknesses: ["X"] },
    stats: { maxHp: 5, atk: 1, def: 1, healAmount: 1 },
    sheet: charSheet("kevin"),
    profile: charProfile("kevin")
  }
];
