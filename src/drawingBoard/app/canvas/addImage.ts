import { fabric } from 'fabric'
import { _canvas } from '../canvasMiddleware'

export const addImageToCanvas = (file: File) => {
  if (!_canvas) return
  const canvas = _canvas
  const reader = new FileReader()

  reader.onload = function (event) {
    const imgObj = new Image()
    imgObj.src = event.target?.result as string

    imgObj.onload = function () {
      new fabric.WebglFilterBackend
      const image = new fabric.Image(imgObj, {
        borderColor: 'green',
        cornerColor: 'green',
        name: `Image ${canvas.getObjects().filter((o) => o.type === 'image').length + 1}`,
        hasRotatingPoint: false, //是否显示旋转按钮
      })
      console.log(fabric.Image.prototype.controls)

      // 调整图片大小以适应画布
      const canvasWidth = canvas.width || 800
      const canvasHeight = canvas.height || 600
      const maxWidth = canvasWidth * 0.8; // 最大宽度为画布宽度的80%
      const maxHeight = canvasHeight * 0.8; // 最大高度为画布高度的80%

      if (image.width && image.height) {
        if (image.width > maxWidth || image.height > maxHeight) {
          const scale = Math.min(maxWidth / image.width, maxHeight / image.height)
          image.scale(scale)
        }
      }

      canvas.add(image)
      canvas.centerObject(image)
      canvas.renderAll()
    }
  }

  reader.readAsDataURL(file)
}
