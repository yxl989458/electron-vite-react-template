import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import Store from 'electron-store'
import { createRequire } from 'node:module'
import os from 'node:os'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import CaptureScreen from './ipc/capture-screen-ipc'
import { TrayManager } from './tray'
import { StoreType, WindowManager } from './window'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

const store = new Store<StoreType>({
  defaults: {
    skipCloseConfirmation: false,
  },
})
export const preload = path.join(__dirname, '../preload/index.mjs')
export const indexHtml = path.join(RENDERER_DIST, 'index.html')
console.log(indexHtml)

let windowManager: WindowManager
let trayManager: TrayManager
let captureScreen: CaptureScreen
async function init() {
  windowManager = new WindowManager(
    store,
    preload,
    indexHtml,
    VITE_DEV_SERVER_URL,
    process.env.VITE_PUBLIC
  )
  globalShortcut.register('F12', () => {
    windowManager.getWindow()?.webContents.toggleDevTools()
  })

  try {
    const win = await windowManager.createWindow()
    
    win.on('close', (event) => {
      if (process.platform === 'darwin' && !windowManager.isQuitting) {
        event.preventDefault()
        win.hide()
      }
    })

    app.on('before-quit', () => {
      windowManager.setQuitting(true)
    })

    trayManager = new TrayManager(store, windowManager, process.env.VITE_PUBLIC)
    await trayManager.createTray()
    captureScreen = new CaptureScreen()
  } catch (error) {
    console.error('Failed to initialize:', error)
  }
}

app.whenReady().then(init)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  const win = windowManager.getWindow()
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const win = windowManager.getWindow()
  if (win) {
    win.show()
  } else {
    windowManager.createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  console.log('open-win', arg)

  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error)
})

// 在应用退出时清理资源
app.on('will-quit', () => {
  captureScreen.dispose()
})
