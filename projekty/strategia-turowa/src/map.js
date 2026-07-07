export const MAP_COLUMNS = 10;
export const MAP_ROWS = 10;

export const TERRAIN = Object.freeze({
  water: {
    name: "Woda",
    color: "#327c9d",
    edge: "#225b75",
  },
  plains: {
    name: "Równina",
    color: "#70a85c",
    edge: "#4d7d42",
  },
  forest: {
    name: "Las",
    color: "#3f7d4d",
    edge: "#285a39",
  },
  mountain: {
    name: "Góry",
    color: "#8b9084",
    edge: "#656a60",
  },
});

function mulberry32(seed) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function terrainAt(x, y, random, heightMap) {
  const edgeDistance = Math.min(
    x,
    y,
    MAP_COLUMNS - 1 - x,
    MAP_ROWS - 1 - y,
  );
  const neighbors = [
    heightMap[y]?.[x - 1],
    heightMap[y - 1]?.[x],
    heightMap[y - 1]?.[x - 1],
  ].filter(Number.isFinite);
  const neighborAverage = neighbors.length
    ? neighbors.reduce((sum, value) => sum + value, 0) / neighbors.length
    : 0.5;
  const edgePenalty = edgeDistance === 0 ? 0.24 : edgeDistance === 1 ? 0.08 : 0;
  const elevation = random() * 0.62 + neighborAverage * 0.38 - edgePenalty;

  heightMap[y][x] = elevation;

  if (elevation < 0.34) return "water";
  if (elevation > 0.76) return "mountain";
  if (elevation > 0.57 && random() > 0.32) return "forest";
  return "plains";
}

export function generateMap(seed = Date.now()) {
  const random = mulberry32(seed);
  const heightMap = Array.from({ length: MAP_ROWS }, () => []);
  const tiles = [];

  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLUMNS; x += 1) {
      tiles.push({
        x,
        y,
        terrain: terrainAt(x, y, random, heightMap),
        detail: random(),
      });
    }
  }

  return tiles;
}
