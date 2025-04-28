import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// 📁 Projects ana klasörü
const PROJECTS_DIR = path.join(process.env.APP_ROOT || '', 'projects')

// Klasör yoksa oluştur
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR)
}

// IPC Handlers

// ✅ Proje klasörü oluştur
ipcMain.handle('create-project', async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Select a folder for your new project',
      properties: ['openDirectory', 'createDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No folder selected.' }
    }

    const selectedPath = result.filePaths[0]

    return { success: true, path: selectedPath }
  } catch (error: any) {
    console.error('Error selecting project folder:', error)
    return { success: false, error: error.message }
  }
})


// henüz içi boş
ipcMain.handle('open-project', async () => {
  console.log('Open Project clicked')
})

ipcMain.handle('manage-configurations', async () => {
  console.log('Manage Configurations clicked')
})

ipcMain.handle('open-help', async () => {
  console.log('Help clicked')
})

// App lifecycle

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
