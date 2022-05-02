const rows = 10;
const columns = 10;
const mines = 8;
const flaggedCells = new Set();
const gameContainer = document.querySelector("#grid");
const restartButton = document.querySelector("#restart");
restartButton.style.margin = "10px";
restartButton.style.display = "none";
restartButton.onclick = startGame;
let generatedMines = [];

let cellData = {};

function startGame() {
  for (let key in cellData) {
    const selector = `button[data-location='${key}']`;
    const selectedButton = document.querySelector(selector);
    selectedButton.textContent = "";
    selectedButton.style.border = "5px outset white";
    selectedButton.style.backgroundColor = "lightgray";
    selectedButton.disabled = false;
    restartButton.style.display = "none";
  }

  cellData = {};
  generatedMines = [];
  flaggedCells.clear();

  generateMine();
  updateButtons();
  gameContainer.style.pointerEvents = "all";
}

function drawButtons() {
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
  const selector = `button[data-location='${key}']`;
  const selectedButton = document.querySelector(selector);

  if (flaggedCells.has(key)) {
    flaggedCells.delete(key);
    selectedButton.textContent = "";
  } else {
    flaggedCells.add(key);
    selectedButton.textContent = "🚩";
  }
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
  const selector = `button[data-location='${key}']`;
  const selectedButton = document.querySelector(selector);

  selectedButton.textContent = cellData[key] !== 0 ? cellData[key] : "";
  selectedButton.disabled = true;
  selectedButton.style.border = "1px solid gray";
  if (cellData[key] === "💣") {
    selectedButton.style.backgroundColor = "red";
    endGame(key);
  } else if (cellData[key] === 1) {
    selectedButton.style.color = "blue";
  } else if (cellData[key] === 2) {
    selectedButton.style.color = "darkblue";
  } else if (cellData[key] === 3) {
    selectedButton.style.color = "green";
  } else if (cellData[key] === 3) {
    selectedButton.style.color = "darkgreen";
  } else if (cellData[key] === 4) {
    selectedButton.style.color = "red";
  } else if (cellData[key] >= 5) {
    selectedButton.style.color = "darkred";
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

function generateMine() {
  while (generatedMines.length < mines) {
    const randomX = Math.floor(Math.random() * rows);
    const randomY = Math.floor(Math.random() * columns);
    const key = `${randomX} x ${randomY}`;
    if (generatedMines.some((mine) => key === mine)) {
      continue;
    } else {
      cellData[key] = "💣";
      generatedMines.push(key);
    }
  }
}

function endGame(key) {
  for (let mine of generatedMines) {
    const selector = `button[data-location='${mine}']`;
    const selectedButton = document.querySelector(selector);
    selectedButton.textContent = cellData[key];
  }
  gameContainer.style.pointerEvents = "none";
  restartButton.style.display = "block";
}

drawButtons();
