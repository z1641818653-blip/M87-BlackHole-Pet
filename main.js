const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  screen,
  shell
} = require("electron");
const fs = require("node:fs");
const path = require("node:path");

let petWindow;
let dragStart = null;
let dragTimer = null;
let settings = null;

const DEFAULT_SETTINGS = Object.freeze({
  backgroundStars: true,
  swallowAnimation: true,
  recycleBin: false
});

function getTrashName() {
  return process.platform === "darwin" ? "废纸篓" : "回收站";
}

function getSettingsPath() {
  return path.join(app.getPath("userData"), "pet-settings.json");
}

function loadSettings() {
  try {
    const stored = JSON.parse(fs.readFileSync(getSettingsPath(), "utf8"));
    return {
      ...DEFAULT_SETTINGS,
      ...Object.fromEntries(
        Object.keys(DEFAULT_SETTINGS)
          .filter((key) => typeof stored[key] === "boolean")
          .map((key) => [key, stored[key]])
      )
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  fs.writeFileSync(
    getSettingsPath(),
    `${JSON.stringify(settings, null, 2)}\n`,
    "utf8"
  );
}

function publishSettings() {
  if (!petWindow || petWindow.isDestroyed()) return;
  petWindow.webContents.send("settings-updated", settings);
}

function setSetting(key, value) {
  if (!(key in DEFAULT_SETTINGS) || typeof value !== "boolean") return;
  settings[key] = value;
  saveSettings();
  publishSettings();
}

async function confirmRecycleBinEnable() {
  const trashName = getTrashName();
  const result = await dialog.showMessageBox(petWindow, {
    type: "warning",
    buttons: ["取消", `启用安全${trashName}`],
    defaultId: 0,
    cancelId: 0,
    title: `启用系统${trashName}`,
    message: `拖入黑洞的文件将被移动到系统${trashName}。`,
    detail: "不会永久删除文件。若系统回收失败，文件会保持原状。"
  });
  return result.response === 1;
}

function showContextMenu() {
  const featureItem = (label, key) => ({
    label,
    type: "checkbox",
    checked: settings[key],
    click: async (item) => {
      if (key === "recycleBin" && item.checked) {
        const confirmed = await confirmRecycleBinEnable();
        if (!confirmed) return;
      }
      setSetting(key, item.checked);
    }
  });

  Menu.buildFromTemplate([
    {
      label: "M87* 黑洞桌宠",
      enabled: false
    },
    { type: "separator" },
    featureItem("背景星空", "backgroundStars"),
    featureItem("文件吞噬动画", "swallowAnimation"),
    featureItem(`启用系统${getTrashName()}`, "recycleBin"),
    { type: "separator" },
    {
      label: "恢复默认设置",
      click: () => {
        settings = { ...DEFAULT_SETTINGS };
        saveSettings();
        publishSettings();
      }
    },
    { type: "separator" },
    {
      label: "退出黑洞桌宠",
      click: () => app.quit()
    }
  ]).popup({ window: petWindow });
}

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const size = 420;
  const margin = 28;

  petWindow = new BrowserWindow({
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    maxWidth: size,
    maxHeight: size,
    x: display.workArea.x + display.workArea.width - size - margin,
    y: display.workArea.y + display.workArea.height - size - margin,
    frame: false,
    thickFrame: false,
    title: "",
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const enforceWindowPresentation = () => {
    if (!petWindow || petWindow.isDestroyed()) return;
    petWindow.setMenu(null);
    petWindow.setMenuBarVisibility(false);
    petWindow.setBackgroundColor("#00000000");
    petWindow.setAlwaysOnTop(true, "screen-saver", 1);
    petWindow.setSkipTaskbar(true);
    if (process.platform === "darwin") {
      petWindow.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true,
        skipTransformProcessType: true
      });
    }
  };

  enforceWindowPresentation();
  petWindow.on("blur", () => setTimeout(enforceWindowPresentation, 0));
  petWindow.on("show", enforceWindowPresentation);
  petWindow.on("focus", enforceWindowPresentation);
  petWindow.on("resize", () => {
    if (!petWindow) return;
    const [width, height] = petWindow.getSize();
    if (width !== size || height !== size) {
      petWindow.setSize(size, size, false);
    }
  });
  petWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  petWindow.webContents.on("context-menu", showContextMenu);
}

ipcMain.on("window-drag-start", () => {
  if (!petWindow) return;
  const cursor = screen.getCursorScreenPoint();
  const windowPosition = petWindow.getPosition();
  dragStart = {
    cursor,
    window: windowPosition,
    lastPosition: windowPosition,
    hasMoved: false
  };
  clearInterval(dragTimer);
  dragTimer = setInterval(() => {
    if (!petWindow || !dragStart) return;
    const current = screen.getCursorScreenPoint();
    const deltaX = current.x - dragStart.cursor.x;
    const deltaY = current.y - dragStart.cursor.y;
    if (!dragStart.hasMoved && Math.hypot(deltaX, deltaY) < 4) return;
    dragStart.hasMoved = true;
    const nextX = dragStart.window[0] + deltaX;
    const nextY = dragStart.window[1] + deltaY;
    if (
      nextX === dragStart.lastPosition[0] &&
      nextY === dragStart.lastPosition[1]
    ) return;
    dragStart.lastPosition = [nextX, nextY];
    petWindow.setPosition(nextX, nextY, false);
  }, 16);
});

ipcMain.on("window-drag-end", () => {
  dragStart = null;
  clearInterval(dragTimer);
  dragTimer = null;
});

ipcMain.on("quit-pet", () => app.quit());

ipcMain.handle("get-settings", () => ({ ...settings }));

ipcMain.handle("trash-files", async (_event, filePaths) => {
  if (!settings.recycleBin || !Array.isArray(filePaths)) {
    return {
      ok: false,
      succeeded: 0,
      failed: filePaths?.length ?? 0,
      reason: "disabled"
    };
  }

  const uniquePaths = [...new Set(filePaths)]
    .filter((filePath) => typeof filePath === "string" && filePath.length > 0)
    .map((filePath) => path.resolve(filePath));
  let succeeded = 0;

  for (const filePath of uniquePaths) {
    try {
      const parsed = path.parse(filePath);
      if (filePath === parsed.root || !fs.existsSync(filePath)) continue;
      await shell.trashItem(filePath);
      succeeded += 1;
    } catch {
      // shell.trashItem has no permanent-delete fallback.
    }
  }

  return {
    ok: succeeded === uniquePaths.length && uniquePaths.length > 0,
    succeeded,
    failed: uniquePaths.length - succeeded,
    reason: uniquePaths.length === 0 ? "no-valid-paths" : null
  };
});

app.whenReady().then(() => {
  if (process.platform === "darwin") {
    app.dock?.hide();
  }
  settings = loadSettings();
  createWindow();
});
app.on("window-all-closed", () => app.quit());
