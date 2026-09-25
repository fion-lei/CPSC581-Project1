// Builds the battle screen: an HP bar + sprite for the monster and each party
// member, Attack/Heal buttons, and the hover stat card. Hands off to
// combat.js (actions) and render.js (HP bars, turn banner) from there.

function mountPartyMember(container, member, statCard) {
  const wrapper = document.createElement("div");
  wrapper.className = "party-member";
  wrapper.dataset.id = member.id;

  const hpBarEl = document.createElement("div");
  const hpBar = new HpBar(hpBarEl, { variant: "party", scale: 2 });

  const spriteEl = document.createElement("div");

  const nameEl = document.createElement("span");
  nameEl.className = "party-member__name";
  nameEl.textContent = member.name;

  const actions = document.createElement("div");
  actions.className = "party-member__actions";

  const attackBtn = document.createElement("button");
  attackBtn.type = "button";
  attackBtn.textContent = "Attack";
  attackBtn.addEventListener("click", () => partyAttack(member.id));

  const healBtn = document.createElement("button");
  healBtn.type = "button";
  healBtn.textContent = "Heal";
  healBtn.addEventListener("click", () => partyHeal(member.id));

  actions.append(attackBtn, healBtn);
  wrapper.append(hpBarEl, spriteEl, nameEl, actions);
  container.appendChild(wrapper);
  statCard.attach(wrapper, member);

  const sprite = new SpriteCharacter(spriteEl, {
    animations: animationsFromSheet(member.sheet),
    scale: 2,
    facing: "right",
  });

  return { sprite, hpBar };
}

function mountMonster(container, monster, statCard) {
  const hpBarEl = document.createElement("div");
  const hpBar = new HpBar(hpBarEl, { variant: "monster", scale: 2 });

  const spriteEl = document.createElement("div");

  container.append(hpBarEl, spriteEl);
  statCard.attach(spriteEl, monster);

  const sprite = new SpriteCharacter(spriteEl, {
    animations: animationsFromFiles(monster.sprite),
    scale: 6,
    facing: "left",
  });

  return { sprite, hpBar };
}

document.addEventListener("DOMContentLoaded", () => {
  const statCard = new StatCard(document.getElementById("battlefield"));

  // Mount from gameState (not PARTY/MONSTER) so the stat card sees live HP.
  const monsterStage = document.getElementById("monster-stage");
  const monsterMount = mountMonster(monsterStage, gameState.monster, statCard);
  window.monsterSprite = monsterMount.sprite;
  window.monsterHpBar = monsterMount.hpBar;

  const rosterStage = document.getElementById("roster-stage");
  const partyMounts = gameState.party.map((m) => mountPartyMember(rosterStage, m, statCard));
  window.partySprites = Object.fromEntries(gameState.party.map((m, i) => [m.id, partyMounts[i].sprite]));
  window.partyHpBars = Object.fromEntries(gameState.party.map((m, i) => [m.id, partyMounts[i].hpBar]));

  renderAll();
});
