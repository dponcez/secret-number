# Secret Number

**English** | [Español](README_ES.md)

A browser game where you guess a secret number within the range of your chosen difficulty. After an incorrect guess, the game tells you whether the secret number is higher or lower.

## How to play

1. Select a difficulty.
2. Click **Start Game** and enter a number within the displayed range.
3. Use the hints and remaining-attempt counter to find the secret number.
4. A correct guess advances to the next level. The reset button returns to the first level and clears the saved level record.

| Difficulty | Starting range | Starting attempts |
| --- | ---: | ---: |
| Easy | 1–50 | 15 |
| Medium | 1–150 | 10 |
| Hard | 1–500 | 7 |
| Super Hard | 1–1000 | 5 |

Each level currently increases the upper range by 30 and adds one attempt; the progression has no configured limit. The level record is saved in the browser's `localStorage`.

## User interface

### Welcome screen

The splash screen introduces the game and provides the **Start Game** action.

![Welcome screen with the Start Game button](./src/assets/images/splash-screen.png)

### Difficulty selection

Choose one of four difficulties. The selected option is highlighted before you make a guess.

![Difficulty selector with four number ranges](./src/assets/images/dif-section.png)

### Game screen

The game screen shows the selected difficulty, input, current level, number range, and remaining attempts.

![Game screen at level 1 with the easy difficulty selected](./src/assets/images/init-game.png)

### Number input

Enter a guess in the number field and submit it to receive a hint.

![Number input field and submit button](./src/assets/images/input-field.png)

### Hint and attempts

After an incorrect guess, a notification indicates whether the secret number is higher or lower and displays the remaining attempts.

![Higher-or-lower hint and remaining-attempt count](./src/assets/images/alert-message.png)

## Run locally

The app has no build step. Serve the project root with a local HTTP server, such as the VS Code Live Server extension, then open `index.html`. Alternatively, run:

```bash
python -m http.server 8000
```

Visit <http://localhost:8000>.

To install the development dependencies and run the test suite:

```bash
pnpm install
pnpm test
```

## Project structure

```text
src/
├── __tests__/   Automated tests
├── assets/      Styles, icons, and images
├── handlers/    Game event handlers
├── helpers/     Difficulty configuration
├── hooks/       Record and theme persistence
├── modules/     Template and round setup
├── ui/          Notifications
├── utils/       Shared utilities
└── variables/   Game state and DOM references
```

The app entry point is `src/js/main.js`; the HTML page is `index.html`.

## Documentation and license

The [Guía de Mejoras](./GUIA_DE_MEJORAS.md) contains proposed improvements and implementation examples. Those proposals are not yet part of the game.

This project is distributed under the [MIT License](./LICENSE).
