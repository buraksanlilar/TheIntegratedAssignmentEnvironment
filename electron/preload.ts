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

  // Özel fonksiyonlar
  createProject: (name: string) => ipcRenderer.invoke('create-project', name),
  openProject: () => ipcRenderer.invoke('open-project'),
  manageConfigurations: () => ipcRenderer.invoke('manage-configurations'),
  openHelp: () => ipcRenderer.invoke('open-help'),

  // ZIP işlemleri
  selectZipFile: () => ipcRenderer.invoke('select-zip'),                    // Tek ZIP seçimi
  selectZipFiles: () => ipcRenderer.invoke('select-multiple-zips'),         // Çoklu ZIP seçimi
  selectZipFolder: () => ipcRenderer.invoke('select-zip-folder'),           // ZIP klasörü seçimi
  importZip: () => ipcRenderer.invoke('import-zip'),
  importZipToProject: (zipPath: string, projectPath: string) =>
    ipcRenderer.invoke('import-zip-to-project', zipPath, projectPath),

  // 📁 ZIP klasörünü okuyup sadece .zip dosyalarını listele
  listZipFilesInFolder: (folderPath: string) =>
    ipcRenderer.invoke('list-zip-files', folderPath),

  // 📂 ZIP klasörünü işleyip proje klasörüne extract eden özel fonksiyon
  processZipFolder: (zipFolderPath: string, projectName: string) =>
    ipcRenderer.invoke('process-zip-folder', zipFolderPath, projectName),
})
