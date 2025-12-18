window.addEventListener("load", async () => {
  input.focus();
  wordToGuess = await getWordOfTheDay();
});

document.addEventListener("click", () => {
  input.focus();
});

const dailyURL = "https://words.dev-apis.com/word-of-the-day";
const validURL = "https://words.dev-apis.com/validate-word";

const input = document.getElementById("hiddenInput");
const rows = document.querySelectorAll(".row");
let wordToGuess = "";
let currentRow = 0;

input.addEventListener("input", () => {
  const value = input.value.toUpperCase();
  const tiles = getCurrentRowTiles();
  tiles.forEach((tile, i) => {
    tile.textContent = value[i] || "";
  });
});

input.addEventListener("keydown", e => {
  console.log("keydown:", e.key, "value:", input.value);

  const valueLength = input.value.length;
  if (e.key === "Enter" && valueLength === 5) {
    e.preventDefault();
    submitGuess(input.value.toUpperCase());
  }
});

async function submitGuess(guess) {
  console.log("submitGuess start:", guess);

  const tiles = getCurrentRowTiles();
  const success = await checkGuess(guess, tiles);

  console.log("submitGuess after checkGuess, success =", success);

  if (!success) return;

  if (guess === wordToGuess) {
    setTimeout(() => {
      alert("🎉 You win!");
    }, 300);
    input.disabled = true;
    return;
  }

  rows[currentRow].classList.add("submitted");
  currentRow++;
  input.value = "";
  if (currentRow === rows.length) {
    alert(`Game Over! The word was ${wordToGuess}`);
  }

  console.log("Moved to row:", currentRow);
}

async function checkGuess(guess, tiles) {
  console.log("checkGuess start:", guess);

  const valid = await isValidWord(guess);
  console.log("word valid?", valid);

  if (valid === false) {
    alert("Not a valid word");
    input.focus();
    return false;
  }

  console.log("Building frequency map for:", wordToGuess);
  const map = buildFrequencyMap(wordToGuess);
  for (let i = 0; i < 5; i++) {
    if (guess[i] === wordToGuess[i]) {
      tiles[i].classList.add("correct");
      map.set(guess[i], map.get(guess[i]) - 1);
    }
  }
  for (let i = 0; i < 5; i++) {
    if (tiles[i].classList.contains("correct")) continue;
    if (map.get(guess[i]) > 0) {
      tiles[i].classList.add("present");
      map.set(guess[i], map.get(guess[i]) - 1);
    } else {
      tiles[i].classList.add("absent");
    }
  }
  return true;
}

function buildFrequencyMap(word) {
  const map = new Map();
  for (const char of word) {
    map.set(char, (map.get(char) || 0) + 1);
  }
  return map;
}

async function getWordOfTheDay() {
  const response = await fetch(dailyURL);
  const data = await response.json();
  return data.word.toUpperCase();
}

async function isValidWord(word) {
  try {
    console.log("Validating word:", word);

    const response = await fetch(validURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });

    console.log("Validation response status:", response.status);

    const data = await response.json();
    console.log("Validation response data:", data);

    return data.validWord;
  } catch (e) {
    console.error("Error validating word:", e);
    return false;
  }
}

const getCurrentRowTiles = () => rows[currentRow].querySelectorAll(".tile");
