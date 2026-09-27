// Handles combat sound effects and audio
// Maps appropriate sound files to character actions (regular attack, healing, def/atk buffs)
const SOUNDS = {
  partyAttack: new Audio("sounds/party_attack.mp3"),
  monsterAttack: new Audio("sounds/monster_attack.mp3"),
  heal: new Audio("sounds/heal.mp3"),
  buff: new Audio("sounds/buff.mp3"),
};

function playSound(title) {
  const base = SOUNDS[title];
  if (!base) return;

  const sound = base.cloneNode();
  sound.play().catch(() => {});
}

function soundForSpecial(effect) {
  return effect === "heal" ? "heal" : "buff";
}

window.playSound = playSound;
window.soundForSpecial = soundForSpecial;
