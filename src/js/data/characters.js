// Each character's sheet lives at sprites/characters/{id}.png and follows
// SHEET_LAYOUT (see engine/sprite.js), so adding a character is just a new PNG.
const CHAR_SHEET_DIR = "sprites/characters";

const charSheet = (id) => `${CHAR_SHEET_DIR}/${id}.png`;
const charProfile = (id) => `${CHAR_SHEET_DIR}/${id}_profile.png`;
// Special-ability icons, e.g. specialIcon("fc1073") -> the 64x64 heal icon
const specialIcon = (name) => `sprites/icons/Separated Files/64x64/${name}.png`;

const PARTY = [
  {
    id: "fion",
    name: "Fion",
    className: "Marksman",
    traits: { role: "", strengths: ["Leadership", "Communication"], weaknesses: ["Vulnerability"] },
    stats: { maxHp: 10, atk: 2, def: 1 },
    special: { name: "Attack Up", effect: "attackUp", amount: 1, cooldown: 2, anim: "attackUp", icon: specialIcon("fc1098") },
    sheet: charSheet("fion"),
    profile: charProfile("fion")
  },
  {
    id: "wish",
    name: "Wish",
    className: "Cleric Wizard",
    traits: { role: "Healer", strengths: ["Altruism", "Wisdom", "Morale"], weaknesses: ["Strength"] },
    stats: { maxHp: 10, atk: 1, def: 1 },
    special: { name: "Group Heal", effect: "heal", amount: 2, cooldown: 2, anim: "heal", icon: specialIcon("fc1073") },
    sheet: charSheet("wish"),
    profile: charProfile("wish")
  },
  {
    id: "kevin",
    name: "Kevin",
    className: "Swordsman",
    traits: { role: "", strengths: ["X", "Y", "Z"], weaknesses: ["X"] },
    stats: { maxHp: 10, atk: 2, def: 1 },
    special: { name: "Defense Up", effect: "defenseUp", amount: 1, cooldown: 2, anim: "defenseUp", icon: specialIcon("fc1099") },
    sheet: charSheet("kevin"),
    profile: charProfile("kevin")
  }
];
