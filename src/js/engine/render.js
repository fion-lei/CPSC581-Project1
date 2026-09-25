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
  el.classList.toggle("has-acted", member.alive && member.acted);
  el.querySelector(".party-member__attack").disabled = !canAttack(member);

  const special = el.querySelector(".party-member__special");
  const label = member.cooldown > 0 ? `${member.special.name} (${member.cooldown})` : member.special.name;
  special.title = label;
  special.setAttribute("aria-label", label);
  special.querySelector(".party-member__special-cooldown").textContent = member.cooldown || "";
  special.disabled = !canUseSpecial(member);
}
 
function renderMonster() {
  if (window.monsterHpBar) {
    monsterHpBar.setPct(gameState.monster.hp / gameState.monster.stats.maxHp);
  }
}

function renderRestartButton() {
  document.getElementById("restart-button").hidden = gameState.busy || !gameState.gameOver;
}

function renderAll() {
  renderTurnBanner();
  gameState.party.forEach(renderPartyMember);
  renderMonster();
  renderRestartButton();
  if (window.statCard) statCard.refresh();
}
 
window.renderAll = renderAll;
 