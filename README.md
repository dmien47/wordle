# Wordle (simple web clone)

**Overview**
- **Description**: A minimal, browser-based Wordle clone implemented with vanilla HTML, CSS and JavaScript. The game displays a 6x5 board and lets the player guess the daily 5-letter word fetched from a remote API.

**How it works**
- **Gameplay**: Type a 5-letter guess (the app uses a hidden input) and press Enter to submit. Each submitted row is evaluated and each tile is colored: green for correct, yellow for present, gray for absent.
- **Input handling**: The visible board is updated from a hidden text input (`hiddenInput`) so all typing is keyboard-driven; clicking anywhere focuses the input.
- **Validation & daily word**: The app requests the daily word from `https://words.dev-apis.com/word-of-the-day` and validates guesses using `https://words.dev-apis.com/validate-word`.

**Features**
- **6 attempts**: Six rows for up to six guesses.
- **Color rules**: Exact match -> `correct`, present elsewhere -> `present`, not in word -> `absent`.
- **Remote validation**: Uses an external API to ensure guessed words are valid English words and to fetch the word of the day.
- **Simple UI**: Responsive grid of tiles, no external libraries.

**Files**
- **HTML**: [index.html](index.html) — board markup, six rows of five `.tile` elements and the hidden input with id `hiddenInput`.
- **JavaScript**: [script.js](script.js) — game logic: fetching the word, validating guesses, updating tiles, and handling the input and row progression.
- **Styles**: [styles.css](styles.css) — layout and color styling. Defines `.tile`, `.tile.correct`, `.tile.present`, and `.tile.absent`.

**Implementation details**
- **Key functions**: `getWordOfTheDay()` (fetches daily word), `isValidWord(word)` (POSTs to validate), `submitGuess(guess)` (main submission flow), `checkGuess(guess, tiles)` (applies color rules), `buildFrequencyMap(word)` (handles duplicate-letter logic).
- **Flow**: On Enter (when input length is 5) `submitGuess()` calls `checkGuess()`; if the guess is invalid an alert is shown and the row is not consumed. On correct guess the input is disabled and a win alert is shown; if all rows are used the correct word is revealed in an alert.
- **Visual state**: A submitted row receives the `submitted` class; each tile receives one of `correct`, `present`, or `absent` classes to drive colors from CSS.

**Styling notes**
- **Colors**: Base tile, present (yellowish `#b59f3b`), correct (green `#538d4e`), and absent default (`#3a3a3c`).
- **Layout**: `.board` uses a vertical flex column and each `.row` is a grid of 5 fixed-size tiles.

**Run / Develop**
- **Requirements**: A modern browser and internet access (the app fetches data from remote APIs).
- **Quick start**: Open `index.html` in your browser. For a simple local server (recommended for some browsers), run:

```bash
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

**APIs used**
- **Word of the day**: `https://words.dev-apis.com/word-of-the-day` — returns the daily word (converted to uppercase in the app).
- **Validation**: `https://words.dev-apis.com/validate-word` — POSTs `{ word }` and expects a `{ validWord: boolean }` response; used to reject non-words.

**Limitations & TODO**
- **Requires internet**: The app depends on the external API and will not work fully offline.
- **UX**: Uses browser `alert()` for messages; consider in-app banners/modals and animations for better UX.
- **Accessibility/Keyboard**: Focus handling exists but there is no visible on-screen keyboard; consider adding one and ARIA attributes.
- **Error handling**: Network errors currently surface via alerts/console; consider retry/backoff and friendlier messaging.

**Credits**
- Built with plain HTML, CSS, and JavaScript. Small learning/demo project.
