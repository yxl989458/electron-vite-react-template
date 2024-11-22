import { SelectionArea } from '@/types'
import { clipboard, desktopCapturer, nativeImage, screen } from 'electron'

export class ScreenCaptureService {
  async captureScreen(event: Electron.IpcMainEvent, selection: SelectionArea): Promise<void> {
    const currentDisplay = this.getCurrentDisplay()

    // 获取当前屏幕的缩放因子
    const scaleFactor = currentDisplay.scaleFactor
    const { width, height } = currentDisplay.size

    // 获取所有屏幕的截图源
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: width * scaleFactor,
        height: height * scaleFactor,
      },
    })

    // 获取当前屏幕的截图的源
    const currentSource = sources.find(
      (source) => source.display_id === currentDisplay.id.toString()
    )

    if (!currentSource?.thumbnail) throw new Error('Failed to capture screen')

    // 裁剪图片
    const screenshot = currentSource.thumbnail.crop({
      x: selection.x * scaleFactor,
      y: selection.y * scaleFactor,
      width: selection.width * scaleFactor,
      height: selection.height * scaleFactor,
    })

    // 创建图片并写入剪切板
    const img = nativeImage.createFromDataURL(screenshot.toDataURL())
    clipboard.writeImage(img)
    // 通知
    event.reply('capture-screen-complete', img)
  }
  getCurrentDisplay() {
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
  }
}
