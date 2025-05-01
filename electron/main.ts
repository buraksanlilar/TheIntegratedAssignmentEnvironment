import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'

import extract from 'extract-zip'


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
ipcMain.handle('create-project', async (_event, projectName: string) => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Select location to create your project folder',
      properties: ['openDirectory']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No directory selected' };
    }

    const basePath = result.filePaths[0];
    const projectPath = path.join(basePath, projectName);
    const submissionsPath = path.join(projectPath, 'submissions');

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
    if (!fs.existsSync(submissionsPath)) {
      fs.mkdirSync(submissionsPath);
    }

    return { success: true, path: projectPath };
  } catch (error: any) {
    console.error('Error creating project folder:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-zip', async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Select ZIP File',
      properties: ['openFile'],
      filters: [{ name: 'ZIP Files', extensions: ['zip'] }]
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false }
    }

    return { success: true, path: result.filePaths[0] }
  } catch (error: any) {
    console.error('Error selecting ZIP file:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('import-zip', async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Select ZIP file',
      filters: [{ name: 'ZIP Files', extensions: ['zip'] }],
      properties: ['openFile']
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, error: 'No file selected' };
    }

    const zipPath = result.filePaths[0];
    const submissionsDir = path.join(process.env.APP_ROOT || '', 'submissions');

    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }

    await extract(zipPath, { dir: submissionsDir });

    return { success: true, path: submissionsDir };
  } catch (error: any) {
    console.error('ZIP extract error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('import-zip-to-project', async (_event, zipPath: string, projectPath: string) => {
  try {
    const submissionsPath = path.join(projectPath, 'submissions')
    if (!fs.existsSync(submissionsPath)) {
      fs.mkdirSync(submissionsPath, { recursive: true })
    }
    await extract(zipPath, { dir: submissionsPath })
    return { success: true }
  } catch (error: any) {
    console.error('Failed to import zip to project:', error)
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
