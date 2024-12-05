import { fabric } from 'fabric'
import { ApplyCanvasModeFunc } from './canvasMode'

type RectOptions = {
  strokeColor: string
  strokeSize: number
  fillColor: string
}

export const drawRectMode: ApplyCanvasModeFunc<RectOptions> = (canvas, getState) => {
  let isDrawing = false
  let startPoint = { x: 0, y: 0 }
  let currentRect: fabric.Rect | null = null

  const createRect = (pointer: { x: number; y: number }) => {
    const { fillColor, strokeColor, strokeSize } = getState().optionsPanel
    const objects = canvas.getObjects()
    const rectCount = objects.filter((o) => o.type === 'rect').length

    return new fabric.Rect({
      name: `Rect ${rectCount + 1}`,
      left: pointer.x,
      top: pointer.y,
      originX: 'left',
      originY: 'top',
      width: 0,
      height: 0,
      angle: 0,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeSize,
      transparentCorners: false,
      selectable: true,
      hasControls: false,
      hasBorders: false,
    })
  }

  const updateRectSize = (rect: fabric.Rect, pointer: { x: number; y: number }) => {
    const width = Math.abs(pointer.x - startPoint.x)
    const height = Math.abs(pointer.y - startPoint.y)
    const left = pointer.x < startPoint.x ? pointer.x : startPoint.x
    const top = pointer.y < startPoint.y ? pointer.y : startPoint.y

    rect.set({
      left,
      top,
      width,
      height,
    })
  }

  canvas.on('mouse:down', function onMouseDown(event) {
    if (event.target) {
      isDrawing = false
      return
    }

    isDrawing = true
    const pointer = canvas.getPointer(event.e)
    startPoint = { x: pointer.x, y: pointer.y }
    currentRect = createRect(startPoint)
    canvas.add(currentRect)
    canvas.setActiveObject(currentRect)
  })

  canvas.on('mouse:move', function onMouseMove(event) {
    if (!isDrawing || !currentRect) return

    const pointer = canvas.getPointer(event.e)
    updateRectSize(currentRect, pointer)
    canvas.renderAll()
  })

  canvas.on('mouse:up', function onMouseUp() {
    if (!isDrawing || !currentRect) return

    isDrawing = false

    if (currentRect.width === 0 || currentRect.height === 0) {
      canvas.remove(currentRect)
    }

    currentRect = null
  })

  return () => {
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
  }
}
