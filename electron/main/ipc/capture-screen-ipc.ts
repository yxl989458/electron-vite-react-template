import { SelectionArea } from '@/types'
import { ipcMain } from 'electron'
import { CaptureWindowService } from '../services/capture-window-service'
import { ScreenCaptureService } from '../services/screen-capture-service'
import { getCurrentDisplay, RegisterShortcut } from '../utils'

class CaptureScreenIpc {
  private readonly screenCaptureService: ScreenCaptureService
  private readonly windowService: CaptureWindowService
  private readonly shortcutService: RegisterShortcut

  constructor() {
    this.screenCaptureService = new ScreenCaptureService()
    this.windowService = new CaptureWindowService()
    this.shortcutService = new RegisterShortcut()
    this.initialize()
  }

  private initialize() {
    this.registerShortcuts()
    this.registerIpcHandlers()
  }

  private registerShortcuts() {
    this.shortcutService.register('Esc', () => {
      this.windowService.closeAllWindows()
    })
  }

  private registerIpcHandlers() {
    this.handleCaptureScreen()
    this.handleCaptureScreenResult()
    this.handleCloseWindow()
    this.handleCaptureScreenSelection()
  }

  private handleCaptureScreen() {
    ipcMain.on('capture-screen', async (event) => this.windowService.createCaptureWindow(event))
  }

  private handleCaptureScreenResult() {
    ipcMain.on('capture-screen-result', async (event, selection: SelectionArea) => {
      try {
        await this.screenCaptureService.captureScreen(event, selection)
        // this.windowService.closeAllWindows()
      } catch (error) {
        console.error('Failed to capture screen:', error)
        event.reply('capture-screen-error', error)
      }
    })
  }

  private handleCloseWindow() {
    ipcMain.on('close-capture-win', () => {
      this.windowService.closeAllWindows()
    })
  }
  private handleCaptureScreenSelection() {
    ipcMain.on('capture-screen-enabled', () => {
      const curPlay = getCurrentDisplay()
    })
  }

  public dispose() {
    this.shortcutService.unregisterAll()
    this.windowService.closeAllWindows()
  }
}

export default CaptureScreenIpc
