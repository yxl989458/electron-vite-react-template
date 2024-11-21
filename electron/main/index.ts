import { app, BrowserWindow, ipcMain } from 'electron'
import Store from 'electron-store'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import CaptureScreen from './ipc/captrue-screen'
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
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

let windowManager: WindowManager
let trayManager: TrayManager

async function init() {
  console.log('init', VITE_DEV_SERVER_URL)
  windowManager = new WindowManager(
    store,
    preload,
    indexHtml,
    VITE_DEV_SERVER_URL,
    process.env.VITE_PUBLIC
  )

  try {
    const win = await windowManager.createWindow()
    trayManager = new TrayManager(store, windowManager, process.env.VITE_PUBLIC)
    await trayManager.createTray() // 添加 await 以确保错误被捕获
    new CaptureScreen()
  } catch (error) {
    console.error('Failed to initialize:', error) // 捕获并打印初始化错误
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
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
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