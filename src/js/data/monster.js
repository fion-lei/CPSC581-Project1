const MONSTER_SHEET_DIR = "sprites/monsters/Characters(100x100 split)/Demon_A/Demon_A with shadows";

const MONSTER = {
  id: "demon_a",
  name: "Demon",
  className: "Monster",
  traits: { role: "Enemy", description: "A lesser demon guarding this floor." },
  stats: { maxHp: 60, atk: 7, def: 1 },
  sprite: {
    idle: { sheet: `${MONSTER_SHEET_DIR}/Demon_A_Idle.png`, frameW: 100, frameH: 100, frameCount: 6, row: 0 },
    walk: { sheet: `${MONSTER_SHEET_DIR}/Demon_A_Walk.png`, frameW: 100, frameH: 100, frameCount: 8, row: 0 },
    attack1: { sheet: `${MONSTER_SHEET_DIR}/Demon_A_Attack01.png`, frameW: 100, frameH: 100, frameCount: 7, row: 0 },
    attack2: { sheet: `${MONSTER_SHEET_DIR}/Demon_A_Attack02.png`, frameW: 100, frameH: 100, frameCount: 7, row: 0 },
    hurt: { sheet: `${MONSTER_SHEET_DIR}/Demon_A_Hurt.png`, frameW: 100, frameH: 100, frameCount: 4, row: 0 },
    death: { sheet: `${MONSTER_SHEET_DIR}/Demon_A_Death.png`, frameW: 100, frameH: 100, frameCount: 4, row: 0 }
  }
};
