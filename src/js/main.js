
function mountSpriteFrame(container, frameDef) {
  const el = document.createElement("div");
  el.className = "sprite-frame sprite-loop";
  el.style.setProperty("--frame-w", frameDef.frameW);
  el.style.setProperty("--frame-h", frameDef.frameH);
  el.style.setProperty("--frame-count", frameDef.frameCount);
  el.style.width = `${frameDef.frameW}px`;
  el.style.height = `${frameDef.frameH}px`;
  el.style.backgroundImage = `url("${encodeURI(frameDef.sheet)}")`;
  el.style.backgroundSize = `${frameDef.frameW * frameDef.frameCount}px ${frameDef.frameH}px`;
  el.style.backgroundPositionY = `${-frameDef.row * frameDef.frameH}px`;
  container.appendChild(el);
  return el;
}

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
  return new SpriteCharacter(spriteEl, { sheet, scale: 2, facing: "right" });
}

document.addEventListener("DOMContentLoaded", async () => {
  const monsterStage = document.getElementById("monster-stage");
  mountSpriteFrame(monsterStage, MONSTER.sprite.idle);

  const rosterStage = document.getElementById("roster-stage");
  const partySprites = await Promise.all(PARTY.map((m) => mountPartyMember(rosterStage, m)));
  window.partySprites = Object.fromEntries(PARTY.map((m, i) => [m.id, partySprites[i]]));
});

