// Central mutable game state + pure-ish mutation helpers.
// Nothing here touches the DOM — render.js reads this object to update the page.

function createInitialState() {
  return {
    party: PARTY.map((member) => ({
      ...member,
      hp: member.stats.maxHp,
      alive: true,
      acted: false,  // attacked this party turn
      cooldown: 0,   // party turns until their special can be used again
    })),
    monster: {
      ...MONSTER,
      hp: MONSTER.stats.maxHp,
      alive: true,
    },
    items: ITEMS.map((item) => ({ ...item })), // shared party stash, live counts
    turn: "party",   // "party" | "monster"
    turnCount: 1,
    specialUsed: false,         // only one special ability per party turn
    buffs: { atk: 0, def: 0 },  // party-wide, from specials; last until the next party turn
    busy: false,                // an action's animations are playing; ignore clicks
    gameOver: false,
    winner: null,    // "party" | "monster" | null
  };
}

const gameState = createInitialState();

function getPartyMember(id) {
  return gameState.party.find((m) => m.id === id);
}

function getItem(id) {
  return gameState.items.find((i) => i.id === id);
}

function livingParty() {
  return gameState.party.filter((m) => m.alive);
}

function applyDamageToMonster(amount) {
  gameState.monster.hp = Math.max(0, gameState.monster.hp - amount);
  if (gameState.monster.hp === 0) {
    gameState.monster.alive = false;
    gameState.gameOver = true;
    gameState.winner = "party";
  }
}

function applyDamageToMember(id, amount) {
  const member = getPartyMember(id);
  if (!member || !member.alive) return;
  member.hp = Math.max(0, member.hp - amount);
  if (member.hp === 0) {
    member.alive = false;
    if (livingParty().length === 0) {
      gameState.gameOver = true;
      gameState.winner = "monster";
    }
  }
}

// A living character can attack once per party turn, and may use their special
// before attacking (one special per turn, not while it's cooling down).
function canAttack(member) {
  return gameState.turn === "party" && !gameState.gameOver && !gameState.busy &&
    member.alive && !member.acted;
}

function canUseSpecial(member) {
  return canAttack(member) && !gameState.specialUsed && member.cooldown === 0;
}

function canUseItemNow(item) {
  return gameState.turn === "party" && !gameState.gameOver && !gameState.busy && item.count > 0;
}

function allActed() {
  return livingParty().every((m) => m.acted);
}

function applySpecial(member) {
  const { effect, amount, cooldown } = member.special;
  if (effect === "heal") livingParty().forEach((m) => applyHealToMember(m.id, amount));
  if (effect === "attackUp") gameState.buffs.atk += amount;
  if (effect === "defenseUp") gameState.buffs.def += amount;
  member.cooldown = cooldown;
  gameState.specialUsed = true;
}

function applyHealToMember(id, amount) {
  const member = getPartyMember(id);
  if (!member || !member.alive) return;
  member.hp = Math.min(member.stats.maxHp, member.hp + amount);
}

function advanceTurn() {
  if (gameState.gameOver) return;
  gameState.turn = gameState.turn === "party" ? "monster" : "party";
  if (gameState.turn === "party") startPartyTurn();
}

// New round: everyone can act again, buffs wear off, cooldowns tick down.
function startPartyTurn() {
  gameState.turnCount++;
  gameState.specialUsed = false;
  gameState.buffs = { atk: 0, def: 0 };
  gameState.party.forEach((m) => {
    m.acted = false;
    m.cooldown = Math.max(0, m.cooldown - 1);
  });
}

window.gameState = gameState;
window.getPartyMember = getPartyMember;
window.livingParty = livingParty;
window.applyDamageToMonster = applyDamageToMonster;
window.applyDamageToMember = applyDamageToMember;
window.applyHealToMember = applyHealToMember;
window.canAttack = canAttack;
window.canUseSpecial = canUseSpecial;
window.allActed = allActed;
window.applySpecial = applySpecial;
window.advanceTurn = advanceTurn;