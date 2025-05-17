import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'
import extract from 'extract-zip'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

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
if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR)
}

// ✅ Proje oluşturma
ipcMain.handle('create-project', async (_event, projectName: string) => {
  try {
    const projectPath = path.join(PROJECTS_DIR, projectName)
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true })
    }
    return { success: true, path: projectPath }
  } catch (error: any) {
    console.error('Error creating project folder:', error)
    return { success: false, error: error.message }
  }
})

// ✅ ZIP klasörü seçimi
ipcMain.handle('select-zip-folder', async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Select Folder Containing ZIPs',
      properties: ['openDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false }
    }

    return { success: true, folderPath: result.filePaths[0] }
  } catch (error: any) {
    console.error('Error selecting ZIP folder:', error)
    return { success: false, error: error.message }
  }
})

// ✅ ZIP klasörünü işleyip her ZIP'i klasöre extract eden handler
ipcMain.handle('process-zip-folder', async (_event, zipFolderPath: string, projectName: string) => {
  try {
    const projectRoot = path.join(PROJECTS_DIR, projectName)
    if (!fs.existsSync(projectRoot)) {
      fs.mkdirSync(projectRoot, { recursive: true })
    } 

    const zipFiles = fs.readdirSync(zipFolderPath).filter(f => f.endsWith('.zip'))
    const extractedStudents: { studentId: string; path: string }[] = []

    for (const zipFile of zipFiles) {
      const zipPath = path.join(zipFolderPath, zipFile)
      const folderName = path.basename(zipFile, '.zip') // studentId
      const targetFolder = path.join(projectRoot, folderName)

      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true })
      }

      await extract(zipPath, { dir: targetFolder })

      extractedStudents.push({
        studentId: folderName,
        path: targetFolder
      })
    }

    return { success: true, students: extractedStudents }
  } catch (error: any) {
    console.error("ZIP processing failed:", error)
    return { success: false, error: error.message }
  }
})

// ✅ Evaluate C Projects Only
ipcMain.handle('evaluate-project', async (_event, project: any) => {
  try {
    const results: { studentId: string; status: string; error?: string; actualOutput?: string }[] = []

    const language = (project.config?.language || '').toLowerCase()
    const inputArgs = project.config?.inputFormat?.split(' ') || []
    const expectedOutput = (project.config?.outputFormat || '').trim()
    const isWindows = process.platform === 'win32'

    for (const [studentId, studentPath] of Object.entries(project.students || {})) {
      try {
        let compileCmd = ''
        let runCmd = ''

        if (language === 'c') {
          compileCmd = isWindows ? `gcc main.c -o main.exe` : `gcc main.c -o main`
          runCmd = isWindows ? `main.exe ${inputArgs.join(' ')}` : `./main ${inputArgs.join(' ')}`
        } else if (language === 'java') {
          compileCmd = `javac Main.java`
          runCmd = `java Main ${inputArgs.join(' ')}`
        } else if (language === 'python') {
          runCmd = `python3 main.py ${inputArgs.join(' ')}`
        } else {
          throw new Error(`Unsupported language: ${language}`)
        }

        if (compileCmd) await execPromise(compileCmd, { cwd: studentPath as string })

        const { stdout } = await execPromise(runCmd, {
          cwd: studentPath as string,
          timeout: 5000,
        })

        const actualOutput = stdout.trim()
        const isCorrect = actualOutput === expectedOutput

        results.push({
          studentId,
          status: isCorrect ? 'Success' : 'Failure',
          ...(isCorrect ? {} : { actualOutput })
        })
      } catch (err: any) {
        results.push({
          studentId,
          status: 'Failure',
          error: err.message || 'Unknown error'
        })
      }
    }

    return { success: true, results }
  } catch (err: any) {
    console.error('Evaluation failed:', err)
    return { success: false, error: err.message }
  }
})


// Diğer işlemler
ipcMain.handle('open-project', async () => {
  console.log('Open Project clicked')
})

ipcMain.handle('manage-configurations', async () => {
  console.log('Manage Configurations clicked')
})

ipcMain.handle('open-help', async () => {
  console.log('Help clicked')
})

// Uygulama lifecycle
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
