import { BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { captureScreen } from '../capture-screen'

class CaptureScreen {
  private captureWin: BrowserWindow | null = null
  constructor() {
    this.init()
  }
  init() {
    this.initRegisterShortcut()
    this.openCaptureWin()
  }
  openCaptureWin() {
    ipcMain.on('capture-screen', () => (this.captureWin = captureScreen()))
  }
  closeCaptureWin() {
    this.captureWin?.close()
    this.captureWin = null
  }
  initRegisterShortcut() {
    // 判断是否在新窗口
    globalShortcut.register('Esc', () => {
      this.closeCaptureWin()
    })
  }
}

export default CaptureScreen
