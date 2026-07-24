const { contextBridge, ipcRenderer, webUtils } = require("electron");

contextBridge.exposeInMainWorld("desktopPet", {
  dragStart: () => ipcRenderer.send("window-drag-start"),
  dragEnd: () => ipcRenderer.send("window-drag-end"),
  quit: () => ipcRenderer.send("quit-pet"),
  getSettings: () => ipcRenderer.invoke("get-settings"),
  onSettingsChanged: (callback) => {
    ipcRenderer.on("settings-updated", (_event, settings) => callback(settings));
  },
  getFilePath: (file) => webUtils.getPathForFile(file),
  trashPaths: (filePaths) => ipcRenderer.invoke("trash-files", filePaths)
});
