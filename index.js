const rows = 10;
const columns = 10;
const mines = 10;
const gameResults = {
  lose: "lose",
  win: "win",
};

const flaggedCells = new Set();
const generatedMines = new Set();
const revealedCells = new Set();
let cellData = {};

const gameContainer = document.querySelector("#grid");
const restartButton = document.querySelector("#restart");
const gameResultIndicator = document.querySelector("#game-result");
const flagCountIndicator = document.querySelector("#flag-count");

function startGame() {
  for (let key in cellData) {
    const selectedButton = buttonSelector(key);

    selectedButton.textContent = "";
    selectedButton.style.border = "5px outset white";
    selectedButton.style.backgroundColor = "lightgray";
    selectedButton.disabled = false;
    restartButton.style.display = "none";
  }

  cellData = {};
  gameResultIndicator.textContent = "";
  generatedMines.clear();
  flaggedCells.clear();
  revealedCells.clear();

  generateMine();
  updateButtons();
  gameContainer.style.pointerEvents = "all";
}

function drawButtons() {
  flagCountIndicator.textContent = `Flag count: ${flaggedCells.size}/${mines}`;
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    gameContainer.appendChild(row);
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement("button");
      const key = `${i} x ${j}`;
      cell.setAttribute("data-location", key);

      cell.onclick = () => handleButtonClick(key, new Set());
      cell.oncontextmenu = () => setFlag(key);
      cell.style.backgroundColor = "lightgray";
      cell.style.borderWidth = "5px";
      cell.style.borderColor = "white";
      cell.style.color = "black";
      cell.style.height = "40px";
      cell.style.width = "40px";
      cell.style.fontSize = "25px";
      cell.style.fontSize = "25px";
      cell.style.fontFamily = "monospace";

      row.appendChild(cell);
    }
  }
  generateMine();
  updateButtons();
}

function updateButtons() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const key = `${i} x ${j}`;
      if (cellData[key] !== "💣") {
        cellData[key] = calculateMineCountInNeighbours(key);
      }
    }
  }
}

function setFlag(key) {
  const selectedButton = buttonSelector(key);

  if (flaggedCells.has(key)) {
    flaggedCells.delete(key);
    selectedButton.textContent = "";
  } else {
    if (flaggedCells.size < mines) {
      flaggedCells.add(key);
      selectedButton.textContent = "🚩";
    }
  }
  flagCountIndicator.textContent = `Flag count: ${flaggedCells.size}/${mines}`;
  return false;
}

function isInBounds([x, y]) {
  if (x < 0 || y < 0) {
    return false;
  }
  if (x >= rows || y >= columns) {
    return false;
  }
  return true;
}

function getNeighbours(key) {
  const options = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  const [coorX, _, coorY] = key.split(" ");
  return options
    .map(([x, y]) => [Number(coorX) + x, Number(coorY) + y])
    .filter(isInBounds)
    .map(([x, y]) => `${x} x ${y}`);
}

function calculateMineCountInNeighbours(key) {
  let mineCount = 0;
  getNeighbours(key).forEach((neightbour) => {
    if (cellData[neightbour] === "💣") {
      mineCount++;
    }
  });
  return mineCount;
}

function revealButton(key) {
  const selectedButton = buttonSelector(key);

  selectedButton.textContent = cellData[key] !== 0 ? cellData[key] : "";
  selectedButton.disabled = true;
  selectedButton.style.border = "1px solid gray";
  flaggedCells.has(key) && flaggedCells.delete(key);

  if (cellData[key] === "💣") {
    selectedButton.style.backgroundColor = "red";
    endGame(gameResults.lose, key);
    return;
  }
  if (cellData[key] === 1) {
    selectedButton.style.color = "blue";
  }
  if (cellData[key] === 2) {
    selectedButton.style.color = "darkblue";
  }
  if (cellData[key] === 3) {
    selectedButton.style.color = "green";
  }
  if (cellData[key] === 3) {
    selectedButton.style.color = "darkgreen";
  }
  if (cellData[key] === 4) {
    selectedButton.style.color = "red";
  }
  if (cellData[key] >= 5) {
    selectedButton.style.color = "darkred";
  }
  revealedCells.add(key);
  if (hasWin()) {
    endGame(gameResults.win);
  }
}

function handleButtonClick(key) {
  if (flaggedCells.has(key)) {
    return;
  }
  propagateButtons(key, new Set());
}

function propagateButtons(key, visited) {
  visited.add(key);
  revealButton(key);

  const isEmpty = cellData[key] === 0;
  if (isEmpty) {
    getNeighbours(key).forEach((neighbour) => {
      if (!visited.has(neighbour)) {
        propagateButtons(neighbour, visited);
      }
    });
  }
}

function hasWin() {
  return revealedCells.size + generatedMines.size === rows * columns;
}

function generateMine() {
  while (generatedMines.size < mines) {
    const randomX = Math.floor(Math.random() * rows);
    const randomY = Math.floor(Math.random() * columns);
    const key = `${randomX} x ${randomY}`;
    if (generatedMines.has(key)) {
      continue;
    } else {
      cellData[key] = "💣";
      generatedMines.add(key);
    }
  }
}

function endGame(gameResult, key) {
  if (gameResult === gameResults.lose && key) {
    for (let mine of generatedMines) {
      const selectedButton = buttonSelector(mine);

      if (flaggedCells.has(mine)) {
        continue;
      } else {
        selectedButton.textContent = cellData[key];
      }
    }

    for (let flagged of flaggedCells) {
      const selectedButton = buttonSelector(flagged);

      if (generatedMines.has(flagged)) {
        continue;
      } else {
        selectedButton.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
      }
    }
    gameResultIndicator.textContent = "LOSE";
    gameResultIndicator.style.color = "red";
  }
  if (gameResult === gameResults.win) {
    for (let mine of generatedMines) {
      const selectedButton = buttonSelector(mine);
      selectedButton.textContent = "🚩";
    }
    gameResultIndicator.textContent = "WIN";
    gameResultIndicator.style.color = "green";
  }

  gameContainer.style.pointerEvents = "none";
  restartButton.style.display = "inline-block";
  restartButton.onclick = startGame;
}

function buttonSelector(key) {
  const selector = `button[data-location='${key}']`;
  return document.querySelector(selector);
}

drawButtons();
