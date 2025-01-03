import { setActiveObjectBoundingRect } from '@/drawingBoard/features/menuSideModePanel/menuSildeSlice'
import { fabric } from 'fabric'
import { ApplyCanvasModeFunc } from './canvasMode'

export const menuSidePanelMode: ApplyCanvasModeFunc<undefined> = (canvas, getState, dispatch) => {
  function setMenuSidePanelPositionHandler(event: fabric.IEvent) {
    if (!event.target) {
      const active = canvas.getActiveObject()
      if (active) {
        dispatch(setActiveObjectBoundingRect(active.getBoundingRect() ?? null))
      }
    } else {
      dispatch(setActiveObjectBoundingRect(event.target?.getBoundingRect() ?? null))
    }
  }
  canvas.on('object:moving', setMenuSidePanelPositionHandler)
  canvas.on('object:scaling', setMenuSidePanelPositionHandler)
  canvas.on('mouse:wheel', setMenuSidePanelPositionHandler)
  return () => {
    canvas.off('object:moving', setMenuSidePanelPositionHandler)
    canvas.off('object:scaling', setMenuSidePanelPositionHandler)
    canvas.off('mouse:wheel', setMenuSidePanelPositionHandler)
  }
}
