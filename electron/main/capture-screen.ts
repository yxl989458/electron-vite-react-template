import { BrowserWindow, screen } from 'electron'
import os from 'os'
export const captureScreen = () => {
  let { width, height } = screen.getPrimaryDisplay().bounds
  const captureWin = new BrowserWindow({
    fullscreen: os.platform() === 'win32' || undefined, // win
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    movable: false,
    resizable: false,
    enableLargerThanScreen: true, // mac
    hasShadow: false,
  })
  captureWin.setAlwaysOnTop(true, 'screen-saver') // mac
  captureWin.setVisibleOnAllWorkspaces(true) // mac
  captureWin.setFullScreenable(false) // mac
  captureWin.on('closed', () => {})
  return captureWin
}
