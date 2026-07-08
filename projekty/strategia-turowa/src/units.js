import { MAP_COLUMNS, MAP_ROWS } from "./map.js";

export const SCOUT = Object.freeze({
  name: "Zwiadowca",
  blockedTerrain: ["water"],
});

function distanceFromMapCenter(tile) {
  const centerX = (MAP_COLUMNS - 1) / 2;
  const centerY = (MAP_ROWS - 1) / 2;
  return Math.abs(tile.x - centerX) + Math.abs(tile.y - centerY);
}

function distanceFromTile(tile, origin) {
  return Math.abs(tile.x - origin.x) + Math.abs(tile.y - origin.y);
}

function hasPassableNeighbor(tile, tiles) {
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  return directions.some((direction) => {
    const neighbor = findTile(tiles, tile.x + direction.x, tile.y + direction.y);
    return neighbor && !SCOUT.blockedTerrain.includes(neighbor.terrain);
  });
}

export function findTile(tiles, x, y) {
  return tiles.find((tile) => tile.x === x && tile.y === y) ?? null;
}

export function createScout(tiles, capital = null) {
  const candidates = tiles
    .filter(
      (tile) =>
        !SCOUT.blockedTerrain.includes(tile.terrain) &&
        (!capital || tile.x !== capital.x || tile.y !== capital.y) &&
        hasPassableNeighbor(tile, tiles),
    );
  const startTile = candidates.sort((first, second) => {
    if (capital) return distanceFromTile(first, capital) - distanceFromTile(second, capital);
    return distanceFromMapCenter(first) - distanceFromMapCenter(second);
  })[0];

  if (!startTile) {
    throw new Error("Nie znaleziono pola startowego dla zwiadowcy.");
  }

  return {
    type: "scout",
    x: startTile.x,
    y: startTile.y,
    hasMoved: false,
  };
}

export function getAvailableMoves(unit, tiles) {
  if (unit.hasMoved) return [];

  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  return directions
    .map((direction) => findTile(tiles, unit.x + direction.x, unit.y + direction.y))
    .filter(
      (tile) => tile && !SCOUT.blockedTerrain.includes(tile.terrain),
    );
}

export function moveUnit(unit, destination) {
  return {
    ...unit,
    x: destination.x,
    y: destination.y,
    hasMoved: true,
  };
}
