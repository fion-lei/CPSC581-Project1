// Central mutable game state + pure-ish mutation helpers.
// Nothing here touches the DOM — render.js reads this object to update the page.

function createInitialState() {
  return {
    party: PARTY.map((member) => ({
      ...member,
      hp: member.stats.maxHp,
      alive: true,
    })),
    monster: {
      ...MONSTER,
      hp: MONSTER.stats.maxHp,
      alive: true,
    },
    turn: "party",   // "party" | "monster"
    turnCount: 1,
    gameOver: false,
    winner: null,    // "party" | "monster" | null
  };
}

const gameState = createInitialState();

function getPartyMember(id) {
  return gameState.party.find((m) => m.id === id);
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

function applyHealToMember(id, amount) {
  const member = getPartyMember(id);
  if (!member || !member.alive) return;
  member.hp = Math.min(member.stats.maxHp, member.hp + amount);
}

function advanceTurn() {
  if (gameState.gameOver) return;
  gameState.turn = gameState.turn === "party" ? "monster" : "party";
  if (gameState.turn === "party") gameState.turnCount++;
}

window.gameState = gameState;
window.getPartyMember = getPartyMember;
window.livingParty = livingParty;
window.applyDamageToMonster = applyDamageToMonster;
window.applyDamageToMember = applyDamageToMember;
window.applyHealToMember = applyHealToMember;
window.advanceTurn = advanceTurn;