# 581 Demon Hunters

**581 Demon Hunters** is a turn-based pixel-art RPG battle. Our three-person party, Fion, Wish, and Kevin, team up to defeat a demon.

**Play it here:** https://fion-lei.github.io/CPSC581-Project1/

## Table of Contents

- [How to Play](#how-to-play)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [References](#references)

## How to Play

### Turns

- Turns alternate between the party and the demon.
- On the party's turn, click each hero to attack once.
- Once every hero has attacked, the demon strikes back.
- Defeat the demon before it defeats your party.

### Actions and Items

- **Actions:** before attacking, one hero may use their special action, which then goes on cooldown.

  | Hero | Action | Effect |
  |---|---|---|
  | Fion | Attack Up | Boosts the whole party's ATK until your next turn |
  | Wish | Group Heal | Restores HP to every party member |
  | Kevin | Defense Up | Boosts the whole party's DEF until your next turn |

- **Items:** each hero's favourite food heals the whole party.

### Interface

- Hover over a hero or the demon to see their stat card (class, strengths, weaknesses, HP/ATK/DEF).
- Hover over an action or item to see what it does.
- The settings menu (gear, top right) has Help, Instructions, Restart and a toggle for the debug console.

## Built With

A static frontend website, with no frameworks or build tools:

- HTML
- CSS
- JavaScript

## Getting Started

There is no build step or install. `index.html` loads all the game files directly.

1. Clone the repository:
    ```bash
    git clone https://github.com/fion-lei/CPSC581-Project1.git
    cd CPSC581-Project1
    ```
2. Open `index.html` in a browser, or serve the folder locally, for example:
    ```bash
    python -m http.server 8000
    ```
    then visit http://localhost:8000. The VS Code **Live Server** extension also works.

## Deployment

The site is hosted on GitHub Pages. Any change merged into `main` goes live automatically within a few minutes.

## Project Structure

```
CPSC581-Project1/
├── index.html        # Page entry point: layout containers and <script> tags (load order matters)
├── fonts/            # Monogram pixel font used for all in-game text
├── sounds/           # Sound effects (attacks, heal, buff, select, death, refresh, win, defeat)
├── sprites/          # Third-party pixel art (see References). Don't edit these files
│   ├── characters/   # Party sprite sheets and profile portraits (fion, wish, kevin)
│   ├── icons/        # Item, ability and UI icons (e.g. settings gear, help)
│   ├── monsters/     # Demon sprite sheets (idle, attack, hurt, death)
│   └── ui/           # Paper UI pack: banners, panels, buttons, holders, HP bars
└── src/
    ├── css/          # Stylesheets: page layout, battlefield, action bar, stat cards, settings menu, debug panel
    └── js/
        ├── main.js   # Builds the battle screen and wires everything together on page load
        ├── data/     # Game content: party members, the demon and items (stats, traits, specials)
        └── engine/   # Game logic and UI components: state and turns, combat, rendering, sprites,
                      # sounds, action bar, stat card, turn banner, settings menu, debug controls
```

## Contributors

- Fion Lei
- Wish Li
- Kevin Wilson

## References

| Asset | Source |
|---|---|
| Icons | [Raven Fantasy Icons](https://clockworkraven.itch.io/raven-fantasy-icons) |
| Bosses | [Tiny RPG Character Asset Pack 02](https://zerie.itch.io/tiny-rpg-character-asset-pack-02) |
| UI | [Pocket Inventory Series #5: Player Status](https://humblepixel.itch.io/pocket-inventory-series-5-player-status) |
| HP bars | [Basic Pixel Health Bar and Scroll Bar](https://bdragon1727.itch.io/basic-pixel-health-bar-and-scroll-bar) |
| Font | [Monogram](https://datagoblin.itch.io/monogram) |
| Sound effects | [Pixabay](https://pixabay.com/sound-effects/) |
