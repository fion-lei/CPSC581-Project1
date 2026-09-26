let debugPanel = null;

function initDebugControls() {
  const container = document.getElementById("debug-controls");
  if (!container) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.id = "debug-toggle";
  toggle.textContent = "Debug";
  toggle.setAttribute("aria-expanded", "false");

  debugPanel = document.createElement("div");
  debugPanel.id = "debug-panel";
  debugPanel.hidden = true;

  toggle.addEventListener("click", () => {
    const opening = debugPanel.hidden;

    debugPanel.hidden = !opening;
    toggle.setAttribute("aria-expanded", String(opening));
    toggle.textContent = opening ? "Close Debug" : "Debug";

    if (opening) {
      renderDebugPanel(debugPanel);
    }
  });

  container.append(toggle, debugPanel);
}

function refreshDebugControls() {
  if (!debugPanel || debugPanel.hidden) return;

  renderDebugPanel(debugPanel);
}

window.refreshDebugControls = refreshDebugControls;

function refreshDebugControls() {
  if (!debugPanel || debugPanel.hidden) return;

  renderDebugPanel(debugPanel);
}

window.refreshDebugControls = refreshDebugControls;


function renderDebugPanel(panel) {
  panel.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = "Debug Controls";
  panel.appendChild(heading);

  const partySection = document.createElement("div");
  partySection.className = "debug-entity-grid";

  gameState.party.forEach((member) => {
    partySection.appendChild(createPartyControls(member, panel));
  });

  panel.appendChild(partySection);

  panel.appendChild(createMonsterControls(gameState.monster, panel));

  const actions = document.createElement("div");
  actions.className = "debug-actions";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "Fresh Battle";

  resetButton.addEventListener("click", () => {
    resetGameState();
    renderDebugPanel(panel);
  });

  actions.appendChild(resetButton);
  panel.appendChild(actions);
}


function createPartyControls(member, panel) {
  const card = createEntityCard(member.name);

  card.appendChild(
    createStatControl(
      "HP",
      () => `${member.hp}/${member.stats.maxHp}`,
      () => {
        member.hp = Math.max(0, member.hp - 1);
        syncBattleState();
      },
      () => {
        member.hp = Math.min(member.stats.maxHp, member.hp + 1);
        syncBattleState();
      },
      panel
    )
  );

  card.appendChild(
    createStatControl(
      "ATK",
      () => formatBuffedStat(member.stats.atk, gameState.buffs.atk),
      () => {
        member.stats.atk = Math.max(0, member.stats.atk - 1);
      },
      () => {
        member.stats.atk += 1;
      },
      panel
    )
  );

  card.appendChild(
    createStatControl(
      "DEF",
      () => formatBuffedStat(member.stats.def, gameState.buffs.def),
      () => {
        member.stats.def = Math.max(0, member.stats.def - 1);
      },
      () => {
        member.stats.def += 1;
      },
      panel
    )
  );

  card.appendChild(
    createStatControl(
      "Cooldown",
      () => member.cooldown,
      () => {
        member.cooldown = Math.max(0, member.cooldown - 1);
      },
      () => {
        member.cooldown += 1;
      },
      panel
    )
  );

  const shortcuts = document.createElement("div");
  shortcuts.className = "debug-shortcuts";

  shortcuts.append(
    createActionButton("Full HP", () => {
      member.hp = member.stats.maxHp;
      syncBattleState();
      refreshDebug();
    }),

    createActionButton("KO", () => {
      member.hp = 0;
      syncBattleState();
      refreshDebug();
    }),

    createActionButton("Revive", () => {
      if (member.hp === 0) {
        member.hp = 1;
      }

      syncBattleState();
      refreshDebug();
    }),

    createActionButton("Ready", () => {
      member.acted = false;
      member.cooldown = 0;
      gameState.specialUsed = false;

      refreshDebug();
    })
  );

  card.appendChild(shortcuts);

  return card;
}


function createMonsterControls(monster, panel) {
  const card = createEntityCard(monster.name);
  card.classList.add("debug-entity--monster");

  card.appendChild(
    createStatControl(
      "HP",
      () => `${monster.hp}/${monster.stats.maxHp}`,
      () => {
        monster.hp = Math.max(0, monster.hp - 1);
        syncBattleState();
      },
      () => {
        monster.hp = Math.min(monster.stats.maxHp, monster.hp + 1);
        syncBattleState();
      },
      panel
    )
  );

  card.appendChild(
    createStatControl(
      "ATK",
      () => monster.stats.atk,
      () => {
        monster.stats.atk = Math.max(0, monster.stats.atk - 1);
      },
      () => {
        monster.stats.atk += 1;
      },
      panel
    )
  );

  card.appendChild(
    createStatControl(
      "DEF",
      () => monster.stats.def,
      () => {
        monster.stats.def = Math.max(0, monster.stats.def - 1);
      },
      () => {
        monster.stats.def += 1;
      },
      panel
    )
  );

  const shortcuts = document.createElement("div");
  shortcuts.className = "debug-shortcuts";

  shortcuts.append(
    createActionButton("Full HP", () => {
      monster.hp = monster.stats.maxHp;
      syncBattleState();
      refreshDebug();
    }),

    createActionButton("KO", () => {
      monster.hp = 0;
      syncBattleState();
      refreshDebug();
    })
  );

  card.appendChild(shortcuts);

  return card;
}


function createEntityCard(name) {
  const card = document.createElement("section");
  card.className = "debug-entity";

  const heading = document.createElement("h3");
  heading.textContent = name;

  card.appendChild(heading);

  return card;
}


function createStatControl(label, getValue, decrease, increase, panel) {
  const row = document.createElement("div");
  row.className = "debug-stat";

  const name = document.createElement("span");
  name.className = "debug-stat__label";
  name.textContent = label;

  const minus = document.createElement("button");
  minus.type = "button";
  minus.textContent = "−";

  const value = document.createElement("span");
  value.className = "debug-stat__value";
  value.textContent = getValue();

  const plus = document.createElement("button");
  plus.type = "button";
  plus.textContent = "+";

  minus.addEventListener("click", () => {
    decrease();
    refreshDebug();
  });

  plus.addEventListener("click", () => {
    increase();
    refreshDebug();
  });

  row.append(name, minus, value, plus);

  return row;
}


function createActionButton(label, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", action);

  return button;
}

function formatBuffedStat(base, bonus) {
  const total = base + bonus;

  if (bonus > 0) {
    return `${total} (${base}+${bonus})`;
  }

  return `${total}`;
}


function refreshDebug() {
  renderAll();
}


// Keeps HP/alive/game-over values consistent after manual debug changes.
function syncBattleState() {
  gameState.party.forEach((member) => {
    member.alive = member.hp > 0;
  });

  gameState.monster.alive = gameState.monster.hp > 0;

  if (!gameState.monster.alive) {
    gameState.gameOver = true;
    gameState.winner = "party";
  } else if (livingParty().length === 0) {
    gameState.gameOver = true;
    gameState.winner = "monster";
  } else {
    gameState.gameOver = false;
    gameState.winner = null;
  }
}