import { fabric } from 'fabric'
import { ApplyCanvasModeFunc } from './canvasMode'

export const darwinPaint: ApplyCanvasModeFunc<undefined> = (canvas, getState, dispatch) => {
  const activeObject = canvas.getActiveObject()
  if (!activeObject || activeObject.type !== 'image') {
    return () => {}
  }

  // Save the current selected image object
  const image = activeObject as fabric.Image

  // Create a group to contain the image and its mask
  let maskGroup = new fabric.Group([image], {
    left: image.left,
    top: image.top,
  })
  canvas.remove(image)
  canvas.add(maskGroup)
  canvas.setActiveObject(maskGroup)

  // Disable selection and events for the group

  const isPointInImage = (x: number, y: number) => {
    const imageBounds = maskGroup.getBoundingRect()
    return (
      x >= imageBounds.left &&
      x <= imageBounds.left + imageBounds.width &&
      y >= imageBounds.top &&
      y <= imageBounds.top + imageBounds.height
    )
  }

  // Set brush properties
  canvas.isDrawingMode = true
  const pencilBrush = new fabric.PencilBrush(canvas)
  pencilBrush.color = 'rgba(255, 255, 255, 0.5)'
  pencilBrush.width = 20
  canvas.freeDrawingBrush = pencilBrush

  let currentPath: fabric.Path | null = null

  const mouseDownHandler = (e: fabric.IEvent) => {
    canvas.isDrawingMode = true
    if (!e.pointer) return
    canvas.isDrawingMode = isPointInImage(e.pointer.x, e.pointer.y)
  }

  const mouseMoveHandler = (e: fabric.IEvent) => {
    if (!e.pointer) return
    if (!isPointInImage(e.pointer.x, e.pointer.y)) {
      canvas.isDrawingMode = false
    }
  }

  const pathCreatedHandler = (e: fabric.IEvent) => {
    const drawnPath = canvas.getObjects().reverse()[0]
    drawnPath.selectable = false
    drawnPath.evented = false
    maskGroup.addWithUpdate(drawnPath)

    canvas.requestRenderAll()
  }

  const mouseUpHandler = () => {
    // canvas.isDrawingMode = false
  }

  canvas.on('mouse:down', mouseDownHandler)
  canvas.on('mouse:move', mouseMoveHandler)
  canvas.on('path:created', pathCreatedHandler)
  canvas.on('mouse:up', mouseUpHandler)

  // Cleanup function
  return () => {
    // Re-enable selection and events for the image
    image.selectable = true
    image.evented = true

    // Remove event listeners
    canvas.off('mouse:down', mouseDownHandler)
    canvas.off('mouse:move', mouseMoveHandler)
    canvas.off('path:created', pathCreatedHandler)
    canvas.off('mouse:up', mouseUpHandler)

    // Disable drawing mode
    canvas.isDrawingMode = false
  }
}
