const CHAR_SHEET_DIR = "sprites/characters";
const charSheet = (id) => `${CHAR_SHEET_DIR}/${id}.png`;
const charProfile = (id) => `${CHAR_SHEET_DIR}/${id}_profile.png`;
const specialIcon = (name) => `sprites/icons/Separated Files/64x64/${name}.png`;

const PARTY = [
  {
    id: "fion",
    name: "Fion",
    className: "Marksman",
    traits: { role: "Vanguard", strengths: ["Leadership", "Communication", "Gregariousness"], weaknesses: ["Vulnerability"] },
    stats: { maxHp: 10, atk: 2, def: 1 },
    special: { name: "Attack Up", effect: "attackUp", description: "Boosts the whole party's ATK until your next turn.", amount: 1, cooldown: 2, anim: "attackUp", icon: specialIcon("fc1098")},
    sheet: charSheet("fion"),
    profile: charProfile("fion")
  },
  {
    id: "wish",
    name: "Wish",
    className: "Cleric Wizard",
    traits: { role: "Healer", strengths: ["Altruism", "Wisdom", "Morale"], weaknesses: ["Strength"] },
    stats: { maxHp: 10, atk: 1, def: 1 },
    special: { name: "Group Heal", effect: "heal", description: "Restores HP to every party member.", amount: 2, cooldown: 2, anim: "heal", icon: specialIcon("fc1073") },
    sheet: charSheet("wish"),
    profile: charProfile("wish")
  },
  {
    id: "kevin",
    name: "Kevin",
    className: "Artificer/Rogue",
    traits: {
    role: "Smith",
    strengths: ["Analysis", "Mobility", "Endurance"],
    weaknesses: ["Impatience"]
    },
    stats: { maxHp: 10, atk: 1, def: 2 },
    special: { name: "Defense Up", effect: "defenseUp", description: "Boosts the whole party's DEF until your next turn.", amount: 1, cooldown: 2, anim: "defenseUp", icon: specialIcon("fc1099") },
    sheet: charSheet("kevin"),
    profile: charProfile("kevin")
  }
];
