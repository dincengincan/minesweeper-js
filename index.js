const rows = 10;
const columns = 10;
const mines = 8;
const revealedKeys = new Map();
const gameContainer = document.querySelector("#grid");

const cellData = {};

function drawButtons() {
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.style.display = "flex";
    gameContainer.appendChild(row);
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement("button");
      const key = `${i} x ${j}`;
      cell.setAttribute("data-location", key);

      cell.style.backgroundColor = "lightgray";
      cell.onclick = () => propagateButtons(key, new Set());
      cell.style.borderWidth = "5px";
      cell.style.borderColor = "white";
      cell.style.height = "40px";
      cell.style.width = "40px";
      cell.style.fontSize = "30px";
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
  const generatedMines = [];
  while (generatedMines.length < mines) {
    const randomX = Math.floor(Math.random() * rows);
    const randomY = Math.floor(Math.random() * columns);
    key = `${randomX} x ${randomY}`;
    if (generatedMines.some((mine) => key === mine)) {
      continue;
    } else {
      cellData[key] = "💣";
      generatedMines.push(key);
    }
  }
}
drawButtons();
