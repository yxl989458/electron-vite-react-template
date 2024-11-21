import { ipcMain } from 'electron'
import { captureScreen } from '../capture-screen'

class CaptureScreen {
  constructor() {
    ipcMain.on('capture-screen', () => {
      captureScreen()
    })
  }
}

export default CaptureScreen
