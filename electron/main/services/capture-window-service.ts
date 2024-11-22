import { BrowserWindow } from 'electron'
import { CreateCaptureScreenWindow } from './create-capture-screen-win'

export class CaptureWindowService {
  private captureWindows: BrowserWindow[] | null = null
  createCaptureWindow(event: Electron.IpcMainEvent) {
    const captureWin = new CreateCaptureScreenWindow(event)
    this.captureWindows = captureWin.getCaptureWin()
    return this.captureWindows
  }

  closeAllWindows() {
    this.captureWindows?.forEach((win) => win?.close())
    this.captureWindows = null
  }

  hasActiveWindows(): boolean {
    return this.captureWindows !== null && this.captureWindows.length > 0
  }

  getCaptureWindows() {
    return this.captureWindows
  }
}
