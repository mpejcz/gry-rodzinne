import {
  generateMap,
  MAP_COLUMNS,
  MAP_ROWS,
  TERRAIN,
} from "./map.js";
import {
  attackUnit,
  createGuard,
  createScout,
  enemyStrike,
  findTile,
  getAvailableMoves,
  getAttackTargets,
  isAdjacent,
  moveUnit,
} from "./units.js";
import {
  canUpgradeCity,
  captureCity,
  createCapital,
  createEnemyCity,
  getUpgradeCost,
  STARTING_COINS,
  upgradeCity,
} from "./cities.js";

const canvas = document.querySelector("#game-map");
const context = canvas.getContext("2d");
const mapFrame = document.querySelector(".map-frame");
const newMapButton = document.querySelector("#new-map");
const endTurnButton = document.querySelector("#end-turn");
const turnNumber = document.querySelector("#turn-number");
const coinCount = document.querySelector("#coin-count");
const mapInstruction = document.querySelector("#map-instruction");
const emptySelection = document.querySelector("#selection-empty");
const selectionDetails = document.querySelector("#selection-details");
const unitDetails = document.querySelector("#unit-details");
const unitPosition = document.querySelector("#unit-position");
const unitHealth = document.querySelector("#unit-health");
const unitStatus = document.querySelector("#unit-status");
const cityDetails = document.querySelector("#city-details");
const cityName = document.querySelector("#city-name");
const cityLevel = document.querySelector("#city-level");
const cityOwner = document.querySelector("#city-owner");
const cityIncome = document.querySelector("#city-income");
const upgradeCityButton = document.querySelector("#upgrade-city");
const enemyDetails = document.querySelector("#enemy-details");
const enemyPosition = document.querySelector("#enemy-position");
const enemyHealth = document.querySelector("#enemy-health");
const resultDetails = document.querySelector("#result-details");
const resultIcon = document.querySelector("#result-icon");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const restartGameButton = document.querySelector("#restart-game");
const terrainName = document.querySelector("#terrain-name");
const terrainSwatch = document.querySelector("#terrain-swatch");
const tileCoordinates = document.querySelector("#tile-coordinates");

let mapTiles = generateMap();
let capital = createCapital(mapTiles);
let enemyCity = createEnemyCity(mapTiles, capital);
let scout = createScout(mapTiles, capital, [enemyCity]);
let enemyGuard = createGuard(enemyCity);
let turn = 1;
let coins = STARTING_COINS;
let gameResult = null;
let selectedTile = null;
let hoveredTile = null;
let unitSelected = false;
let availableMoves = [];
let availableMoveKeys = new Set();
let attackTargets = [];
let attackTargetKeys = new Set();
let layout = null;

function tileKey(tile) {
  return tile ? `${tile.x}:${tile.y}` : "";
}

function isSameTile(first, second) {
  return first && second && first.x === second.x && first.y === second.y;
}

function scoutTile() {
  return findTile(mapTiles, scout.x, scout.y);
}

function capitalTile() {
  return findTile(mapTiles, capital.x, capital.y);
}

function enemyCityTile() {
  return findTile(mapTiles, enemyCity.x, enemyCity.y);
}

function enemyGuardAlive() {
  return enemyGuard.health > 0;
}

function controlledCities() {
  return enemyCity.owner === "player" ? [capital, enemyCity] : [capital];
}

function totalIncome() {
  return controlledCities().reduce((sum, city) => sum + city.income, 0);
}

function calculateLayout(width, height) {
  const horizontalPadding = width < 520 ? 18 : 46;
  const verticalPadding = width < 520 ? 70 : 96;
  const widthLimited = ((width - horizontalPadding * 2) * 2) / (MAP_COLUMNS + MAP_ROWS);
  const heightLimited =
    ((height - verticalPadding * 2) * 2) /
    ((MAP_COLUMNS + MAP_ROWS) * 0.52);
  const tileWidth = Math.max(24, Math.min(82, widthLimited, heightLimited));
  const tileHeight = tileWidth * 0.52;
  const mapHeight = ((MAP_COLUMNS + MAP_ROWS) * tileHeight) / 2;

  return {
    width,
    height,
    tileWidth,
    tileHeight,
    originX: width / 2,
    originY: Math.max(52, (height - mapHeight) / 2),
  };
}

function tilePosition(tile) {
  return {
    x: layout.originX + ((tile.x - tile.y) * layout.tileWidth) / 2,
    y: layout.originY + ((tile.x + tile.y) * layout.tileHeight) / 2,
  };
}

function diamondPath(position) {
  const halfWidth = layout.tileWidth / 2;
  const halfHeight = layout.tileHeight / 2;
  const path = new Path2D();

  path.moveTo(position.x, position.y);
  path.lineTo(position.x + halfWidth, position.y + halfHeight);
  path.lineTo(position.x, position.y + layout.tileHeight);
  path.lineTo(position.x - halfWidth, position.y + halfHeight);
  path.closePath();
  return path;
}

function drawWaterDetail(position, tile) {
  const offset = (tile.detail - 0.5) * layout.tileWidth * 0.24;
  context.beginPath();
  context.moveTo(position.x - layout.tileWidth * 0.2 + offset, position.y + layout.tileHeight * 0.48);
  context.lineTo(position.x + layout.tileWidth * 0.12 + offset, position.y + layout.tileHeight * 0.48);
  context.strokeStyle = "rgb(194 234 240 / 42%)";
  context.lineWidth = Math.max(1, layout.tileWidth * 0.018);
  context.lineCap = "round";
  context.stroke();
}

function drawForestDetail(position, tile) {
  const size = layout.tileWidth * 0.1;
  const centerY = position.y + layout.tileHeight * (0.44 + tile.detail * 0.12);

  context.fillStyle = "#214d31";
  for (const offset of [-0.12, 0.02, 0.15]) {
    const centerX = position.x + layout.tileWidth * offset;
    context.beginPath();
    context.moveTo(centerX, centerY - size);
    context.lineTo(centerX + size * 0.7, centerY + size * 0.45);
    context.lineTo(centerX - size * 0.7, centerY + size * 0.45);
    context.closePath();
    context.fill();
  }
}

function drawMountainDetail(position, tile) {
  const size = layout.tileWidth * (0.13 + tile.detail * 0.035);
  const baseY = position.y + layout.tileHeight * 0.7;

  context.beginPath();
  context.moveTo(position.x, baseY - size);
  context.lineTo(position.x + size * 0.9, baseY);
  context.lineTo(position.x - size * 0.9, baseY);
  context.closePath();
  context.fillStyle = "#555c55";
  context.fill();

  context.beginPath();
  context.moveTo(position.x, baseY - size);
  context.lineTo(position.x + size * 0.27, baseY - size * 0.56);
  context.lineTo(position.x - size * 0.22, baseY - size * 0.46);
  context.closePath();
  context.fillStyle = "#e4e3d7";
  context.fill();
}

function drawTerrainDetail(position, tile) {
  if (layout.tileWidth < 35) return;
  if (tile.terrain === "water") drawWaterDetail(position, tile);
  if (tile.terrain === "forest") drawForestDetail(position, tile);
  if (tile.terrain === "mountain") drawMountainDetail(position, tile);
}

function drawMoveMarker(path, position) {
  context.fillStyle = "rgb(255 225 151 / 30%)";
  context.fill(path);
  context.strokeStyle = "#f2d17e";
  context.lineWidth = Math.max(2, layout.tileWidth * 0.035);
  context.stroke(path);

  context.beginPath();
  context.arc(
    position.x,
    position.y + layout.tileHeight / 2,
    Math.max(2.5, layout.tileWidth * 0.04),
    0,
    Math.PI * 2,
  );
  context.fillStyle = "#fff0bd";
  context.fill();
}

function drawAttackMarker(path, position) {
  context.fillStyle = "rgb(209 82 67 / 34%)";
  context.fill(path);
  context.strokeStyle = "#ef8c79";
  context.lineWidth = Math.max(3, layout.tileWidth * 0.045);
  context.stroke(path);

  context.beginPath();
  context.moveTo(position.x - layout.tileWidth * 0.055, position.y + layout.tileHeight * 0.36);
  context.lineTo(position.x + layout.tileWidth * 0.055, position.y + layout.tileHeight * 0.64);
  context.moveTo(position.x + layout.tileWidth * 0.055, position.y + layout.tileHeight * 0.36);
  context.lineTo(position.x - layout.tileWidth * 0.055, position.y + layout.tileHeight * 0.64);
  context.strokeStyle = "#ffe0d8";
  context.lineWidth = Math.max(2, layout.tileWidth * 0.025);
  context.lineCap = "round";
  context.stroke();
}

function drawTile(tile) {
  const position = tilePosition(tile);
  const path = diamondPath(position);
  const terrain = TERRAIN[tile.terrain];
  const selected = isSameTile(tile, selectedTile);
  const hovered = isSameTile(tile, hoveredTile);
  const available = availableMoveKeys.has(tileKey(tile));
  const attackable = attackTargetKeys.has(tileKey(tile));

  context.fillStyle = terrain.edge;
  context.fill(path);

  context.save();
  context.translate(0, -Math.max(1, layout.tileHeight * 0.055));
  context.fillStyle = terrain.color;
  context.fill(path);
  context.restore();

  context.strokeStyle = "rgb(10 27 21 / 35%)";
  context.lineWidth = 1;
  context.stroke(path);

  drawTerrainDetail(position, tile);
  if (available) drawMoveMarker(path, position);
  if (attackable) drawAttackMarker(path, position);

  if (hovered || selected) {
    context.strokeStyle = selected ? "#ffe3a1" : "rgb(255 255 255 / 65%)";
    context.lineWidth = selected ? Math.max(3, layout.tileWidth * 0.055) : 2;
    context.stroke(path);
  }

  if (
    selected &&
    !isSameTile(tile, scout) &&
    !isSameTile(tile, capital) &&
    !isSameTile(tile, enemyCity)
  ) {
    context.beginPath();
    context.arc(
      position.x,
      position.y + layout.tileHeight / 2,
      Math.max(3, layout.tileWidth * 0.045),
      0,
      Math.PI * 2,
    );
    context.fillStyle = "#fff4c7";
    context.fill();
  }
}

function drawCity(city) {
  const tile = findTile(mapTiles, city.x, city.y);
  const position = tilePosition(tile);
  const centerY = position.y + layout.tileHeight * 0.42;
  const size = Math.max(8, layout.tileWidth * 0.15);
  const towerCount = Math.min(city.level, 3);
  const enemyOwned = city.owner === "enemy";

  context.save();

  context.beginPath();
  context.ellipse(
    position.x,
    centerY + size * 0.78,
    size * 1.3,
    size * 0.46,
    0,
    0,
    Math.PI * 2,
  );
  context.fillStyle = "rgb(7 19 14 / 34%)";
  context.fill();

  if (isSameTile(selectedTile, city) && !isSameTile(scout, city)) {
    context.beginPath();
    context.arc(position.x, centerY, size + 7, 0, Math.PI * 2);
    context.strokeStyle = enemyOwned ? "#f5a08d" : "#fff0bd";
    context.lineWidth = 3;
    context.stroke();
  }

  context.fillStyle = enemyOwned ? "#a98f86" : "#d8cba3";
  context.fillRect(
    position.x - size,
    centerY - size * 0.16,
    size * 2,
    size * 0.85,
  );

  for (let index = 0; index < towerCount; index += 1) {
    const offset = (index - (towerCount - 1) / 2) * size * 0.72;
    context.fillStyle = enemyOwned ? "#c9b3aa" : "#eee2bd";
    context.fillRect(
      position.x + offset - size * 0.28,
      centerY - size * 0.62,
      size * 0.56,
      size * 1.05,
    );
    context.beginPath();
    context.moveTo(position.x + offset, centerY - size);
    context.lineTo(position.x + offset + size * 0.42, centerY - size * 0.55);
    context.lineTo(position.x + offset - size * 0.42, centerY - size * 0.55);
    context.closePath();
    context.fillStyle = enemyOwned ? "#673c3a" : "#79563a";
    context.fill();
  }

  context.beginPath();
  context.moveTo(position.x, centerY + size * 0.18);
  context.lineTo(position.x + size * 0.25, centerY + size * 0.68);
  context.lineTo(position.x - size * 0.25, centerY + size * 0.68);
  context.closePath();
  context.fillStyle = enemyOwned ? "#533130" : "#59412f";
  context.fill();

  context.strokeStyle = enemyOwned ? "#e6c0b7" : "#f7e9bd";
  context.lineWidth = Math.max(1.5, size * 0.1);
  context.strokeRect(
    position.x - size,
    centerY - size * 0.16,
    size * 2,
    size * 0.85,
  );
  context.restore();
}

function drawHealthBar(position, centerY, radius, unit, color) {
  const width = radius * 1.8;
  const height = Math.max(3, radius * 0.22);
  const x = position.x - width / 2;
  const y = centerY - radius - height - 4;

  context.fillStyle = "rgb(25 22 19 / 70%)";
  context.fillRect(x, y, width, height);
  context.fillStyle = color;
  context.fillRect(x, y, width * (unit.health / unit.maxHealth), height);
}

function drawScout() {
  const tile = scoutTile();
  const position = tilePosition(tile);
  const centerY = position.y + layout.tileHeight * 0.4;
  const radius = Math.max(9, layout.tileWidth * 0.17);

  context.save();
  context.globalAlpha = scout.hasMoved ? 0.65 : 1;

  context.beginPath();
  context.ellipse(
    position.x,
    centerY + radius * 0.72,
    radius * 0.95,
    radius * 0.42,
    0,
    0,
    Math.PI * 2,
  );
  context.fillStyle = "rgb(7 19 14 / 38%)";
  context.fill();

  if (unitSelected) {
    context.beginPath();
    context.arc(position.x, centerY, radius + 5, 0, Math.PI * 2);
    context.strokeStyle = "#fff0bd";
    context.lineWidth = 3;
    context.stroke();
  }

  const tokenGradient = context.createLinearGradient(
    position.x,
    centerY - radius,
    position.x,
    centerY + radius,
  );
  tokenGradient.addColorStop(0, "#e4b65d");
  tokenGradient.addColorStop(1, "#9a622c");

  context.beginPath();
  context.arc(position.x, centerY, radius, 0, Math.PI * 2);
  context.fillStyle = tokenGradient;
  context.fill();
  context.strokeStyle = "#ffe5a3";
  context.lineWidth = Math.max(2, radius * 0.13);
  context.stroke();

  context.beginPath();
  context.moveTo(position.x, centerY - radius * 0.52);
  context.lineTo(position.x + radius * 0.42, centerY + radius * 0.35);
  context.lineTo(position.x - radius * 0.42, centerY + radius * 0.35);
  context.closePath();
  context.fillStyle = "#fff4c7";
  context.fill();
  drawHealthBar(position, centerY, radius, scout, "#95c979");
  context.restore();
}

function drawEnemyGuard() {
  if (!enemyGuardAlive()) return;

  const tile = enemyCityTile();
  const position = tilePosition(tile);
  const centerY = position.y + layout.tileHeight * 0.4;
  const radius = Math.max(9, layout.tileWidth * 0.17);

  context.save();
  context.beginPath();
  context.ellipse(
    position.x,
    centerY + radius * 0.72,
    radius * 0.95,
    radius * 0.42,
    0,
    0,
    Math.PI * 2,
  );
  context.fillStyle = "rgb(7 19 14 / 42%)";
  context.fill();

  if (isSameTile(selectedTile, enemyGuard)) {
    context.beginPath();
    context.arc(position.x, centerY, radius + 5, 0, Math.PI * 2);
    context.strokeStyle = "#f5a08d";
    context.lineWidth = 3;
    context.stroke();
  }

  const gradient = context.createLinearGradient(
    position.x,
    centerY - radius,
    position.x,
    centerY + radius,
  );
  gradient.addColorStop(0, "#ca6a5b");
  gradient.addColorStop(1, "#73332f");

  context.beginPath();
  context.arc(position.x, centerY, radius, 0, Math.PI * 2);
  context.fillStyle = gradient;
  context.fill();
  context.strokeStyle = "#f3b0a1";
  context.lineWidth = Math.max(2, radius * 0.13);
  context.stroke();

  context.beginPath();
  context.moveTo(position.x, centerY - radius * 0.5);
  context.lineTo(position.x + radius * 0.48, centerY);
  context.lineTo(position.x, centerY + radius * 0.5);
  context.lineTo(position.x - radius * 0.48, centerY);
  context.closePath();
  context.fillStyle = "#ffe1d9";
  context.fill();
  drawHealthBar(position, centerY, radius, enemyGuard, "#df7765");
  context.restore();
}

function updateCanvasState() {
  canvas.dataset.turn = String(turn);
  canvas.dataset.unitX = String(scout.x);
  canvas.dataset.unitY = String(scout.y);
  canvas.dataset.unitMoved = String(scout.hasMoved);
  canvas.dataset.availableMoves = availableMoves.map(tileKey).join(",");
  canvas.dataset.attackTargets = attackTargets.map(tileKey).join(",");
  canvas.dataset.cityX = String(capital.x);
  canvas.dataset.cityY = String(capital.y);
  canvas.dataset.cityLevel = String(capital.level);
  canvas.dataset.cityIncome = String(capital.income);
  canvas.dataset.coins = String(coins);
  canvas.dataset.upgradeCost = String(getUpgradeCost(capital));
  canvas.dataset.enemyCityX = String(enemyCity.x);
  canvas.dataset.enemyCityY = String(enemyCity.y);
  canvas.dataset.enemyCityOwner = enemyCity.owner;
  canvas.dataset.playerHealth = String(scout.health);
  canvas.dataset.enemyHealth = String(enemyGuard.health);
  canvas.dataset.enemyAlive = String(enemyGuardAlive());
  canvas.dataset.result = gameResult ?? "playing";
  canvas.dataset.passableTiles = mapTiles
    .filter((tile) => tile.terrain !== "water")
    .map(tileKey)
    .join(",");
}

function updateEconomyDisplay() {
  coinCount.textContent = String(coins);
}

function render() {
  if (!layout) return;
  context.clearRect(0, 0, layout.width, layout.height);

  const glow = context.createRadialGradient(
    layout.width * 0.5,
    layout.height * 0.45,
    0,
    layout.width * 0.5,
    layout.height * 0.45,
    layout.width * 0.62,
  );
  glow.addColorStop(0, "rgb(116 167 154 / 16%)");
  glow.addColorStop(1, "rgb(10 32 39 / 0%)");
  context.fillStyle = glow;
  context.fillRect(0, 0, layout.width, layout.height);

  mapTiles.forEach(drawTile);
  drawCity(capital);
  drawCity(enemyCity);
  drawScout();
  drawEnemyGuard();
  updateCanvasState();
}

function resizeCanvas() {
  const bounds = mapFrame.getBoundingClientRect();
  const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(bounds.width);
  const height = Math.round(bounds.height);

  canvas.width = Math.round(width * deviceScale);
  canvas.height = Math.round(height * deviceScale);
  context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
  layout = calculateLayout(width, height);
  render();
}

function tileAtPoint(pointX, pointY) {
  for (let index = mapTiles.length - 1; index >= 0; index -= 1) {
    const tile = mapTiles[index];
    const position = tilePosition(tile);
    const centerY = position.y + layout.tileHeight / 2;
    const distance =
      Math.abs(pointX - position.x) / (layout.tileWidth / 2) +
      Math.abs(pointY - centerY) / (layout.tileHeight / 2);

    if (distance <= 1) return tile;
  }

  return null;
}

function eventPoint(event) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}

function hideInformationPanels() {
  emptySelection.hidden = true;
  selectionDetails.hidden = true;
  unitDetails.hidden = true;
  cityDetails.hidden = true;
  enemyDetails.hidden = true;
  resultDetails.hidden = true;
}

function showEmptyState() {
  hideInformationPanels();
  emptySelection.hidden = false;
  mapInstruction.textContent = "DOTRZYJ DO WROGIEGO MIASTA";
  canvas.setAttribute(
    "aria-label",
    `Tura ${turn}. Zwiadowca ma ${scout.health} z ${scout.maxHealth} punktów życia. Wrogie miasto jest na polu ${enemyCity.x + 1}, ${enemyCity.y + 1}.`,
  );
}

function showTerrainSelection(tile) {
  const terrain = TERRAIN[tile.terrain];

  hideInformationPanels();
  selectionDetails.hidden = false;
  terrainName.textContent = terrain.name;
  terrainSwatch.style.backgroundColor = terrain.color;
  tileCoordinates.textContent = `Pole ${tile.x + 1}, ${tile.y + 1}`;
  mapInstruction.textContent = "WYBRANE POLE";
  canvas.setAttribute(
    "aria-label",
    `Wybrane pole ${tile.x + 1}, ${tile.y + 1}: ${terrain.name}.`,
  );
}

function showUnitSelection() {
  hideInformationPanels();
  unitDetails.hidden = false;
  unitPosition.textContent = `Pole ${scout.x + 1}, ${scout.y + 1}`;
  unitHealth.textContent = `Życie ${scout.health}/${scout.maxHealth}`;
  unitStatus.classList.toggle("moved", scout.hasMoved);

  if (scout.hasMoved) {
    unitStatus.textContent = "Ruch wykorzystany. Zakończ turę, aby jednostka mogła ruszyć ponownie.";
    mapInstruction.textContent = "ZAKOŃCZ TURĘ";
    canvas.setAttribute(
      "aria-label",
      `Zwiadowca na polu ${scout.x + 1}, ${scout.y + 1}. Ruch w turze ${turn} został wykorzystany.`,
    );
    return;
  }

  const moveList = availableMoves
    .map((tile) => `${tile.x + 1}, ${tile.y + 1}`)
    .join("; ");
  const moveCount = availableMoves.length;
  const attackCount = attackTargets.length;
  unitStatus.textContent = attackCount
    ? `Gotowy. Pola ruchu: ${moveCount}. Cele ataku: ${attackCount}.`
    : moveCount
      ? `Gotowy do ruchu. Dostępne pola: ${moveCount}.`
      : "Brak dostępnych pól ruchu.";
  mapInstruction.textContent = attackCount
    ? "WYBIERZ RUCH LUB CEL ATAKU"
    : moveCount
      ? "WYBIERZ PODŚWIETLONE POLE"
      : "BRAK DOSTĘPNEGO RUCHU";
  canvas.setAttribute(
    "aria-label",
    `Zwiadowca na polu ${scout.x + 1}, ${scout.y + 1}, życie ${scout.health} z ${scout.maxHealth}. Dostępne pola: ${moveList || "brak"}. Cele ataku: ${attackCount}.`,
  );
}

function showCitySelection(city) {
  const cost = getUpgradeCost(city);
  const isPlayerCapital = city === capital && city.owner === "player";

  hideInformationPanels();
  cityDetails.hidden = false;
  cityName.textContent = city.name;
  cityLevel.textContent = `Poziom ${city.level}`;
  cityOwner.textContent = city.owner === "enemy" ? "Wrogie miasto" : "Twoje miasto";
  cityIncome.textContent = `Dochód: +${city.income} monety na turę`;
  upgradeCityButton.textContent = `Rozwiń miasto — ${cost} monet`;
  upgradeCityButton.hidden = !isPlayerCapital;
  upgradeCityButton.disabled = !isPlayerCapital || !canUpgradeCity(city, coins);
  mapInstruction.textContent = city.owner === "enemy" ? "WROGIE MIASTO" : "MIASTO";
  canvas.setAttribute(
    "aria-label",
    `${city.name}, poziom ${city.level}, pole ${city.x + 1}, ${city.y + 1}. Właściciel: ${city.owner === "enemy" ? "przeciwnik" : "gracz"}.`,
  );
}

function showEnemySelection() {
  hideInformationPanels();
  enemyDetails.hidden = false;
  enemyPosition.textContent = `Pole ${enemyGuard.x + 1}, ${enemyGuard.y + 1}`;
  enemyHealth.textContent = `Życie ${enemyGuard.health}/${enemyGuard.maxHealth}`;
  mapInstruction.textContent = isAdjacent(scout, enemyGuard)
    ? "WYBIERZ ZWIADOWCĘ I ZAATAKUJ"
    : "PODEJDŹ DO STRAŻNIKA";
  canvas.setAttribute(
    "aria-label",
    `Strażnik na polu ${enemyGuard.x + 1}, ${enemyGuard.y + 1}. Życie ${enemyGuard.health} z ${enemyGuard.maxHealth}.`,
  );
}

function showResult(result) {
  hideInformationPanels();
  resultDetails.hidden = false;
  resultDetails.classList.toggle("defeat", result === "defeat");
  resultIcon.textContent = result === "victory" ? "★" : "×";
  resultTitle.textContent = result === "victory" ? "Zwycięstwo" : "Porażka";
  resultMessage.textContent =
    result === "victory"
      ? "Kamienna Strażnica należy do Ciebie."
      : "Zwiadowca poległ podczas oblężenia.";
  mapInstruction.textContent = result === "victory" ? "MIASTO ZDOBYTE" : "KONIEC WYPRAWY";
}

function selectScout() {
  if (gameResult) return;
  selectedTile = scoutTile();
  unitSelected = true;
  const blockedUnits = enemyGuardAlive() ? [enemyGuard] : [];
  availableMoves = getAvailableMoves(scout, mapTiles, blockedUnits);
  availableMoveKeys = new Set(availableMoves.map(tileKey));
  attackTargets = getAttackTargets(
    scout,
    enemyGuardAlive() ? [enemyGuard] : [],
  );
  attackTargetKeys = new Set(attackTargets.map(tileKey));
  showUnitSelection();
}

function executeMove(destination) {
  scout = moveUnit(scout, destination);
  selectedTile = destination;
  availableMoves = [];
  availableMoveKeys = new Set();
  attackTargets = [];
  attackTargetKeys = new Set();

  if (isSameTile(destination, enemyCity) && !enemyGuardAlive()) {
    enemyCity = captureCity(enemyCity);
    gameResult = "victory";
    endTurnButton.disabled = true;
    showResult(gameResult);
  } else {
    showUnitSelection();
  }
}

function executeAttack() {
  const result = attackUnit(scout, enemyGuard);
  scout = result.attacker;
  enemyGuard = result.defender;
  selectedTile = enemyGuardAlive() ? enemyCityTile() : scoutTile();
  availableMoves = [];
  availableMoveKeys = new Set();
  attackTargets = [];
  attackTargetKeys = new Set();
  showUnitSelection();
}

function resetGame() {
  mapTiles = generateMap(Date.now());
  capital = createCapital(mapTiles);
  enemyCity = createEnemyCity(mapTiles, capital);
  scout = createScout(mapTiles, capital, [enemyCity]);
  enemyGuard = createGuard(enemyCity);
  turn = 1;
  coins = STARTING_COINS;
  gameResult = null;
  selectedTile = null;
  hoveredTile = null;
  unitSelected = false;
  availableMoves = [];
  availableMoveKeys = new Set();
  attackTargets = [];
  attackTargetKeys = new Set();
  endTurnButton.disabled = false;
  turnNumber.textContent = String(turn);
  updateEconomyDisplay();
  showEmptyState();
  render();
}

canvas.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  const point = eventPoint(event);
  const nextHoveredTile = tileAtPoint(point.x, point.y);

  if (tileKey(nextHoveredTile) !== tileKey(hoveredTile)) {
    hoveredTile = nextHoveredTile;
    canvas.style.cursor = hoveredTile ? "pointer" : "crosshair";
    render();
  }
});

canvas.addEventListener("pointerleave", () => {
  hoveredTile = null;
  canvas.style.cursor = "crosshair";
  render();
});

canvas.addEventListener("pointerup", (event) => {
  const point = eventPoint(event);
  const tile = tileAtPoint(point.x, point.y);
  if (!tile) return;
  if (gameResult) return;

  if (isSameTile(tile, scout)) {
    selectScout();
  } else if (unitSelected && attackTargetKeys.has(tileKey(tile))) {
    executeAttack();
  } else if (unitSelected && availableMoveKeys.has(tileKey(tile))) {
    executeMove(tile);
  } else if (enemyGuardAlive() && isSameTile(tile, enemyGuard)) {
    unitSelected = false;
    availableMoves = [];
    availableMoveKeys = new Set();
    attackTargets = [];
    attackTargetKeys = new Set();
    selectedTile = enemyCityTile();
    showEnemySelection();
  } else if (isSameTile(tile, capital)) {
    unitSelected = false;
    availableMoves = [];
    availableMoveKeys = new Set();
    attackTargets = [];
    attackTargetKeys = new Set();
    selectedTile = capitalTile();
    showCitySelection(capital);
  } else if (isSameTile(tile, enemyCity)) {
    unitSelected = false;
    availableMoves = [];
    availableMoveKeys = new Set();
    attackTargets = [];
    attackTargetKeys = new Set();
    selectedTile = enemyCityTile();
    showCitySelection(enemyCity);
  } else {
    unitSelected = false;
    availableMoves = [];
    availableMoveKeys = new Set();
    attackTargets = [];
    attackTargetKeys = new Set();
    selectedTile = tile;
    showTerrainSelection(tile);
  }

  render();
});

endTurnButton.addEventListener("click", () => {
  if (gameResult) return;

  scout = enemyStrike(enemyGuard, scout);
  if (scout.health <= 0) {
    gameResult = "defeat";
    unitSelected = false;
    availableMoves = [];
    availableMoveKeys = new Set();
    attackTargets = [];
    attackTargetKeys = new Set();
    endTurnButton.disabled = true;
    showResult(gameResult);
    render();
    return;
  }

  turn += 1;
  coins += totalIncome();
  scout = { ...scout, hasMoved: false };
  selectedTile = null;
  hoveredTile = null;
  unitSelected = false;
  availableMoves = [];
  availableMoveKeys = new Set();
  attackTargets = [];
  attackTargetKeys = new Set();
  turnNumber.textContent = String(turn);
  updateEconomyDisplay();
  showEmptyState();
  render();
});

newMapButton.addEventListener("click", resetGame);

upgradeCityButton.addEventListener("click", () => {
  const result = upgradeCity(capital, coins);
  capital = result.city;
  coins = result.coins;
  updateEconomyDisplay();
  showCitySelection(capital);
  render();
});

restartGameButton.addEventListener("click", resetGame);

updateEconomyDisplay();
showEmptyState();
const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(mapFrame);
