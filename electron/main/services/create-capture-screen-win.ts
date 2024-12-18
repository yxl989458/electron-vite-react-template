import { BrowserWindow, screen } from 'electron'
import os from 'os'
import { VITE_DEV_SERVER_URL, indexHtml, preload } from '..'

export class CreateCaptureScreenWindow {
  private captureWin: BrowserWindow[]

  constructor(event: Electron.IpcMainEvent) {
    this.captureWin = this.createCaptureWindow(event)
  }
  createCaptureWindow(event: Electron.IpcMainEvent) {
    const displays = screen.getAllDisplays()

    return displays.map((display) => {
      const captureWin = new BrowserWindow({
        fullscreen: os.platform() === 'win32' || undefined,
        width: display.bounds.width,
        height: display.bounds.height,
        x: display.bounds.x,
        y: display.bounds.y,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        autoHideMenuBar: true,
        movable: false,
        resizable: false,
        backgroundColor: '#00000000',
        enableLargerThanScreen: true, //mac
        hasShadow: false,
        webPreferences: {
          preload,
        },
      })

      captureWin.setAlwaysOnTop(true, 'screen-saver')
      captureWin.setVisibleOnAllWorkspaces(true)
      captureWin.setFullScreenable(false)
      if (os.platform() === 'darwin') {
        captureWin.setWindowButtonVisibility(false)
      }

      //向渲染进程发消息
      if (VITE_DEV_SERVER_URL) {
        captureWin.loadURL(`${VITE_DEV_SERVER_URL}#/capture`)
      } else {
        captureWin.loadFile(indexHtml, {
          hash: '/capture',
        })
      }
      if (VITE_DEV_SERVER_URL) {
        // captureWin.webContents.openDevTools({ mode: 'bottom' })
      }
      event.reply('capture-screen-id', captureWin.id.toString())
      return captureWin
    })
  }

  getCaptureWin() {
    return this.captureWin
  }
}
