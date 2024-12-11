import { ApplyCanvasModeFunc } from './canvasMode'
import { fabric } from 'fabric'

export const expandMode: ApplyCanvasModeFunc<undefined> = (canvas, _, dispatch) => {
  const activeObject = canvas.getActiveObject()
  if (!activeObject || activeObject.type !== 'image') return () => { }

  // 获取物体的边界框，考虑画布变换
  const bounds = activeObject.getBoundingRect(true, true)
  const padding = 50 // 基础padding值

  // 创建扩展框配置
  const expandBox = new fabric.Rect(
    {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width + padding,
      height: bounds.height + padding,
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
    }
  )

  // 确保内部对象可以移动和选中
  activeObject.set({
    selectable: true,
    evented: true,
    hasControls: false,
    hasBorders: false,
    lockRotation: true,
  })

  // 添加扩展框到画布
  canvas.add(expandBox)

  // 将内部对象移到扩展框上层
  activeObject.moveTo(canvas.getObjects().length - 1)

  // 设置扩展框为活动对象
  canvas.setActiveObject(expandBox)

  let isDragging = false
  let lastPointer: { x: number, y: number } | null = null

  // 处理鼠标事件
  const handleMouseDown = (e: fabric.IEvent) => {
    const pointer = canvas.getPointer(e.e)
    // 获取活动对象的边界
    const objBounds = activeObject.getBoundingRect(true, true)
    
    // 检查点击是否在对象范围内
    if (
      pointer.x >= objBounds.left &&
      pointer.x <= objBounds.left + objBounds.width &&
      pointer.y >= objBounds.top &&
      pointer.y <= objBounds.top + objBounds.height
    ) {
      isDragging = true
      lastPointer = pointer
      canvas.setActiveObject(expandBox)
      canvas.requestRenderAll()
    }
  }

  const handleMouseMove = (e: fabric.IEvent) => {
    if (!isDragging || !lastPointer) return

    const pointer = canvas.getPointer(e.e)
    
    // 计算在画布坐标系中的移动距离
    const dx = pointer.x - lastPointer.x
    const dy = pointer.y - lastPointer.y

    // 计算新位置
    let newLeft = activeObject.left! + dx
    let newTop = activeObject.top! + dy

    // 获取边界
    const expandBoxBounds = expandBox.getBoundingRect(true, true)
    const objectBounds = activeObject.getBoundingRect(true, true)

    // 计算边界限制
    const minLeft = expandBoxBounds.left
    const maxLeft = expandBoxBounds.left + expandBoxBounds.width - objectBounds.width
    const minTop = expandBoxBounds.top
    const maxTop = expandBoxBounds.top + expandBoxBounds.height - objectBounds.height

    // 应用边界限制
    newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft)
    newTop = Math.min(Math.max(newTop, minTop), maxTop)

    activeObject.set({
      left: newLeft,
      top: newTop
    })

    activeObject.setCoords()
    canvas.requestRenderAll()

    lastPointer = pointer
  }

  const handleMouseUp = () => {
    isDragging = false
    lastPointer = null
  }

  const handleBoxScaling = (e: fabric.IEvent) => {
    const box = e.target as fabric.Object & {
      lastGoodScaleX?: number
      lastGoodScaleY?: number
      lastGoodLeft?: number
      lastGoodTop?: number
    }
    if (!box || box !== expandBox) return

    const objBounds = activeObject.getBoundingRect(true, true)
    const boxBounds = box.getBoundingRect(true, true)

    // 保存上一次的有效位置和缩放值
    if (!box.lastGoodScaleX) {
      box.lastGoodScaleX = box.scaleX
      box.lastGoodScaleY = box.scaleY
      box.lastGoodLeft = box.left
      box.lastGoodTop = box.top
    }

    // 检查是否会导致内部对象超出边界
    const isValid = (
      boxBounds.left <= objBounds.left &&
      boxBounds.top <= objBounds.top &&
      boxBounds.left + boxBounds.width >= objBounds.left + objBounds.width &&
      boxBounds.top + boxBounds.height >= objBounds.top + objBounds.height
    )

    if (!isValid) {
      // 如果无效，恢复到上一次的有效状态
      box.set({
        scaleX: box.lastGoodScaleX,
        scaleY: box.lastGoodScaleY,
        left: box.lastGoodLeft,
        top: box.lastGoodTop
      })
    } else {
      // 如果有效，更新最后的有效状态
      box.lastGoodScaleX = box.scaleX
      box.lastGoodScaleY = box.scaleY
      box.lastGoodLeft = box.left
      box.lastGoodTop = box.top
    }

    canvas.requestRenderAll()
  }

  // 设置扩展框属性
  expandBox.set({
    lockMovementX: true,
    lockMovementY: true,
    hasControls: true,
    hasBorders: true,
    selectable: true
  })

  // 添加事件监听
  canvas.on('mouse:down', handleMouseDown)
  canvas.on('mouse:move', handleMouseMove)
  canvas.on('mouse:up', handleMouseUp)
  canvas.on('object:scaling', handleBoxScaling)

  // 清理函数
  return () => {
    activeObject.set({
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
      lockRotation: false
    })

    canvas.off('mouse:down', handleMouseDown)
    canvas.off('mouse:move', handleMouseMove)
    canvas.off('mouse:up', handleMouseUp)
    canvas.off('object:scaling', handleBoxScaling)
    canvas.remove(expandBox)
    canvas.renderAll()
  }
}
