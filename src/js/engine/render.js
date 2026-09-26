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
}

function renderMonster() {
  if (window.monsterHpBar) {
    monsterHpBar.setPct(gameState.monster.hp / gameState.monster.stats.maxHp);
  }
}

// One shared ActionBar for the whole party: every member's special on the
// left, the item stash on the right.
function renderActionBar() {
  if (!window.actionBar) return;

  actionBar.setAbilities(
    gameState.party.map((member) => ({
      icon: member.special.icon,
      badge: member.cooldown > 0 ? member.cooldown : "",
      onClick: () => partySpecial(member.id),
      disabled: !canUseSpecial(member),
    }))
  );

  actionBar.setItems(
    gameState.items.map((item) => ({
      icon: item.icon,
      badge: item.count,
      onClick: () => partyUseItem(item.id),
      disabled: !canUseItemNow(item),
    }))
  );
}

function renderAll() {
  renderTurnBanner();
  gameState.party.forEach(renderPartyMember);
  renderMonster();
  renderActionBar();
  if (window.statCard) statCard.refresh();
}

window.renderAll = renderAll;