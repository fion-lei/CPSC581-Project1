// Displays damage and special attack feedback in combat (heal, defense up, attack up)
function combatNumberText(amount, type) {
  if (type === "heal") return `+${amount} HP`;
  if (type === "defenseUp") return `+${amount} DEF`;
  if (type === "attackUp") return `+${amount} ATK`;
  return `-${amount} HP`;
}

function showCombatNumber(anchor, amount, type) {
  const battlefield = document.getElementById("battlefield");
  if (!anchor || !battlefield || amount <= 0) return;

  const box = battlefield.getBoundingClientRect();
  const rect = anchor.getBoundingClientRect();
  const el = document.createElement("span");
  el.className = `combat-number combat-number--${type}`;
  el.textContent = combatNumberText(amount, type);
  el.style.left = `${rect.left - box.left + rect.width / 2}px`;
  el.style.top = `${rect.top - box.top}px`;
  el.addEventListener("animationend", () => el.remove(), {once: true});
  battlefield.appendChild(el);
}

window.showCombatNumber = showCombatNumber;
