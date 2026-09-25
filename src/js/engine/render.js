function renderTurnBanner() {
  if (gameState.gameOver) {
    turnBanner.setText(gameState.winner === "party" ? "Victory!" : "Defeated...");
    return;
  }
  turnBanner.setText(
    gameState.turn === "party"
      ? `Turn ${gameState.turnCount} — Your Move`
      : `Turn ${gameState.turnCount} — Demon's Move`
  );
}
 
function renderPartyMember(member) {
  const el = document.querySelector(`.party-member[data-id="${member.id}"]`);
  if (!el) return;
 
  const hpBar = partyHpBars[member.id];
  if (hpBar) hpBar.setPct(member.hp / member.stats.maxHp);
 
  el.classList.toggle("is-dead", !member.alive);
 
  const canAct = gameState.turn === "party" && !gameState.gameOver && member.alive;
  el.classList.toggle("is-active-turn", canAct);
  el.querySelectorAll("button").forEach((btn) => (btn.disabled = !canAct));
}
 
function renderMonster() {
  if (window.monsterHpBar) {
    monsterHpBar.setPct(gameState.monster.hp / gameState.monster.stats.maxHp);
  }
}
 
function renderAll() {
  renderTurnBanner();
  gameState.party.forEach(renderPartyMember);
  renderMonster();
}
 
window.renderAll = renderAll;
 