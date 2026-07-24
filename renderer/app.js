import { BlackHoleRenderer } from "./blackhole.js";
import { FileSwallowEffect } from "./file-effects.js";
import { StarField } from "./particles.js";
import { BlackHoleState } from "./state.js";

const canvas = document.querySelector("#space");
const effectsCanvas = document.querySelector("#effects");
const pet = document.querySelector("#pet");
const status = document.querySelector("#status");
const ctx = canvas.getContext("2d");
const effectsCtx = effectsCanvas.getContext("2d");
const center = { x: canvas.width / 2, y: canvas.height / 2 };
const blackHole = new BlackHoleRenderer();
const fileEffect = new FileSwallowEffect();
const stars = new StarField();
const state = new BlackHoleState();
let settings = {
  backgroundStars: true,
  swallowAnimation: true,
  recycleBin: false
};
let lastTime = performance.now();
let dragging = false;
let statusTimer = null;

function showStatus(message, isError = false, duration = 2200) {
  clearTimeout(statusTimer);
  status.textContent = message;
  status.classList.toggle("error", isError);
  status.classList.add("visible");
  statusTimer = setTimeout(() => status.classList.remove("visible"), duration);
}

window.desktopPet.getSettings().then((storedSettings) => {
  settings = { ...settings, ...storedSettings };
});
window.desktopPet.onSettingsChanged((nextSettings) => {
  settings = { ...settings, ...nextSettings };
});

function frame(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  const time = now / 1000;
  lastTime = now;
  state.update(delta);
  blackHole.update(delta, state.energy);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
  stars.draw(ctx, center, time, state.energy, {
    starsEnabled: settings.backgroundStars
  });
  fileEffect.draw(effectsCtx, center, now);
  pet.classList.toggle("feeding", fileEffect.isActive(now));
  blackHole.draw(ctx, center, time, state.energy);
  requestAnimationFrame(frame);
}

pet.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  dragging = true;
  pet.classList.add("dragging");
  pet.setPointerCapture(event.pointerId);
  window.desktopPet.dragStart();
});

function endDrag() {
  if (!dragging) return;
  dragging = false;
  pet.classList.remove("dragging");
  window.desktopPet.dragEnd();
}

pet.addEventListener("pointerup", endDrag);
pet.addEventListener("pointercancel", endDrag);
pet.addEventListener("dblclick", () => stars.triggerStellarTurn());
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") window.desktopPet.quit();
});

pet.addEventListener("dragover", (event) => {
  event.preventDefault();
  if (settings.swallowAnimation) state.feed(0.45);
});

pet.addEventListener("drop", async (event) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  if (files.length === 0) return;
  if (!settings.swallowAnimation && !settings.recycleBin) {
    showStatus("文件功能已关闭");
    return;
  }

  if (settings.swallowAnimation) {
    const rect = effectsCanvas.getBoundingClientRect();
    const origin = {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
    fileEffect.start(files, origin, center);
    state.feed(Math.min(1, files.length / 4));
    setTimeout(() => {
      state.mode = "stable";
      state.targetEnergy = state.quiet ? 0.12 : 0.38;
    }, 1800);
  }

  if (!settings.recycleBin) {
    showStatus("吞噬动画完成 · 文件未移动");
    return;
  }

  const filePaths = [];
  for (const file of files) {
    try {
      const filePath = window.desktopPet.getFilePath(file);
      if (filePath) filePaths.push(filePath);
    } catch {
      // The result message below explains an empty path list to the user.
    }
  }

  if (filePaths.length === 0) {
    showStatus("回收失败：无法读取文件路径", true, 3200);
    return;
  }

  showStatus("正在送入 Windows 回收站…", false, 5000);
  const result = await window.desktopPet.trashPaths(filePaths);
  if (result.ok) {
    showStatus(`已安全回收 ${result.succeeded} 个项目`);
  } else {
    showStatus(
      `回收完成 ${result.succeeded} 个，失败 ${result.failed} 个`,
      true,
      3200
    );
  }
});

requestAnimationFrame(frame);
