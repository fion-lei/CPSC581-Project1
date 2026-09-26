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

function resetGameState() {
  const {party, monster, ...rest} = createInitialState();
  party.forEach((fresh, i) => Object.assign(gameState.party[i], fresh));
  Object.assign(gameState.monster, monster);
  Object.assign(gameState, rest);
}

function getPartyMember(id) {
  return gameState.party.find((m) => m.id === id);
}

function livingParty() {
  return gameState.party.filter((m) => m.alive);
}

// Accounts for defense up buff, demon always deals at least 1 damage
function damageDefenseUp(amount, def) {
  return Math.max(1, amount - (def - 1));
}

function applyDamageToMonster(amount) {
  const damage = damageDefenseUp(amount, gameState.monster.stats.def);
  gameState.monster.hp = Math.max(0, gameState.monster.hp - damage);
  if (gameState.monster.hp === 0) {
    gameState.monster.alive = false;
    gameState.gameOver = true;
    gameState.winner = "party";
  }
  return damage;
}

function applyDamageToMember(id, amount) {
  const member = getPartyMember(id);
  if (!member || !member.alive) return 0;
  const damage = damageDefenseUp(amount, member.stats.def + gameState.buffs.def);
  member.hp = Math.max(0, member.hp - damage);
  if (member.hp === 0) {
    member.alive = false;
    if (livingParty().length === 0) {
      gameState.gameOver = true;
      gameState.winner = "monster";
    }
  }
  return damage;
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

function allActed() {
  return livingParty().every((m) => m.acted);
}

function applySpecial(member) {
  const { effect, amount, cooldown } = member.special;
  const heals = effect === "heal"
    ? livingParty().map((m) => ({id: m.id, amount: applyHealToMember(m.id, amount)}))
    : [];
  if (effect === "attackUp") gameState.buffs.atk += amount;
  if (effect === "defenseUp") gameState.buffs.def += amount;
  member.cooldown = cooldown;
  gameState.specialUsed = true;
  return heals;
}

function applyHealToMember(id, amount) {
  const member = getPartyMember(id);
  if (!member || !member.alive) return 0;
  const before = member.hp;
  member.hp = Math.min(member.stats.maxHp, member.hp + amount);
  return member.hp - before;
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
window.resetGameState = resetGameState;
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