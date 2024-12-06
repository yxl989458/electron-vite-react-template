import { app, dialog, Menu, nativeImage, Tray } from 'electron'
import type Store from 'electron-store'
import path from 'node:path'
import type { StoreType, WindowManager } from './window'

export class TrayManager {
  private tray: Tray | null = null

  constructor(
    private store: Store<StoreType>,
    private windowManager: WindowManager,
    private VITE_PUBLIC: string,
  ) {}

  createTray() {
    const icon = nativeImage.createFromPath(path.join(this.VITE_PUBLIC, 'favicon.ico'))
    this.tray = new Tray(icon)
    this.setupTrayMenu()
    this.setupTrayEvents()
    return this.tray
  }

  private setupTrayMenu() {
    if (!this.tray) return

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '打开主界面',
        click: () => {
          this.windowManager.showWindow()
        },
      },
      { type: 'separator' },
      {
        label: '设置',
        submenu: [
          {
            label: '重置关闭提示',
            click: () => {
              this.store.set('skipCloseConfirmation', false)
              dialog.showMessageBox({
                type: 'info',
                message: '已重置关闭提示',
                detail: '下次关闭窗口时将重新显示提示对话框。',
                buttons: ['确定'],
              })
            },
          },
          {
            label: '清除所有设置',
            click: async () => {
              const choice = await dialog.showMessageBox({
                type: 'warning',
                buttons: ['确认清除', '取消'],
                title: '清除设置',
                message: '确定要清除所有设置吗？',
                detail: '这将重置所有选项到默认状态。',
                defaultId: 1,
                cancelId: 1,
              })

              if (choice.response === 0) {
                this.store.clear()
                this.store.set('skipCloseConfirmation', false)
                dialog.showMessageBox({
                  type: 'info',
                  message: '设置已清除',
                  detail: '所有设置已恢复到默认状态。',
                  buttons: ['确定'],
                })
              }
            },
          },
        ],
      },
      {
        label: '退出',
        click: async () => {
          const choice = await dialog.showMessageBox({
            type: 'question',
            buttons: ['确认退出', '取消'],
            title: '确认退出',
            message: '确定要退出应用吗？',
            defaultId: 0,
            cancelId: 1,
          })

          if (choice.response === 0) {
            this.windowManager.setQuitting(true)
            app.quit()
          }
        },
      },
    ])

    this.tray.setToolTip('你的应用名称')
    this.tray.setContextMenu(contextMenu)
  }

  private setupTrayEvents() {
    if (!this.tray) return

    this.tray.on('double-click', () => {
      this.windowManager.showWindow()
    })
  }
}
