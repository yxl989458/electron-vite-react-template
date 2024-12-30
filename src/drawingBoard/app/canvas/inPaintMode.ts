import { fabric } from 'fabric'
import { setPath } from '../inPaintSlice'
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
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true,
    lockMovementX: true,
    lockMovementY: true,
  })
  canvas.remove(drawImgInLine)
  canvas.add(maskGroup)
  canvas.setActiveObject(maskGroup)
  canvas.requestRenderAll()

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
  function createPath(points: fabric.Point[]) {
    const { strokeColor, strokeSize } = getState().optionsPanel

    // 生成平滑的路径命令
    const path = points.reduce((acc, point, i, points) => {
      if (i === 0) {
        // 移动到第一个点
        return `M ${point.x} ${point.y}`
      }
      if (i < points.length - 2) {
        // 计算控制点
        const xc = (point.x + points[i + 1].x) / 2
        const yc = (point.y + points[i + 1].y) / 2
        // 使用二次贝塞尔曲线
        return `${acc} Q ${point.x} ${point.y}, ${xc} ${yc}`
      }
      // 最后一个点使用线性路径
      return `${acc} L ${point.x} ${point.y}`
    }, '')

    dispatch(setPath(path))
    return new fabric.Path(path, {
      stroke: strokeColor,
      strokeWidth: strokeSize,
      opacity: 1,
      fill: '',
      selectable: false,
      evented: false,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
    })
  }

  // 添加创建 SVG 光标的函数
  const createSvgCursor = (size: number, color: string) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}"/>
      </svg>
    `.trim()
    const encoded = window.btoa(svg)
    return `url(data:image/svg+xml;base64,${encoded}) ${size / 2} ${size / 2}, crosshair`
  }

  // 添加变量跟踪当前正在绘制的路径
  let currentPath: fabric.Path | null = null

  const mouseMoveHandler = (e: fabric.IEvent) => {
    const pointer = getActualPointer(e)
    if (!pointer) return

    if (!canvas.getActiveObject()) {
      canvas.setActiveObject(maskGroup)
    }

    if (isPointInImage(pointer)) {
      const { strokeColor, strokeSize } = getState().optionsPanel
      const cursorColor = strokeColor.startsWith('rgba')
        ? strokeColor
        : strokeColor.replace('rgb', 'rgba').replace(')', ', 0.5)')

      const cursor = createSvgCursor(strokeSize, cursorColor)
      canvas.defaultCursor = cursor
      canvas.setCursor(cursor)
      canvas.requestRenderAll()
    } else {
      canvas.defaultCursor = 'default'
    }

    if (!isDrawing) return

    const point = constrainPoint(pointer)

    // 如果与上一个点距离太远，插入中间点
    if (points.length > 0) {
      const lastPoint = points[points.length - 1]
      const distance = Math.sqrt(
        Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2),
      )

      if (distance > 2) {
        // 如果点之间距离大于2像素
        const steps = Math.floor(distance / 2)
        for (let i = 1; i < steps; i++) {
          const ratio = i / steps
          const interpolatedPoint = new fabric.Point(
            lastPoint.x + (point.x - lastPoint.x) * ratio,
            lastPoint.y + (point.y - lastPoint.y) * ratio,
          )
          points.push(interpolatedPoint)
        }
      }
    }

    points.push(point)

    if (points.length > 1) {
      if (currentPath) {
        maskGroup.remove(currentPath)
      }
      currentPath = createPath(points)
      maskGroup.addWithUpdate(currentPath)
      canvas.requestRenderAll()
    }
  }

  const mouseDownHandler = (e: fabric.IEvent) => {
    const pointer = getActualPointer(e)
    if (!pointer) return

    canvas.setActiveObject(maskGroup)

    if (isPointInImage(pointer)) {
      isDrawing = true
      points = []
      currentPath = null // 重置当前路径
      const point = constrainPoint(pointer)
      points.push(point)

      const { strokeColor, strokeSize } = getState().optionsPanel
      const cursorColor = strokeColor.startsWith('rgba')
        ? strokeColor
        : strokeColor.replace('rgb', 'rgba').replace(')', ', 0.5)')

      const cursor = createSvgCursor(strokeSize, cursorColor)
      canvas.defaultCursor = cursor
      canvas.setCursor(cursor)
      canvas.requestRenderAll()
    }
  }

  const mouseUpHandler = () => {
    if (!isDrawing) return
    isDrawing = false

    canvas.setActiveObject(maskGroup)

    currentPath = null
    points = []

    canvas.defaultCursor = 'default'
    canvas.setCursor('default')
    canvas.requestRenderAll()
  }

  canvas.on('mouse:down', mouseDownHandler)
  canvas.on('mouse:move', mouseMoveHandler)
  canvas.on('mouse:up', mouseUpHandler)

  // 添加鼠标离开画布的处理
  canvas.on('mouse:out', () => {
    canvas.setActiveObject(maskGroup)
    canvas.requestRenderAll()
  })

  // Cleanup function
  return () => {
    drawImgInLine.selectable = true
    drawImgInLine.evented = true
    maskGroup.selectable = true
    maskGroup.evented = true
    maskGroup.lockMovementX = false
    maskGroup.lockMovementY = false
    canvas.off('mouse:down', mouseDownHandler)
    canvas.off('mouse:move', mouseMoveHandler)
    canvas.off('mouse:up', mouseUpHandler)
    maskGroup.off('moved', groupMoveHandler) // 移除移动事件监听
    canvas.defaultCursor = 'default'
    canvas.hoverCursor = 'move'
  }
}
