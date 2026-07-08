import { MAP_COLUMNS, MAP_ROWS } from "./map.js";

export const STARTING_COINS = 3;

function distanceFromMapCenter(tile) {
  const centerX = (MAP_COLUMNS - 1) / 2;
  const centerY = (MAP_ROWS - 1) / 2;
  return Math.abs(tile.x - centerX) + Math.abs(tile.y - centerY);
}

function hasLandNeighbor(tile, tiles) {
  return tiles.some(
    (candidate) =>
      candidate.terrain !== "water" &&
      Math.abs(candidate.x - tile.x) + Math.abs(candidate.y - tile.y) === 1,
  );
}

export function createCapital(tiles) {
  const eligibleTiles = tiles.filter(
    (tile) => tile.terrain !== "water" && hasLandNeighbor(tile, tiles),
  );
  const plains = eligibleTiles.filter((tile) => tile.terrain === "plains");
  const startTile = (plains.length ? plains : eligibleTiles).sort(
    (first, second) => distanceFromMapCenter(first) - distanceFromMapCenter(second),
  )[0];

  if (!startTile) {
    throw new Error("Nie znaleziono pola dla stolicy.");
  }

  return {
    name: "Zielony Gród",
    x: startTile.x,
    y: startTile.y,
    level: 1,
    income: 2,
  };
}

export function getUpgradeCost(city) {
  return 5 + (city.level - 1) * 3;
}

export function canUpgradeCity(city, coins) {
  return coins >= getUpgradeCost(city);
}

export function upgradeCity(city, coins) {
  const cost = getUpgradeCost(city);
  if (coins < cost) return { city, coins };

  return {
    city: {
      ...city,
      level: city.level + 1,
      income: city.income + 1,
    },
    coins: coins - cost,
  };
}
