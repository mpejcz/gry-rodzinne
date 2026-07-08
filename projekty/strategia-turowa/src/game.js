import {
  generateMap,
  MAP_COLUMNS,
  MAP_ROWS,
  TERRAIN,
} from "./map.js";
import {
  createScout,
  findTile,
  getAvailableMoves,
  moveUnit,
} from "./units.js";

const canvas = document.querySelector("#game-map");
const context = canvas.getContext("2d");
const mapFrame = document.querySelector(".map-frame");
const newMapButton = document.querySelector("#new-map");
const endTurnButton = document.querySelector("#end-turn");
const turnNumber = document.querySelector("#turn-number");
const mapInstruction = document.querySelector("#map-instruction");
const emptySelection = document.querySelector("#selection-empty");
const selectionDetails = document.querySelector("#selection-details");
const unitDetails = document.querySelector("#unit-details");
const unitPosition = document.querySelector("#unit-position");
const unitStatus = document.querySelector("#unit-status");
const terrainName = document.querySelector("#terrain-name");
const terrainSwatch = document.querySelector("#terrain-swatch");
const tileCoordinates = document.querySelector("#tile-coordinates");

let mapTiles = generateMap();
let scout = createScout(mapTiles);
let turn = 1;
let selectedTile = null;
let hoveredTile = null;
let unitSelected = false;
let availableMoves = [];
let availableMoveKeys = new Set();
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

function drawTile(tile) {
  const position = tilePosition(tile);
  const path = diamondPath(position);
  const terrain = TERRAIN[tile.terrain];
  const selected = isSameTile(tile, selectedTile);
  const hovered = isSameTile(tile, hoveredTile);
  const available = availableMoveKeys.has(tileKey(tile));

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

  if (hovered || selected) {
    context.strokeStyle = selected ? "#ffe3a1" : "rgb(255 255 255 / 65%)";
    context.lineWidth = selected ? Math.max(3, layout.tileWidth * 0.055) : 2;
    context.stroke(path);
  }

  if (selected && !isSameTile(tile, scout)) {
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
  context.restore();
}

function updateCanvasState() {
  canvas.dataset.turn = String(turn);
  canvas.dataset.unitX = String(scout.x);
  canvas.dataset.unitY = String(scout.y);
  canvas.dataset.unitMoved = String(scout.hasMoved);
  canvas.dataset.availableMoves = availableMoves.map(tileKey).join(",");
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
  drawScout();
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
}

function showEmptyState() {
  hideInformationPanels();
  emptySelection.hidden = false;
  mapInstruction.textContent = "WYBIERZ ZWIADOWCĘ";
  canvas.setAttribute(
    "aria-label",
    `Tura ${turn}. Zwiadowca czeka na polu ${scout.x + 1}, ${scout.y + 1}.`,
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
  unitStatus.textContent = moveCount
    ? `Gotowy do ruchu. Dostępne pola: ${moveCount}.`
    : "Brak dostępnych pól ruchu.";
  mapInstruction.textContent = moveCount
    ? "WYBIERZ PODŚWIETLONE POLE"
    : "BRAK DOSTĘPNEGO RUCHU";
  canvas.setAttribute(
    "aria-label",
    `Zwiadowca na polu ${scout.x + 1}, ${scout.y + 1}. Dostępne pola: ${moveList || "brak"}.`,
  );
}

function selectScout() {
  selectedTile = scoutTile();
  unitSelected = true;
  availableMoves = getAvailableMoves(scout, mapTiles);
  availableMoveKeys = new Set(availableMoves.map(tileKey));
  showUnitSelection();
}

function executeMove(destination) {
  scout = moveUnit(scout, destination);
  selectedTile = destination;
  availableMoves = [];
  availableMoveKeys = new Set();
  showUnitSelection();
}

function resetGame() {
  mapTiles = generateMap(Date.now());
  scout = createScout(mapTiles);
  turn = 1;
  selectedTile = null;
  hoveredTile = null;
  unitSelected = false;
  availableMoves = [];
  availableMoveKeys = new Set();
  turnNumber.textContent = String(turn);
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

  if (isSameTile(tile, scout)) {
    selectScout();
  } else if (unitSelected && availableMoveKeys.has(tileKey(tile))) {
    executeMove(tile);
  } else {
    unitSelected = false;
    availableMoves = [];
    availableMoveKeys = new Set();
    selectedTile = tile;
    showTerrainSelection(tile);
  }

  render();
});

endTurnButton.addEventListener("click", () => {
  turn += 1;
  scout = { ...scout, hasMoved: false };
  selectedTile = null;
  hoveredTile = null;
  unitSelected = false;
  availableMoves = [];
  availableMoveKeys = new Set();
  turnNumber.textContent = String(turn);
  showEmptyState();
  render();
});

newMapButton.addEventListener("click", resetGame);

showEmptyState();
const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(mapFrame);
