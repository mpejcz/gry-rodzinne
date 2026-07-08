import { MAP_COLUMNS, MAP_ROWS } from "./map.js";

export const SCOUT = Object.freeze({
  name: "Zwiadowca",
  blockedTerrain: ["water"],
  maxHealth: 3,
  attack: 2,
});

export const GUARD = Object.freeze({
  name: "Strażnik",
  maxHealth: 3,
  attack: 1,
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

export function createScout(tiles, capital = null, blockedTiles = []) {
  const candidates = tiles
    .filter(
      (tile) =>
        !SCOUT.blockedTerrain.includes(tile.terrain) &&
        (!capital || tile.x !== capital.x || tile.y !== capital.y) &&
        !blockedTiles.some((blocked) => blocked.x === tile.x && blocked.y === tile.y) &&
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
    health: SCOUT.maxHealth,
    maxHealth: SCOUT.maxHealth,
    attack: SCOUT.attack,
  };
}

export function createGuard(city) {
  return {
    type: "guard",
    x: city.x,
    y: city.y,
    health: GUARD.maxHealth,
    maxHealth: GUARD.maxHealth,
    attack: GUARD.attack,
  };
}

export function getAvailableMoves(unit, tiles, blockedUnits = []) {
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
      (tile) =>
        tile &&
        !SCOUT.blockedTerrain.includes(tile.terrain) &&
        !blockedUnits.some((blocked) => blocked.x === tile.x && blocked.y === tile.y),
    );
}

export function isAdjacent(first, second) {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y) === 1;
}

export function getAttackTargets(unit, enemies) {
  if (unit.hasMoved) return [];
  return enemies.filter((enemy) => enemy.health > 0 && isAdjacent(unit, enemy));
}

export function attackUnit(attacker, defender) {
  return {
    attacker: { ...attacker, hasMoved: true },
    defender: {
      ...defender,
      health: Math.max(0, defender.health - attacker.attack),
    },
  };
}

export function enemyStrike(enemy, player) {
  if (enemy.health <= 0 || !isAdjacent(enemy, player)) return player;
  return {
    ...player,
    health: Math.max(0, player.health - enemy.attack),
  };
}

export function moveUnit(unit, destination) {
  return {
    ...unit,
    x: destination.x,
    y: destination.y,
    hasMoved: true,
  };
}
