import { ipcRenderer, contextBridge } from 'electron'

// Tüm API'yi tek bir yerde expose ediyoruz
contextBridge.exposeInMainWorld('api', {
  // Genel IPC işlemleri
  on: (...args: Parameters<typeof ipcRenderer.on>) => {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off: (...args: Parameters<typeof ipcRenderer.off>) => {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send: (...args: Parameters<typeof ipcRenderer.send>) => {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke: (...args: Parameters<typeof ipcRenderer.invoke>) => {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // specified methods
  createProject: () => ipcRenderer.invoke('create-project'),
  openProject: () => ipcRenderer.invoke('open-project'),
  manageConfigurations: () => ipcRenderer.invoke('manage-configurations'),
  openHelp: () => ipcRenderer.invoke('open-help'),
  createProjectFolder: (projectName: string) => ipcRenderer.invoke('create-project-folder', projectName),
})
