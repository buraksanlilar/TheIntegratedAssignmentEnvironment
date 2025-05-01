"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  // Genel IPC işlemleri
  on: (...args) => {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off: (...args) => {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send: (...args) => {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke: (...args) => {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // specified methods
  createProject: (name) => electron.ipcRenderer.invoke("create-project", name),
  openProject: () => electron.ipcRenderer.invoke("open-project"),
  manageConfigurations: () => electron.ipcRenderer.invoke("manage-configurations"),
  openHelp: () => electron.ipcRenderer.invoke("open-help"),
  selectZipFile: () => electron.ipcRenderer.invoke("select-zip"),
  importZip: () => electron.ipcRenderer.invoke("import-zip"),
  importZipToProject: (zipPath, projectPath) => electron.ipcRenderer.invoke("import-zip-to-project", zipPath, projectPath)
});
