"use strict";

const GAME_LENGTH_SECONDS = 20;
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
const shareButton = document.querySelector("#shareButton");
const shareStatus = document.querySelector("#shareStatus");

const state = {
  running: false,
  score: 0,
  bestScore: readBestScore(),
  timeLeft: GAME_LENGTH_SECONDS,
  startedAt: 0,
  timerId: null,
};

function readBestScore() {
  try {
    const storedScore = Number.parseInt(localStorage.getItem("lap-kropke-best"), 10);
    return Number.isFinite(storedScore) ? storedScore : 0;
  } catch {
    return 0;
  }
}

function saveBestScore() {
  try {
    localStorage.setItem("lap-kropke-best", String(state.bestScore));
  } catch {
    // Gra nadal działa, nawet jeśli przeglądarka blokuje pamięć lokalną.
  }
}

function renderStats() {
  scoreElement.textContent = String(state.score);
  timeElement.textContent = String(state.timeLeft);
  bestScoreElement.textContent = String(state.bestScore);
}

function moveTarget() {
  const arenaRect = arena.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const padding = 12;
  const maxX = Math.max(padding, arenaRect.width - targetRect.width - padding);
  const maxY = Math.max(padding, arenaRect.height - targetRect.height - padding);
  const x = padding + Math.random() * (maxX - padding);
  const y = padding + Math.random() * (maxY - padding);

  target.style.left = `${Math.round(x)}px`;
  target.style.top = `${Math.round(y)}px`;
}

function setRandomTargetColor() {
  const color = TARGET_COLORS[state.score % TARGET_COLORS.length];
  target.style.setProperty("--target-color", color);
}

function startGame() {
  window.clearInterval(state.timerId);

  state.running = true;
  state.score = 0;
  state.timeLeft = GAME_LENGTH_SECONDS;
  state.startedAt = Date.now();

  overlay.hidden = true;
  target.hidden = false;
  shareStatus.textContent = "";
  renderStats();
  setRandomTargetColor();
  moveTarget();
  target.focus({ preventScroll: true });

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
  target.classList.remove("hit");
  void target.offsetWidth;
  target.classList.add("hit");
  setRandomTargetColor();
  moveTarget();
  renderStats();
}

function endGame() {
  state.running = false;
  window.clearInterval(state.timerId);
  target.hidden = true;

  const isNewRecord = state.score > state.bestScore;
  if (isNewRecord) {
    state.bestScore = state.score;
    saveBestScore();
  }

  renderStats();
  overlayTitle.textContent = isNewRecord ? "Nowy rekord!" : "Koniec rundy";
  overlayText.textContent = `Wynik: ${state.score}. ${isNewRecord ? "Brawo!" : "Spróbuj pobić rekord."}`;
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
    title: "Łap kropkę!",
    text: "Spróbuj pobić mój wynik w grze Łap kropkę!",
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

startButton.addEventListener("click", startGame);
target.addEventListener("click", scorePoint);
shareButton.addEventListener("click", shareGame);

window.addEventListener("resize", () => {
  if (state.running) {
    moveTarget();
  }
});

renderStats();
