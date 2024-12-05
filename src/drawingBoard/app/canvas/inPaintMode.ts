import { fabric } from 'fabric'
import { ApplyCanvasModeFunc } from './canvasMode'

export const darwinPaint: ApplyCanvasModeFunc<undefined> = (canvas, getState, dispatch) => {
  const activeObject = canvas.getActiveObject()
  if (!activeObject || (activeObject.type !== 'image' && activeObject.type !== 'group')) {
    return () => {}
  }

  const drawImgInLine = activeObject as fabric.Image

  let maskGroup = new fabric.Group([drawImgInLine], {
    left: drawImgInLine.left,
    top: drawImgInLine.top,
    selectable: false, // 禁止选择
    evented: false, // 禁止事件响应
  })
  canvas.remove(drawImgInLine)
  canvas.add(maskGroup)
  canvas.setActiveObject(maskGroup)

  // Disable selection and events for the group

  // 添加一个函数来获取实际的鼠标坐标
  const getActualPointer = (e: fabric.IEvent) => {
    if (!e.pointer) return null
    // 获取画布的视口变换信息
    const vpt = canvas.viewportTransform
    if (!vpt) return null

    // 根据画布的变换计算实际坐标
    return new fabric.Point((e.pointer.x - vpt[4]) / vpt[0], (e.pointer.y - vpt[5]) / vpt[3])
  }

  // 添加 group 移动事件处理
  const groupMoveHandler = () => {
    canvas.requestRenderAll()
  }

  // 在初始化时添加事件监听
  maskGroup.on('moved', groupMoveHandler)

  // 修改 isPointInImage 函数，每次都重新获取边界
  const isPointInImage = (pointer: fabric.Point) => {
    // 强制更新组的边界盒
    maskGroup.setCoords()
    const imageBounds = maskGroup.getBoundingRect(true) // true 参数确保获取绝对坐标
    const offset = 5
    return (
      pointer.x >= imageBounds.left + offset &&
      pointer.x <= imageBounds.left + imageBounds.width - offset &&
      pointer.y >= imageBounds.top + offset &&
      pointer.y <= imageBounds.top + imageBounds.height - offset
    )
  }

  // 修改 constrainPoint 函数，每次都重新获取边界
  const constrainPoint = (pointer: fabric.Point) => {
    // 强制更新组的边界盒
    maskGroup.setCoords()
    const imageBounds = maskGroup.getBoundingRect(true) // true 参数确保获取绝对坐标
    const offset = getState().optionsPanel.strokeSize / 2
    return new fabric.Point(
      Math.min(
        Math.max(pointer.x, imageBounds.left + offset),
        imageBounds.left + imageBounds.width - offset,
      ),
      Math.min(
        Math.max(pointer.y, imageBounds.top + offset),
        imageBounds.top + imageBounds.height - offset,
      ),
    )
  }

  let isDrawing = false
  let points: fabric.Point[] = []

  // 添加创建路径的辅助函数
  const createPath = (points: fabric.Point[]) => {
    const { strokeColor, strokeSize } = getState().optionsPanel
    return new fabric.Path(points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '), {
      stroke: strokeColor,
      strokeWidth: strokeSize,
      opacity: 0.5,
      fill: '',
      selectable: false,
      evented: false,
    })
  }

  // 添加清除临时路径的辅助函数
  const clearTemporaryPath = () => {
    const objects = canvas.getObjects()
    const lastObject = objects[objects.length - 1]
    if (lastObject && lastObject !== maskGroup) {
      canvas.remove(lastObject)
    }
  }

  // 添加创建 SVG 光标的函数
  const createSvgCursor = (size: number, color: string) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" height="${size}" width="${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}"/>
      </svg>
    `
    const encodedSvg = encodeURIComponent(svg)
    return `url("data:image/svg+xml;utf8,${encodedSvg}") ${size / 2} ${size / 2}, crosshair`
  }

  const mouseMoveHandler = (e: fabric.IEvent) => {
    const pointer = getActualPointer(e)
    if (!pointer) return

    if (isPointInImage(pointer)) {
      maskGroup.selectable = false
      maskGroup.evented = false
      const { strokeColor, strokeSize } = getState().optionsPanel
      const cursorColor = strokeColor.startsWith('rgba')
        ? strokeColor
        : strokeColor.replace('rgb', 'rgba').replace(')', ', 0.7)')
      canvas.defaultCursor = createSvgCursor(strokeSize, cursorColor)
    } else {
      canvas.defaultCursor = 'default'
      maskGroup.selectable = true
      maskGroup.evented = true
    }

    if (!isDrawing) return
    canvas.discardActiveObject()
    const point = constrainPoint(pointer)
    points.push(point)

    if (points.length > 1) {
      clearTemporaryPath()
      const path = createPath(points)
      canvas.add(path)
      canvas.requestRenderAll()
    }
  }

  const mouseDownHandler = (e: fabric.IEvent) => {
    const pointer = getActualPointer(e)
    if (!pointer) return

    if (isPointInImage(pointer)) {
      isDrawing = true
      points = []
      const point = constrainPoint(pointer)
      points.push(point)

      const { strokeColor, strokeSize } = getState().optionsPanel
      const cursorColor = strokeColor.startsWith('rgba')
        ? strokeColor
        : strokeColor.replace('rgb', 'rgba').replace(')', ', 0.7)')
      canvas.defaultCursor = createSvgCursor(strokeSize, cursorColor)
    }
  }

  const mouseUpHandler = () => {
    if (!isDrawing) return
    isDrawing = false
    canvas.setActiveObject(maskGroup)
    console.log('mouseUpHandler')

    maskGroup.selectable = true
    maskGroup.evented = true
    if (points.length > 1) {
      clearTemporaryPath()
      const path = createPath(points)
      maskGroup.addWithUpdate(path)
      canvas.requestRenderAll()
    }
    points = []
    canvas.requestRenderAll()
    // 重置光标为默认
    canvas.defaultCursor = 'default'
  }

  canvas.on('mouse:down', mouseDownHandler)
  canvas.on('mouse:move', mouseMoveHandler)
  canvas.on('mouse:up', mouseUpHandler)

  // Cleanup function
  return () => {
    drawImgInLine.selectable = true
    drawImgInLine.evented = true
    maskGroup.selectable = true
    maskGroup.evented = true
    canvas.off('mouse:down', mouseDownHandler)
    canvas.off('mouse:move', mouseMoveHandler)
    canvas.off('mouse:up', mouseUpHandler)
    maskGroup.off('moved', groupMoveHandler) // 移除移动事件监听
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'
  }
}
