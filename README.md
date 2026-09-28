# CPSC 581 Project 1 - Deadline Demon


**Deadline Demon** is a turn-based pixel-art RPG battle. Our three-person party, Fion, Wish, and Kevin, team up to defeat a demon.

- **Turns alternate** between the party and the demon.
- On the party's turn, click each hero to attack once. Before attacking, one hero may use their special action (Attack Up, Group Heal or Defense Up), which then goes on cooldown.
- **Items** (the group's favourite foods) heal the whole party.
- Hover over any character/demon to see their stat card (class, strengths, weaknesses, HP/ATK/DEF), or over an action or item to see what it does.
- The **settings menu** (gear, top right) has Help, Instructions, Restart and a toggle for the debug console.

**Website**: https://fion-lei.github.io/CPSC581-Project1/

This project is a static frontend website built using:
- HTML/CSS
- JavaScript

## Getting Started
There is no build step or install. The game is plain HTML, CSS and JavaScript loaded straight by `index.html`.

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

# Project Structure
```
CPSC581-Project1/
├── index.html        # Page entry point: layout containers and <script> tags (load order matters)
├── fonts/            # Monogram pixel font used for all in-game text
├── sounds/           # Sound effects (attacks, heal, buff, select, win, defeat)
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

# Contributors
- Fion Lei
- Wish Li
- Kevin Wilson

# References
Sprites from: 
- https://clockworkraven.itch.io/raven-fantasy-icons
- https://zerie.itch.io/tiny-rpg-character-asset-pack-02
- https://humblepixel.itch.io/pocket-inventory-series-5-player-status
- https://admurin.itch.io/free-chest-animations
- https://bdragon1727.itch.io/basic-pixel-health-bar-and-scroll-bar

Font from:
- https://datagoblin.itch.io/monogram

Sound effects from:
- https://pixabay.com/sound-effects/
