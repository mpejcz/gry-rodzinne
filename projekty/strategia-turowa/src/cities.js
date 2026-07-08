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

function reachableLand(tiles, origin) {
  const visited = new Set([`${origin.x}:${origin.y}`]);
  const queue = [origin];

  while (queue.length) {
    const current = queue.shift();
    for (const candidate of tiles) {
      const key = `${candidate.x}:${candidate.y}`;
      const adjacent =
        Math.abs(candidate.x - current.x) + Math.abs(candidate.y - current.y) === 1;
      if (candidate.terrain !== "water" && adjacent && !visited.has(key)) {
        visited.add(key);
        queue.push(candidate);
      }
    }
  }

  return tiles.filter((tile) => visited.has(`${tile.x}:${tile.y}`));
}

export function createCapital(tiles) {
  const eligibleTiles = tiles.filter(
    (tile) => tile.terrain !== "water" && hasLandNeighbor(tile, tiles),
  );
  const spaciousTiles = eligibleTiles.filter(
    (tile) => reachableLand(tiles, tile).length >= 8,
  );
  const candidates = spaciousTiles.length ? spaciousTiles : eligibleTiles;
  const plains = candidates.filter((tile) => tile.terrain === "plains");
  const startTile = (plains.length ? plains : candidates).sort(
    (first, second) => distanceFromMapCenter(first) - distanceFromMapCenter(second),
  )[0];

  if (!startTile) {
    throw new Error("Nie znaleziono pola dla stolicy.");
  }

  return {
    name: "Zielony Gród",
    owner: "player",
    x: startTile.x,
    y: startTile.y,
    level: 1,
    income: 2,
  };
}

export function createEnemyCity(tiles, capital) {
  const connectedTiles = reachableLand(tiles, capital).filter(
    (tile) =>
      (tile.x !== capital.x || tile.y !== capital.y) &&
      hasLandNeighbor(tile, tiles),
  );
  const distantTiles = connectedTiles.filter(
    (tile) =>
      Math.abs(tile.x - capital.x) + Math.abs(tile.y - capital.y) >= 4,
  );
  const candidates = distantTiles.length ? distantTiles : connectedTiles;
  const cityTile = candidates.sort(
    (first, second) =>
      Math.abs(second.x - capital.x) + Math.abs(second.y - capital.y) -
      (Math.abs(first.x - capital.x) + Math.abs(first.y - capital.y)),
  )[0];

  if (!cityTile) {
    throw new Error("Nie znaleziono pola dla wrogiego miasta.");
  }

  return {
    name: "Kamienna Strażnica",
    owner: "enemy",
    x: cityTile.x,
    y: cityTile.y,
    level: 1,
    income: 1,
  };
}

export function captureCity(city) {
  return { ...city, owner: "player" };
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
