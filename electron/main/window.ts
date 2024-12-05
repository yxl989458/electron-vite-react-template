import { app, BrowserWindow, dialog, shell } from 'electron'
import type Store from 'electron-store'
import path from 'node:path'
import { update } from './update'

export type StoreType = {
  skipCloseConfirmation: boolean
}

export class WindowManager {
  private win: BrowserWindow | null = null
  private isQuitting = false

  constructor(
    private store: Store<StoreType>,
    private preload: string,
    private indexHtml: string,
    private VITE_DEV_SERVER_URL: string | undefined,
    private VITE_PUBLIC: string
  ) {}

  async createWindow() {
    this.win = new BrowserWindow({
      title: 'Main window',
      icon: path.join(this.VITE_PUBLIC, 'favicon.ico'),
      webPreferences: {
        preload: this.preload,
      },
      width: 900,
      height: 600,
      minWidth: 600,
      minHeight: 400,
      frame: true,
      transparent: false,
      show: false,
    })
    this.win.maximize()
    this.setupWindowEvents()
    this.loadContent()
    update(this.win)

    return this.win
  }

  private setupWindowEvents() {
    if (!this.win) return

    this.win.once('ready-to-show', () => {
      this.win?.show()
    })

    this.win.on('close', async (event) => {
      if (!this.isQuitting) {
        event.preventDefault()
        await this.handleWindowClose()
      }
    })

    this.win.webContents.on('did-finish-load', () => {
      this.win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    this.win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) {
        shell.openExternal(url)
      }
      return { action: 'deny' }
    })
  }
  private async handleWindowClose() {
    if (this.isQuitting) {
      return
    }

    const skipConfirmation = this.store.get('skipCloseConfirmation', false)

    if (skipConfirmation) {
      this.win?.hide()
      return
    }

    const choice = await dialog.showMessageBox(this.win!, {
      type: 'question',
      buttons: ['最小化到托盘', '直接退出', '取消'],
      title: '确认',
      message: '你想要执行什么操作？',
      detail: '选择"最小化到托盘"会让程序在后台继续运行。',
      icon: path.join(this.VITE_PUBLIC, 'favicon.ico'),
      cancelId: 2,
      defaultId: 0,
      noLink: true,
      checkboxLabel: '不再提示',
      checkboxChecked: false,
    })

    if (choice.checkboxChecked) {
      this.store.set('skipCloseConfirmation', true)
    }

    switch (choice.response) {
      case 0:
        this.win?.hide()
        break
      case 1:
        this.isQuitting = true
        this.win?.destroy()
        setImmediate(() => {
          app.quit()
        })
        break
    }
  }

  private loadContent() {
    if (!this.win) return

    if (this.VITE_DEV_SERVER_URL) {
      this.win.loadURL(this.VITE_DEV_SERVER_URL)
      this.win.webContents.openDevTools()
    } else {
      this.win.loadFile(this.indexHtml)
    }
  }

  getWindow() {
    return this.win
  }

  setQuitting(value: boolean) {
    this.isQuitting = value
    if (value) {
      this.win?.destroy()
    }
  }
}
