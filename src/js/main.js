function resolveSheet(sheet) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(sheet);
    img.onerror = () => {
      console.warn(`Missing character sheet "${sheet}", using ${DEFAULT_CHAR_SHEET}`);
      resolve(DEFAULT_CHAR_SHEET);
    };
    img.src = encodeURI(sheet);
  });
}

async function mountPartyMember(container, member) {
  const wrapper = document.createElement("div");
  wrapper.className = "party-member";
  wrapper.dataset.id = member.id;

  const spriteEl = document.createElement("div");
  const nameEl = document.createElement("span");
  nameEl.className = "party-member__name";
  nameEl.textContent = member.name;

  wrapper.append(spriteEl, nameEl);
  container.appendChild(wrapper);

  const sheet = await resolveSheet(member.sheet);
  return new SpriteCharacter(spriteEl, {
    animations: animationsFromSheet(sheet),
    scale: 2,
    facing: "right",
  });
}

function mountMonster(container, monster) {
  const spriteEl = document.createElement("div");
  container.appendChild(spriteEl);

  return new SpriteCharacter(spriteEl, {
    animations: animationsFromFiles(monster.sprite),
    scale: 2,
    facing: "left",
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const monsterStage = document.getElementById("monster-stage");
  window.monsterSprite = mountMonster(monsterStage, MONSTER);

  const rosterStage = document.getElementById("roster-stage");
  const partySprites = await Promise.all(PARTY.map((m) => mountPartyMember(rosterStage, m)));
  window.partySprites = Object.fromEntries(PARTY.map((m, i) => [m.id, partySprites[i]]));
});