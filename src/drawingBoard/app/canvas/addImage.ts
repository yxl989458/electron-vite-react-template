import { fabric } from 'fabric'
import { _canvas } from '../canvasMiddleware'

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const addImageToCanvas = async (file: File) => {
  // 获取视口信息
  const vpt = _canvas.viewportTransform || [1, 0, 0, 1, 0, 0]
  const zoom = _canvas.getZoom()

  const viewportCenterX = (-vpt[4] + _canvas.getWidth() / 2) / zoom
  const viewportCenterY = (-vpt[5] + _canvas.getHeight() / 2) / zoom

  try {
    const url = await readFileAsDataURL(file)
    fabric.Image.fromURL(url, (img) => {
      // 设置目标最大尺寸（以像素为单位）
      const TARGET_MAX_SIZE = 400
      const TARGET_MIN_SIZE = 100

      // 计算缩放比例
      let scale

      if (img.width! >= img.height!) {
        // 如果图片是横向的或方形的
        scale = Math.min(
          Math.max(TARGET_MIN_SIZE / img.width!, TARGET_MAX_SIZE / img.width!),
          1, // 不要放大图片
        )
      } else {
        // 如果图片是纵向的
        scale = Math.min(
          Math.max(TARGET_MIN_SIZE / img.height!, TARGET_MAX_SIZE / img.height!),
          1, // 不要放大图片
        )
      }
      img.scale(scale)
      img.set({
        left: viewportCenterX - (img.width! * scale) / 2,
        top: viewportCenterY - (img.height! * scale) / 2,
        lockUniScaling: true,
      })
      _canvas.add(img)
      _canvas.setActiveObject(img)
      _canvas.requestRenderAll()
    })
  } catch (error) {
    console.error('Error adding image:', error)
  }
}
