const MONSTER_ATTACK_NAMES = ["attack1", "attack2"];

// Runs an action with clicks locked until its animations finish.
async function runAction(action) {
  gameState.busy = true;
  renderAll();
  try {
    await action();
  } finally {
    gameState.busy = false;
    renderAll();
  }
}

function partyAttack(memberId) {
  const member = getPartyMember(memberId);
  if (!member || !canAttack(member)) return;

  return runAction(async () => {
    await partySprites[memberId].play("attack");
    const damage = applyDamageToMonster(member.stats.atk + gameState.buffs.atk);
    showCombatNumber(monsterSpriteEl, damage, "damage");
    member.acted = true;
    renderAll();

    if (!gameState.monster.alive) {
      await monsterSprite.play("death");
      return;
    }
    await monsterSprite.play("hurt");

    if (allActed()) {
      advanceTurn();
      renderAll();
      await monsterTurn();
    }
  });
}

// Special abilities affect the whole party, so every living member plays the effect.
function partySpecial(memberId) {
  const member = getPartyMember(memberId);
  if (!member || !canUseSpecial(member)) return;

  return runAction(async () => {
    const party = livingParty();
    await Promise.all(party.map((m) => partySprites[m.id].play(member.special.anim)));
    applySpecial(member).forEach(({id, amount}) => {
      showCombatNumber(partySpriteEls[id], amount, "heal");
    });
  });
}

async function monsterTurn() {
  if (gameState.turn !== "monster" || gameState.gameOver) return;

  const targets = livingParty();
  if (targets.length === 0) return;

  const target = targets[Math.floor(Math.random() * targets.length)];
  const attackName = MONSTER_ATTACK_NAMES[Math.floor(Math.random() * MONSTER_ATTACK_NAMES.length)];

  await monsterSprite.play(attackName);
  const damage = applyDamageToMember(target.id, gameState.monster.stats.atk);
  showCombatNumber(partySpriteEls[target.id], damage, "damage");
  renderAll();

  await partySprites[target.id].play(target.alive ? "hurt" : "death");
  if (gameState.gameOver) return;

  advanceTurn();
  renderAll();
}

function restartGame() {
  if (gameState.busy || !gameState.gameOver) return;
  resetGameState();
  Object.values(partySprites).forEach((sprite) => sprite.revive());
  monsterSprite.revive();
  
  renderAll();
}

window.partyAttack = partyAttack;
window.partySpecial = partySpecial;
window.restartGame = restartGame;
