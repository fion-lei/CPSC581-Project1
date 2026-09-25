const MONSTER_ATTACK_NAMES = ["attack1", "attack2"];

async function partyAttack(memberId) {
  if (gameState.turn !== "party" || gameState.gameOver) return;
  const member = getPartyMember(memberId);
  if (!member || !member.alive) return;

  await partySprites[memberId].play("attack");
  applyDamageToMonster(member.stats.atk);
  renderAll();

  if (!gameState.monster.alive) {
    await monsterSprite.play("death");
    return;
  }
  await monsterSprite.play("hurt");

  advanceTurn();
  renderAll();
  monsterTurn();
}

async function partyHeal(memberId) {
  if (gameState.turn !== "party" || gameState.gameOver) return;
  const member = getPartyMember(memberId);
  if (!member || !member.alive) return;

  await partySprites[memberId].play("heal");
  applyHealToMember(memberId, member.stats.healAmount);
  renderAll();

  advanceTurn();
  renderAll();
  monsterTurn();
}

async function monsterTurn() {
  if (gameState.turn !== "monster" || gameState.gameOver) return;

  const targets = livingParty();
  if (targets.length === 0) return;

  const target = targets[Math.floor(Math.random() * targets.length)];
  const attackName = MONSTER_ATTACK_NAMES[Math.floor(Math.random() * MONSTER_ATTACK_NAMES.length)];

  await monsterSprite.play(attackName);
  applyDamageToMember(target.id, gameState.monster.stats.atk);
  renderAll();

  if (gameState.gameOver) {
    await partySprites[target.id].play("death");
    return;
  }
  await partySprites[target.id].play("hurt");

  advanceTurn();
  renderAll();
}

window.partyAttack = partyAttack;
window.partyHeal = partyHeal;