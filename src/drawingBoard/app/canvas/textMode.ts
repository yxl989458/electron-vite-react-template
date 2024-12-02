import { toolSelected } from '@/drawingBoard/features/toolsPanel/toolsPanelSlice'
import { ApplyCanvasModeFunc } from './canvasMode'
import { fabric } from 'fabric'

export const textMode: ApplyCanvasModeFunc<undefined> = (canvas, _, dispatch) => {
  function createText(pointer: { x: number; y: number }) {
    return new fabric.Textbox('', {
      left: pointer.x,
      top: pointer.y,
      fontSize: 32,
      borderColor: '#2196f3',
      hasControls: true,
    })
  }

  canvas.on('mouse:down', (opt) => {
    if (!opt.e) return
    const pointer = canvas.getPointer(opt.e)
    const text = createText(pointer)
    canvas.add(text)
    canvas.setActiveObject(text)
    text.enterEditing()
    canvas.renderAll()
  })

  canvas.on('mouse:up', (opt) => {
    dispatch(toolSelected('move'))
  })

  return () => {
    canvas.off('mouse:down')
    canvas.off('mouse:up')
  }
}
