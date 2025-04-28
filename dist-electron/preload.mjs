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
  // Özelleştirilmiş methodlar
  createProject: () => electron.ipcRenderer.invoke("create-project"),
  openProject: () => electron.ipcRenderer.invoke("open-project"),
  manageConfigurations: () => electron.ipcRenderer.invoke("manage-configurations"),
  openHelp: () => electron.ipcRenderer.invoke("open-help"),
  createProjectFolder: (projectName) => electron.ipcRenderer.invoke("create-project-folder", projectName)
});
