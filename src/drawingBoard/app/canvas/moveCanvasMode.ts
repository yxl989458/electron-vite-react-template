import { ApplyCanvasModeFunc } from './canvasMode'

interface MoveCanvasMode extends fabric.Canvas {
  isDragging: boolean
  lastPosX: number
  lastPosY: number
}

export const moveCanvasMode: ApplyCanvasModeFunc<undefined> = (canvas, _, dispatch) => {
  canvas.on('mouse:down', function (this: MoveCanvasMode, opt) {
    var evt = opt.e
    this.isDragging = true
    this.lastPosX = evt.clientX
    this.lastPosY = evt.clientY
  })

  canvas.on('mouse:move', function (this: MoveCanvasMode, opt) {
    if (this.isDragging) {
      var e = opt.e
      var vpt = this.viewportTransform
      if (!vpt) return
      vpt[4] += e.clientX - this.lastPosX
      vpt[5] += e.clientY - this.lastPosY
      this.requestRenderAll()
      this.lastPosX = e.clientX
      this.lastPosY = e.clientY
    }
  })

  canvas.on('mouse:up', function (this: MoveCanvasMode, opt) {
    if (!this.viewportTransform) return
    this.setViewportTransform(this.viewportTransform)
    this.isDragging = false
  })

  return () => {
    canvas.off('mouse:down')
    canvas.off('mouse:move')
    canvas.off('mouse:up')
  }
}
