"use strict";

const GAME_LENGTH_SECONDS = 20;
const DODGES_BEFORE_EXHAUSTION = 2;
const EXHAUSTION_MS = 1200;
const FLEE_COOLDOWN_MS = 180;
const MOUSE_DETECTION_DISTANCE = 125;
const TOUCH_DETECTION_DISTANCE = 105;
const TARGET_COLORS = ["#ff5c7a", "#58d6ff", "#8de969", "#c98cff", "#ff9f43"];

const arena = document.querySelector("#arena");
const target = document.querySelector("#target");
const overlay = document.querySelector("#overlay");
const overlayTitle = document.querySelector("#overlayTitle");
const overlayText = document.querySelector("#overlayText");
const startButton = document.querySelector("#startButton");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const bestScoreElement = document.querySelector("#bestScore");
const gameStatus = document.querySelector("#gameStatus");
const shareButton = document.querySelector("#shareButton");
const shareStatus = document.querySelector("#shareStatus");

const state = {
  running: false,
  score: 0,
  bestScore: readBestScore(),
  timeLeft: GAME_LENGTH_SECONDS,
  startedAt: 0,
  timerId: null,
  dodgesLeft: DODGES_BEFORE_EXHAUSTION,
  exhaustedUntil: 0,
  lastFleeAt: 0,
  exhaustionId: null,
};

function readBestScore() {
  try {
    const storedScore = Number.parseInt(localStorage.getItem("uciekajaca-kropka-best"), 10);
    return Number.isFinite(storedScore) ? storedScore : 0;
  } catch {
    return 0;
  }
}

function saveBestScore() {
  try {
    localStorage.setItem("uciekajaca-kropka-best", String(state.bestScore));
  } catch {
    // Gra działa również wtedy, gdy przeglądarka blokuje pamięć lokalną.
  }
}

function renderStats() {
  scoreElement.textContent = String(state.score);
  timeElement.textContent = String(state.timeLeft);
  bestScoreElement.textContent = String(state.bestScore);
}

function getPositionLimits() {
  const arenaRect = arena.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const padding = 12;

  return {
    arenaRect,
    targetWidth: targetRect.width,
    targetHeight: targetRect.height,
    minX: padding,
    minY: padding,
    maxX: Math.max(padding, arenaRect.width - targetRect.width - padding),
    maxY: Math.max(padding, arenaRect.height - targetRect.height - padding),
  };
}

function setTargetPosition(x, y) {
  target.style.left = `${Math.round(x)}px`;
  target.style.top = `${Math.round(y)}px`;
}

function moveTargetRandomly() {
  const limits = getPositionLimits();
  const x = limits.minX + Math.random() * (limits.maxX - limits.minX);
  const y = limits.minY + Math.random() * (limits.maxY - limits.minY);
  setTargetPosition(x, y);
}

function moveTargetAwayFrom(clientX, clientY) {
  const limits = getPositionLimits();
  const pointerX = clientX - limits.arenaRect.left;
  const pointerY = clientY - limits.arenaRect.top;
  const candidates = [];

  for (let index = 0; index < 18; index += 1) {
    candidates.push({
      x: limits.minX + Math.random() * (limits.maxX - limits.minX),
      y: limits.minY + Math.random() * (limits.maxY - limits.minY),
    });
  }

  const bestPosition = candidates.reduce((best, candidate) => {
    const centerX = candidate.x + limits.targetWidth / 2;
    const centerY = candidate.y + limits.targetHeight / 2;
    const distance = Math.hypot(centerX - pointerX, centerY - pointerY);
    return distance > best.distance ? { ...candidate, distance } : best;
  }, { x: limits.minX, y: limits.minY, distance: -1 });

  setTargetPosition(bestPosition.x, bestPosition.y);
}

function setTargetColor() {
  target.style.setProperty("--target-color", TARGET_COLORS[state.score % TARGET_COLORS.length]);
}

function setExhausted() {
  window.clearTimeout(state.exhaustionId);
  state.exhaustedUntil = performance.now() + EXHAUSTION_MS;
  target.classList.add("exhausted");
  target.setAttribute("aria-label", "Kropka jest zmęczona — złap ją teraz");
  gameStatus.textContent = "Kropka zmęczona — łap!";

  state.exhaustionId = window.setTimeout(() => {
    if (!state.running) {
      return;
    }
    resetDodges();
    gameStatus.textContent = "Kropka znów ma siłę";
  }, EXHAUSTION_MS);
}

function resetDodges() {
  state.dodgesLeft = DODGES_BEFORE_EXHAUSTION;
  state.exhaustedUntil = 0;
  target.classList.remove("exhausted");
  target.setAttribute("aria-label", "Złap kropkę");
}

function fleeFrom(clientX, clientY) {
  const now = performance.now();

  if (
    !state.running ||
    now < state.exhaustedUntil ||
    now - state.lastFleeAt < FLEE_COOLDOWN_MS
  ) {
    return;
  }

  state.lastFleeAt = now;
  state.dodgesLeft -= 1;
  target.classList.remove("fleeing");
  void target.offsetWidth;
  target.classList.add("fleeing");
  moveTargetAwayFrom(clientX, clientY);

  if (state.dodgesLeft === 0) {
    setExhausted();
  } else {
    gameStatus.textContent = "Kropka ucieka! Jeszcze jeden unik…";
  }
}

function pointerIsNearTarget(event) {
  const targetRect = target.getBoundingClientRect();
  const centerX = targetRect.left + targetRect.width / 2;
  const centerY = targetRect.top + targetRect.height / 2;
  const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
  const detectionDistance = event.pointerType === "touch"
    ? TOUCH_DETECTION_DISTANCE
    : MOUSE_DETECTION_DISTANCE;

  return distance < detectionDistance;
}

function handlePointerApproach(event) {
  if (state.running && pointerIsNearTarget(event)) {
    fleeFrom(event.clientX, event.clientY);
  }
}

function startGame() {
  window.clearInterval(state.timerId);
  window.clearTimeout(state.exhaustionId);

  state.running = true;
  state.score = 0;
  state.timeLeft = GAME_LENGTH_SECONDS;
  state.startedAt = Date.now();
  state.lastFleeAt = -FLEE_COOLDOWN_MS;
  resetDodges();

  overlay.hidden = true;
  target.hidden = false;
  shareStatus.textContent = "";
  gameStatus.textContent = "Podejdź do kropki…";
  renderStats();
  setTargetColor();
  moveTargetRandomly();

  state.timerId = window.setInterval(updateTimer, 200);
}

function updateTimer() {
  const elapsedSeconds = Math.floor((Date.now() - state.startedAt) / 1000);
  const nextTimeLeft = Math.max(0, GAME_LENGTH_SECONDS - elapsedSeconds);

  if (nextTimeLeft !== state.timeLeft) {
    state.timeLeft = nextTimeLeft;
    renderStats();
  }

  if (state.timeLeft === 0) {
    endGame();
  }
}

function scorePoint() {
  if (!state.running) {
    return;
  }

  state.score += 1;
  window.clearTimeout(state.exhaustionId);
  target.classList.remove("hit", "fleeing");
  void target.offsetWidth;
  target.classList.add("hit");
  resetDodges();
  setTargetColor();
  moveTargetRandomly();
  gameStatus.textContent = "Trafienie! Kropka odzyskała siłę";
  renderStats();
}

function endGame() {
  state.running = false;
  window.clearInterval(state.timerId);
  window.clearTimeout(state.exhaustionId);
  target.hidden = true;
  gameStatus.textContent = "";

  const isNewRecord = state.score > state.bestScore;
  if (isNewRecord) {
    state.bestScore = state.score;
    saveBestScore();
  }

  renderStats();
  overlayTitle.textContent = isNewRecord ? "Nowy rekord!" : "Koniec rundy";
  overlayText.textContent = `Wynik: ${state.score}. ${isNewRecord ? "Świetny refleks!" : "Spróbuj ponownie."}`;
  startButton.textContent = "Zagraj ponownie";
  overlay.hidden = false;
  startButton.focus({ preventScroll: true });
}

async function shareGame() {
  shareStatus.textContent = "";

  if (window.location.protocol === "file:") {
    shareStatus.textContent = "Udostępnianie linku zadziała po opublikowaniu strony.";
    return;
  }

  const shareData = {
    title: "Uciekająca kropka — poziom trudny",
    text: "Spróbuj złapać uciekającą kropkę i pobić mój wynik!",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = "Link został udostępniony.";
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    shareStatus.textContent = "Link został skopiowany.";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }
    shareStatus.textContent = "Nie udało się udostępnić linku.";
  }
}

arena.addEventListener("pointermove", handlePointerApproach);
arena.addEventListener("pointerdown", handlePointerApproach);
target.addEventListener("click", scorePoint);
startButton.addEventListener("click", startGame);
shareButton.addEventListener("click", shareGame);

window.addEventListener("resize", () => {
  if (state.running) {
    moveTargetRandomly();
  }
});

renderStats();
