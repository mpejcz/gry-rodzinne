export const SAVE_KEY = "kraina-tur-save-v1";
export const SAVE_VERSION = 1;

function isPositionedObject(value) {
  return (
    value &&
    typeof value === "object" &&
    Number.isInteger(value.x) &&
    Number.isInteger(value.y)
  );
}

function isValidState(state) {
  const validResult =
    state?.gameResult === null ||
    state?.gameResult === "victory" ||
    state?.gameResult === "defeat";

  return (
    state &&
    Array.isArray(state.mapTiles) &&
    state.mapTiles.length === 100 &&
    state.mapTiles.every(
      (tile) =>
        isPositionedObject(tile) &&
        typeof tile.terrain === "string" &&
        typeof tile.detail === "number",
    ) &&
    isPositionedObject(state.capital) &&
    isPositionedObject(state.enemyCity) &&
    isPositionedObject(state.scout) &&
    isPositionedObject(state.enemyGuard) &&
    Number.isInteger(state.turn) &&
    state.turn > 0 &&
    Number.isInteger(state.coins) &&
    state.coins >= 0 &&
    validResult
  );
}

export function serializeGameState(state, savedAt = Date.now()) {
  if (!isValidState(state)) {
    throw new Error("Nieprawidłowy stan gry.");
  }

  return JSON.stringify({
    version: SAVE_VERSION,
    savedAt,
    state,
  });
}

export function parseGameState(rawSave) {
  if (!rawSave) return null;

  try {
    const payload = JSON.parse(rawSave);
    if (
      payload?.version !== SAVE_VERSION ||
      !Number.isFinite(payload.savedAt) ||
      !isValidState(payload.state)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function saveGameState(state, storage = globalThis.localStorage) {
  const serialized = serializeGameState(state);
  storage.setItem(SAVE_KEY, serialized);
  return parseGameState(serialized);
}

export function loadGameState(storage = globalThis.localStorage) {
  return parseGameState(storage.getItem(SAVE_KEY));
}

export function hasSavedGame(storage = globalThis.localStorage) {
  return Boolean(loadGameState(storage));
}
