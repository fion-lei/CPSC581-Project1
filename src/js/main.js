// Builds the battle screen: an HP bar + sprite for the monster and each party
// member, Attack/Heal buttons, and the hover stat card. Hands off to
// combat.js (actions) and render.js (HP bars, turn banner) from there.

function mountPartyMember(container, member, statCard) {
  const wrapper = document.createElement("div");
  wrapper.className = "party-member";
  wrapper.dataset.id = member.id;

  const hpBarEl = document.createElement("div");
  const hpBar = new HpBar(hpBarEl, { variant: "party", scale: 2 });

  const attackBtn = document.createElement("button");
  attackBtn.type = "button";
  attackBtn.className = "party-member__attack";
  attackBtn.setAttribute("aria-label", `${member.name}: attack`);
  attackBtn.addEventListener("click", () => partyAttack(member.id));

  const spriteEl = document.createElement("div");
  attackBtn.appendChild(spriteEl);

  const nameEl = document.createElement("span");
  nameEl.className = "party-member__name";
  nameEl.textContent = member.name;

  const specialBtn = document.createElement("button");
  specialBtn.type = "button";
  specialBtn.className = "party-member__special";
  specialBtn.addEventListener("click", () => partySpecial(member.id));

  const specialIcon = document.createElement("img");
  specialIcon.className = "party-member__special-icon";
  specialIcon.src = encodeURI(member.special.icon);
  specialIcon.alt = "";

  // Turns of cooldown left, shown over the icon (set by render.js)
  const specialCooldown = document.createElement("span");
  specialCooldown.className = "party-member__special-cooldown";
  specialBtn.append(specialIcon, specialCooldown);

  wrapper.append(hpBarEl, attackBtn, specialBtn);
  container.appendChild(wrapper);
  statCard.attach(wrapper, member);

  const sprite = new SpriteCharacter(spriteEl, {
    animations: animationsFromSheet(member.sheet),
    scale: 2,
    facing: "right",
  });

  return { sprite, hpBar };
}

const MONSTER_SCALE = 6;

function mountMonster(container, monster, statCard) {
  const hpBarEl = document.createElement("div");
  const hpBar = new HpBar(hpBarEl, { variant: "monster", scale: 2 });

  const spriteEl = document.createElement("div");

  const { x, y, width, height } = monster.body;
  const frameH = monster.sprite.idle.frameH;
  spriteEl.style.marginTop = `${-y * MONSTER_SCALE}px`;
  spriteEl.style.marginBottom = `${-(frameH - y - height) * MONSTER_SCALE}px`;

  const hitbox = document.createElement("div");
  hitbox.className = "sprite-hitbox";
  Object.assign(hitbox.style, {
    left: `${x * MONSTER_SCALE}px`,
    top: `${y * MONSTER_SCALE}px`,
    width: `${width * MONSTER_SCALE}px`,
    height: `${height * MONSTER_SCALE}px`,
  });
  spriteEl.appendChild(hitbox);

  container.append(hpBarEl, spriteEl);
  statCard.attach(hitbox, monster);

  const sprite = new SpriteCharacter(spriteEl, {
    animations: animationsFromFiles(monster.sprite),
    scale: MONSTER_SCALE,
    facing: "left",
  });

  return { sprite, hpBar };
}

document.addEventListener("DOMContentLoaded", () => {
  // Party buffs (Attack Up / Defense Up) show on party members' cards.
  window.statCard = new StatCard(document.getElementById("battlefield"), {
    bonuses: (entity) => (gameState.party.includes(entity) ? gameState.buffs : {}),
  });
  window.turnBanner = new TurnBanner(document.getElementById("turn-banner"));

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
