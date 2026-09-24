
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

document.addEventListener("DOMContentLoaded", () => {
  const monsterStage = document.getElementById("monster-stage");
  mountSpriteFrame(monsterStage, MONSTER.sprite.idle);
});

