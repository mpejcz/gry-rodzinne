import {
  generateMap,
  MAP_COLUMNS,
  MAP_ROWS,
  TERRAIN,
} from "./map.js";

const canvas = document.querySelector("#game-map");
const context = canvas.getContext("2d");
const mapFrame = document.querySelector(".map-frame");
const newMapButton = document.querySelector("#new-map");
const emptySelection = document.querySelector("#selection-empty");
const selectionDetails = document.querySelector("#selection-details");
const terrainName = document.querySelector("#terrain-name");
const terrainSwatch = document.querySelector("#terrain-swatch");
const tileCoordinates = document.querySelector("#tile-coordinates");

let mapTiles = generateMap();
let selectedTile = null;
let hoveredTile = null;
let layout = null;

function tileKey(tile) {
  return `${tile.x}:${tile.y}`;
}

function isSameTile(first, second) {
  return first && second && first.x === second.x && first.y === second.y;
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

function drawTile(tile) {
  const position = tilePosition(tile);
  const path = diamondPath(position);
  const terrain = TERRAIN[tile.terrain];
  const selected = isSameTile(tile, selectedTile);
  const hovered = isSameTile(tile, hoveredTile);

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

  if (hovered || selected) {
    context.strokeStyle = selected ? "#ffe3a1" : "rgb(255 255 255 / 65%)";
    context.lineWidth = selected ? Math.max(3, layout.tileWidth * 0.055) : 2;
    context.stroke(path);
  }

  if (selected) {
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

function showSelection(tile) {
  const terrain = TERRAIN[tile.terrain];

  emptySelection.hidden = true;
  selectionDetails.hidden = false;
  terrainName.textContent = terrain.name;
  terrainSwatch.style.backgroundColor = terrain.color;
  tileCoordinates.textContent = `Pole ${tile.x + 1}, ${tile.y + 1}`;
  canvas.setAttribute(
    "aria-label",
    `Wybrane pole ${tile.x + 1}, ${tile.y + 1}: ${terrain.name}.`,
  );
}

canvas.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") return;
  const point = eventPoint(event);
  const nextHoveredTile = tileAtPoint(point.x, point.y);

  if (tileKey(nextHoveredTile ?? {}) !== tileKey(hoveredTile ?? {})) {
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

  selectedTile = tile;
  showSelection(tile);
  render();
});

newMapButton.addEventListener("click", () => {
  mapTiles = generateMap(Date.now());
  selectedTile = null;
  hoveredTile = null;
  emptySelection.hidden = false;
  selectionDetails.hidden = true;
  canvas.setAttribute(
    "aria-label",
    "Izometryczna mapa. Kliknij lub dotknij pola, aby je wybrać.",
  );
  render();
});

const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(mapFrame);
