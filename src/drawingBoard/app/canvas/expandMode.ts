import { ApplyCanvasModeFunc } from './canvasMode'
import { fabric } from 'fabric'

export const expandMode: ApplyCanvasModeFunc<undefined> = (canvas, _, dispatch) => {
  // 获取当前激活的对象
  const activeObject = canvas.getActiveObject()
  if (!activeObject) return () => {}

  // 创建扩展框
  const bounds = activeObject.getBoundingRect()
  const padding = 50 // 扩展框与对象之间的padding

  const expandBox = new fabric.Rect({
    left: bounds.left - padding,
    top: bounds.top - padding,
    width: bounds.width + padding * 5,
    height: bounds.height + padding * 2,
    fill: 'transparent',
    stroke: '#2196F3',
    strokeWidth: 2,
    selectable: true,
    hasControls: true,
    hasBorders: true,
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    transparentCorners: false,
    cornerColor: '#2196F3',
    cornerSize: 10,
    cornerStyle: 'circle',
    evented: true,
  })

  // 确保内部对象可以移动和选中
  activeObject.set({
    selectable: true,
    evented: true,
    hasControls: false,
    hasBorders: true,
    lockRotation: true,
  })

  // 添��扩展框到画布
  canvas.add(expandBox)

  // 将内部对象移到扩展框上层
  activeObject.moveTo(canvas.getObjects().length - 1)

  // 设置扩展框为活动对象
  canvas.setActiveObject(expandBox)

  // 处理鼠标事件
  const handleMouseDown = (e: fabric.IEvent) => {
    const pointer = canvas.getPointer(e.e)
    const objects = canvas.getObjects()

    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i]
      if (
        obj === activeObject &&
        obj.containsPoint({ x: pointer.x, y: pointer.y } as fabric.Point)
      ) {
        canvas.setActiveObject(obj)
        canvas.requestRenderAll()
        break
      }
    }
  }

  // 限制对象移动范围
  const handleObjectMoving = (e: fabric.IEvent) => {
    const obj = e.target
    if (!obj || obj === expandBox) return

    const objBounds = obj.getBoundingRect(true, true) // 使用true参数获取精确边界
    const boxBounds = expandBox.getBoundingRect(true, true)

    let newLeft = obj.left
    let newTop = obj.top

    // 计算对象的实际尺寸
    const objWidth = objBounds.width / obj.scaleX!
    const objHeight = objBounds.height / obj.scaleY!

    // 限制左边界
    if (objBounds.left < boxBounds.left) {
      newLeft = boxBounds.left
    }

    // 限制右边界
    if (objBounds.left + objBounds.width > boxBounds.left + boxBounds.width) {
      newLeft = boxBounds.left + boxBounds.width - objWidth * obj.scaleX!
    }

    // 限制上边界
    if (objBounds.top < boxBounds.top) {
      newTop = boxBounds.top
    }

    // 限制下边界
    if (objBounds.top + objBounds.height > boxBounds.top + boxBounds.height) {
      newTop = boxBounds.top + boxBounds.height - objHeight * obj.scaleY!
    }

    obj.set({
      left: newLeft,
      top: newTop,
    })

    obj.setCoords()
  }

  const handleBoxScaling = (e: fabric.IEvent) => {
    const box = e.target
    if (!box || box !== expandBox) return
    const boxBounds = box.getBoundingRect(true, true)
    const activeBounds = activeObject.getBoundingRect(true, true)
  }

  // 添加事件监听
  canvas.on('mouse:down', handleMouseDown)
  canvas.on('object:moving', handleObjectMoving)
  canvas.on('object:scaling', handleBoxScaling)

  // 清理函数
  return () => {
    // 恢复内部对象的原始状态
    activeObject.set({
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: false,
    })

    canvas.off('mouse:down', handleMouseDown)
    canvas.off('object:moving', handleObjectMoving)
    canvas.off('object:scaling', handleBoxScaling)
    canvas.remove(expandBox)
    canvas.renderAll()
  }
}
